import React from 'react';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Page not found</p>
      <button
        onClick={() => window.location.href = import.meta.env.BASE_URL}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all"
      >
        Go Home
      </button>
    </div>
  );
}
