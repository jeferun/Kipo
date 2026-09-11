import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 pt-24 md:pt-8 w-full">{children}</main>
    </div>
  );
}
