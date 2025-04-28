/**
 * Configuration options for the OpenRouter model
 */
export interface ModelOptions {
  temperature: number;
  max_tokens: number;
}

/**
 * Configuration for the OpenRouter service
 */
export interface Configuration {
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
  defaultOptions: ModelOptions;
}

/**
 * Model details returned by the service
 */
export interface ModelDetails {
  name: string;
  options: ModelOptions;
}

/**
 * Request payload structure for OpenRouter API
 */
export interface RequestPayload {
  messages: Array<{
    role: 'system' | 'user';
    content: string;
  }>;
  model: string;
  temperature: number;
  max_tokens: number;
}

/**
 * Parsed response from OpenRouter API
 */
export interface ParsedResponse {
  text: string;
  tokens: number;
} 