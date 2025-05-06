import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TextInputPage from '../page';
import { TextInputForm } from '@/components/TextInputForm';
import { ResultsSection } from '@/components/ResultsSection';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import type { CorrectionStyle } from '@/types';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the components and hooks
vi.mock('@/components/TextInputForm', () => ({
  TextInputForm: vi.fn(({ style, onStyleChange, onSubmit, isLoading }) => {
    const handleSubmit = async (text: string) => {
      await onSubmit(text);
    };

    return (
      <div data-testid="text-input-form">
        <textarea 
          data-testid="text-input"
          onChange={(e) => handleSubmit(e.target.value)}
        />
        <select 
          data-testid="style-select" 
          value={style} 
          onChange={(e) => onStyleChange(e.target.value as CorrectionStyle)}
        >
          <option value="formal" data-testid="formal-option">Formal</option>
          <option value="natural" data-testid="natural-option">Natural</option>
        </select>
        <button 
          data-testid="submit-button" 
          disabled={isLoading}
          onClick={() => handleSubmit('Sample text')}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
        TextInputForm Mock
      </div>
    );
  })
}));

vi.mock('@/components/ResultsSection', () => ({
  ResultsSection: vi.fn(({ correctionData }) => (
    <div data-testid="results-section">
      <div data-testid="proposed-text">{correctionData.proposedText}</div>
      <div data-testid="educational-comment">{correctionData.educationalComment}</div>
    </div>
  ))
}));

vi.mock('@/lib/auth/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}));

describe('TextInputPage', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default auth mock for logged in user
    (useAuth as any).mockReturnValue({
      user: mockUser,
      isLoading: false
    });

    // Setup default router mock
    (useRouter as any).mockReturnValue({
      push: vi.fn()
    });

    // Reset component mocks
    (TextInputForm as any).mockClear();
    (ResultsSection as any).mockClear();
    mockFetch.mockClear();
  });

  it('renders correctly for logged in user', () => {
    render(<TextInputPage />);

    // Check if TextInputForm is rendered
    const textInputForm = screen.getByTestId('text-input-form');
    expect(textInputForm).toBeInTheDocument();

    // Check if TextInputForm receives correct props
    const textInputFormCall = vi.mocked(TextInputForm).mock.lastCall?.[0];
    expect(textInputFormCall).toMatchObject({
      isLoading: false,
      style: 'formal',
      hasGeneratedBefore: false,
      isAuthenticated: true,
      defaultText: '',
      onStyleChange: expect.any(Function),
      onSubmit: expect.any(Function)
    });

    // Results section should not be visible initially
    const resultsSection = screen.queryByTestId('results-section');
    expect(resultsSection).not.toBeInTheDocument();
  });

  it('updates correction style when user changes style', async () => {
    const user = userEvent.setup();
    render(<TextInputPage />);
    
    // Verify initial style
    let textInputFormCall = vi.mocked(TextInputForm).mock.lastCall?.[0];
    expect(textInputFormCall?.style).toBe('formal');

    // Change style to natural using select
    const styleSelect = screen.getByTestId('style-select');
    expect(styleSelect).toHaveValue('formal'); // Verify initial value
    await user.selectOptions(styleSelect, 'natural');
    expect(styleSelect).toHaveValue('natural'); // Verify select value changed

    // Verify that TextInputForm was called again with new style
    textInputFormCall = vi.mocked(TextInputForm).mock.lastCall?.[0];
    expect(textInputFormCall?.style).toBe('natural');
  });

  it('generates correction when user submits text', async () => {
    // Mock successful API response with delay to simulate real API call
    mockFetch.mockImplementationOnce(() => 
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({
              proposed_text: "Corrected sample text",
              educational_comment: "Here's what was improved..."
            })
          });
        }, 100);
      })
    );

    render(<TextInputPage />);

    // Get the submit button
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();

    // Click the submit button
    await act(async () => {
      await userEvent.click(submitButton);
    });

    // Wait for loading state to be set
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Generating...');
    });

    // Wait for API response and verify results
    const resultsSection = await screen.findByTestId('results-section');
    expect(resultsSection).toBeInTheDocument();
    
    // Verify API call
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/corrections/generate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_text: 'Sample text',
          correction_style: 'formal'
        })
      })
    );

    // Verify results are displayed
    const proposedText = screen.getByTestId('proposed-text');
    const educationalComment = screen.getByTestId('educational-comment');
    expect(proposedText).toHaveTextContent('Corrected sample text');
    expect(educationalComment).toHaveTextContent("Here's what was improved...");

    // Wait for loading state to be cleared
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Generate');
    });
  });
}); 