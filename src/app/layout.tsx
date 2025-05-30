import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/app/context/AuthContext';
import ClientVitals from '@/app/components/ClientVitals'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Project',
  description: 'Login app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}
                    <ClientVitals /> 
        </AuthProvider>
      </body>
    </html>
  );
}
