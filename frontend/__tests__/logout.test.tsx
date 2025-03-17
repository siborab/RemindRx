import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Logout } from '@/app/components/logout';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/supabase/client', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

describe('Logout Component', () => {
  it('renders the logout button', () => {
    render(<Logout />);
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
  });

  it('calls signOut', async () => {

    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

    render(<Logout />);
    const button = screen.getByRole('button', { name: /logout/i });
    await fireEvent.click(button);

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('handles logout error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); 

    (supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: new Error('Sign out failed'),
    });

    render(<Logout />);
    const button = screen.getByRole('button', { name: /logout/i });
    await fireEvent.click(button);

    expect(consoleErrorSpy).toHaveBeenCalled(); 
    consoleErrorSpy.mockRestore(); 
  });
});