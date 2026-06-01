import { useEffect } from 'react';

export default function Callback() {
  useEffect(() => {
    // Discord implicit flow returns token in the URL hash fragment
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');

    if (token) {
      localStorage.setItem('discord_token', token);
    }

    // Redirect to home
    window.location.href = import.meta.env.BASE_URL;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-accent rounded-full animate-spin" />
    </div>
  );
}
