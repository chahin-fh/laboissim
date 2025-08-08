import { redirect } from 'next/navigation';

// This is a server component that redirects to avoid build issues
export default function GoogleCallbackPage() {
  // Redirect to a client component that handles the callback
  redirect('/login/google-callback/client');
} 