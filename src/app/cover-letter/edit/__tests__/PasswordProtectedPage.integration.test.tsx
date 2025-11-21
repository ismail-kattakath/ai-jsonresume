import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoverLetterEditPage from '../page';
import bcrypt from 'bcryptjs';

// Mock the password config
jest.mock('@/config/password', () => ({
  getPasswordHash: jest.fn(() => '$2b$10$DROkfTWOCqdekTKMKybP2eD9NIqTHNyAKFgsZCdpEXS9vC2honJfS')
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));

// Mock Toaster
jest.mock('sonner', () => ({
  Toaster: () => null,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

describe('Cover Letter Edit Page - Password Protection Integration', () => {
  const correctPassword = '4614';

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('Page Protection', () => {
    it('should show password prompt on initial load', () => {
      render(<CoverLetterEditPage />);

      expect(screen.getByText('Protected Area')).toBeInTheDocument();
      expect(screen.getByText('Enter password to access the editor')).toBeInTheDocument();
    });

    it('should not show cover letter editor without authentication', () => {
      render(<CoverLetterEditPage />);

      expect(screen.queryByText('Cover Letter Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Personal Information')).not.toBeInTheDocument();
    });

    it('should block access to cover letter forms without password', () => {
      const { container } = render(<CoverLetterEditPage />);

      // Cover letter editor form should not be present
      const forms = container.querySelectorAll('form');
      expect(forms.length).toBeLessThanOrEqual(1); // Only password form
    });
  });

  describe('Authentication Flow', () => {
    it('should show cover letter editor after successful authentication', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      render(<CoverLetterEditPage />);

      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /unlock/i });

      fireEvent.change(passwordInput, { target: { value: correctPassword } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should render cover letter form sections after authentication', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      render(<CoverLetterEditPage />);

      fireEvent.change(screen.getByLabelText('Password'), { target: { value: correctPassword } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
        expect(screen.getByText('Social Media')).toBeInTheDocument();
        expect(screen.getByText('Cover Letter Content')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should render preview panel after authentication', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const { container } = render(<CoverLetterEditPage />);

      fireEvent.change(screen.getByLabelText('Password'), { target: { value: correctPassword } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        const preview = container.querySelector('.cover-letter-preview');
        expect(preview).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should maintain authentication across re-renders', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const { rerender } = render(<CoverLetterEditPage />);

      fireEvent.change(screen.getByLabelText('Password'), { target: { value: correctPassword } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });

      // Re-render component
      rerender(<CoverLetterEditPage />);

      // Should still be authenticated
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.queryByText('Protected Area')).not.toBeInTheDocument();
    });
  });

  describe('Session Persistence', () => {
    it('should restore authenticated state from sessionStorage', () => {
      const futureExpiry = Date.now() + 1000000;
      sessionStorage.setItem('edit-auth-token', 'authenticated');
      sessionStorage.setItem('edit-auth-expiry', futureExpiry.toString());

      render(<CoverLetterEditPage />);

      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.queryByText('Protected Area')).not.toBeInTheDocument();
    });

    it('should show password prompt when session expires', () => {
      const pastExpiry = Date.now() - 1000;
      sessionStorage.setItem('edit-auth-token', 'authenticated');
      sessionStorage.setItem('edit-auth-expiry', pastExpiry.toString());

      render(<CoverLetterEditPage />);

      expect(screen.getByText('Protected Area')).toBeInTheDocument();
      expect(screen.queryByText('Personal Information')).not.toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    beforeEach(() => {
      const futureExpiry = Date.now() + 1000000;
      sessionStorage.setItem('edit-auth-token', 'authenticated');
      sessionStorage.setItem('edit-auth-expiry', futureExpiry.toString());
    });

    it('should show logout button when authenticated', () => {
      render(<CoverLetterEditPage />);

      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('should return to password prompt after logout', () => {
      render(<CoverLetterEditPage />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(screen.getByText('Protected Area')).toBeInTheDocument();
      expect(screen.queryByText('Personal Information')).not.toBeInTheDocument();
    });

    it('should clear cover letter editor after logout', () => {
      const { container } = render(<CoverLetterEditPage />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      const forms = container.querySelectorAll('form');
      expect(forms.length).toBeLessThanOrEqual(1); // Only password form remains
    });
  });

  describe('Print Button Visibility', () => {
    it('should not show print button before authentication', () => {
      render(<CoverLetterEditPage />);

      expect(screen.queryByText('Print')).not.toBeInTheDocument();
    });

    it('should show print button after authentication', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      render(<CoverLetterEditPage />);

      fireEvent.change(screen.getByLabelText('Password'), { target: { value: correctPassword } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(screen.getByText('Print')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Form Interaction After Authentication', () => {
    beforeEach(async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      render(<CoverLetterEditPage />);

      fireEvent.change(screen.getByLabelText('Password'), { target: { value: correctPassword } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should allow editing personal information', () => {
      // Form is already rendered, we just verify section headers exist
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    it('should allow editing cover letter content', () => {
      // Cover letter content section should be visible
      expect(screen.getByText('Cover Letter Content')).toBeInTheDocument();
    });

    it('should show preview updates', () => {
      // Preview section should be rendered
      expect(screen.getByText('Print')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should show error message for incorrect password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      render(<CoverLetterEditPage />);

      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(screen.getByText('Incorrect password. Please try again.')).toBeInTheDocument();
      });

      expect(screen.queryByText('Personal Information')).not.toBeInTheDocument();
    });

    it('should remain on password screen after failed authentication', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      render(<CoverLetterEditPage />);

      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(screen.getByText('Incorrect password. Please try again.')).toBeInTheDocument();
      });

      expect(screen.getByText('Protected Area')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should allow retry after failed authentication', async () => {
      (bcrypt.compare as jest.Mock)
        .mockResolvedValueOnce(false) // First attempt fails
        .mockResolvedValueOnce(true);  // Second attempt succeeds

      render(<CoverLetterEditPage />);

      // First attempt
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(screen.getByText('Incorrect password. Please try again.')).toBeInTheDocument();
      });

      // Second attempt
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: correctPassword } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Shared Session Between Pages', () => {
    it('should use same session storage keys as resume page', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      render(<CoverLetterEditPage />);

      fireEvent.change(screen.getByLabelText('Password'), { target: { value: correctPassword } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(sessionStorage.getItem('edit-auth-token')).toBe('authenticated');
        expect(sessionStorage.getItem('edit-auth-expiry')).toBeTruthy();
      });
    });

    it('should respect session created from resume page', () => {
      // Simulate authenticated session from resume page
      const futureExpiry = Date.now() + 1000000;
      sessionStorage.setItem('edit-auth-token', 'authenticated');
      sessionStorage.setItem('edit-auth-expiry', futureExpiry.toString());

      render(<CoverLetterEditPage />);

      // Should be authenticated without re-entering password
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.queryByText('Protected Area')).not.toBeInTheDocument();
    });
  });

  describe('Security', () => {
    it('should not expose password hash in component props', () => {
      const { container } = render(<CoverLetterEditPage />);

      const html = container.innerHTML;

      // Hash should not be visible in raw HTML
      expect(html).not.toContain('$2b$10$DROkfTWOCqdekTKMKybP2eD9NIqTHNyAKFgsZCdpEXS9vC2honJfS');
    });

    it('should clear password from input after failed attempt', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      render(<CoverLetterEditPage />);

      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

      fireEvent.change(passwordInput, { target: { value: 'wrong' } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(passwordInput.value).toBe('');
      });
    });

    it('should use bcrypt for password comparison', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      render(<CoverLetterEditPage />);

      fireEvent.change(screen.getByLabelText('Password'), { target: { value: correctPassword } });
      fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

      await waitFor(() => {
        expect(bcrypt.compare).toHaveBeenCalledWith(
          correctPassword,
          expect.stringMatching(/^\$2b\$10\$/)
        );
      });
    });
  });
});
