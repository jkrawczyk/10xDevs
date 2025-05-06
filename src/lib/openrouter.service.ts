import {
  ModelOptions,
  Configuration,
  ModelDetails,
  RequestPayload,
  ParsedResponse
} from './openrouter.types';

/**
 * OpenRouter service for integrating with OpenRouter API to facilitate LLM-based chat functionality.
 */
export class OpenRouterService {
  private readonly _apiClient: typeof fetch;
  private _retryCount: number = 0;
  private readonly _maxRetries: number = 3;
  private readonly _retryDelay: number = 1000; // Base delay in milliseconds

  public config: Configuration;
  public readonly defaultResponseFormat = {
    type: 'json_schema',
    json_schema: {
        "name": "text_correction",
        "schema": {
          "type": "object",
          "properties": {
            "proposed_text": {
              "type": "string",
              "description": "The corrected version of the original text."
            },
            "educational_comment": {
              "type": "string",
              "description": "Explanation of the changes made, including the mistakes and how to avoid them in the future."
            }
          },
          "required": [
            "proposed_text",
            "educational_comment"
          ],
          "additionalProperties": false
        },
        "strict": true
      }
  };

  constructor(config: Configuration) {
    this.config = {
      apiEndpoint: config.apiEndpoint || 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: config.apiKey,
      modelName: config.modelName || 'openai/gpt-4o-mini',
      defaultOptions: {
        temperature: config.defaultOptions?.temperature ?? 0.7,
        max_tokens: config.defaultOptions?.max_tokens ?? 300
      }
    };
    
    this._apiClient = fetch;
  }

  /**
   * Updates the service configuration
   */
  public setConfiguration(config: Partial<Configuration>): void {
    this.config = {
      ...this.config,
      ...config,
      defaultOptions: {
        ...this.config.defaultOptions,
        ...config.defaultOptions
      }
    };
  }

  /**
   * Returns current model details including name and parameters
   */
  public getModelDetails(): ModelDetails {
    return {
      name: this.config.modelName,
      options: { ...this.config.defaultOptions }
    };
  }

  /**
   * Sends a chat message to the OpenRouter API and returns the response
   */
  public async sendChatMessage(
    message: string,
    options?: Partial<ModelOptions>
  ): Promise<ParsedResponse> {
    const systemMessage = "System: Integracja z OpenRouter API. Umożliwia komunikację między UI a modelem LLM.";
    const payload = this._buildRequestPayload(systemMessage, message, {
      ...this.config.defaultOptions,
      ...options
    });

    try {
      const response = await this._makeRequest(payload);
      return this._parseApiResponse(response);
    } catch (error) {
      this._handleError(error as Error, 'sendChatMessage');
      throw error;
    }
  }

  /**
   * Builds the request payload for the OpenRouter API
   */
  private _buildRequestPayload(
    systemMessage: string,
    userMessage: string,
    options: ModelOptions
  ): RequestPayload {
    return {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      model: this.config.modelName,
      temperature: options.temperature,
      max_tokens: options.max_tokens
    };
  }

  /**
   * Makes a request to the OpenRouter API with exponential backoff retry logic
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async _makeRequest(payload: RequestPayload): Promise<any> {
    while (this._retryCount < this._maxRetries) {
      try {
        const response = await this._apiClient(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
            'HTTP-Referer': 'https://github.com/10x-devs/project', // Required by OpenRouter
            'X-Title': '10x-devs-project' // Required by OpenRouter
          },
          body: JSON.stringify({
            ...payload,
            response_format: this.defaultResponseFormat
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`API request failed: ${error.message || response.statusText}`);
        }

        const jsonResponse = await response.json();
        return jsonResponse;
      } catch (error) {
        this._retryCount++;
        if (this._retryCount === this._maxRetries) {
          throw error;
        }
        // Exponential backoff with jitter
        const delay = this._retryDelay * Math.pow(2, this._retryCount - 1) * (0.5 + Math.random() * 0.5);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Parses and validates the API response
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _parseApiResponse(apiResponse: any): ParsedResponse {
    
    // OpenRouter API returns response in this format:
    // {
    //   choices: [{ message: { content: string }, ... }],
    //   usage: { total_tokens: number }
    // }
    if (!apiResponse?.choices?.[0]?.message?.content) {
      console.error('Invalid API response structure:', apiResponse);
      throw new Error('Invalid API response format');
    }

    return {
      text: apiResponse.choices[0].message.content,
      tokens: apiResponse.usage?.total_tokens ?? 0
    };
  }

  /**
   * Handles errors with proper logging and context
   */
  private _handleError(error: Error, context: string): void {
    // In a production environment, this would be connected to a proper logging service
    console.error(`Error in ${context}:`, error.message);
    
    // Reset retry count after error handling
    this._retryCount = 0;
  }
} 