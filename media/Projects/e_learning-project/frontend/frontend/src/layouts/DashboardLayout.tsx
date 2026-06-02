import React from 'react';
import { Navbar } from '../components/Navbar/Navbar';

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 md:p-6">{children}</main>
    </div>
  );
}