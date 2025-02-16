import './globals.css';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthProvider } from './context/AuthContext';

export const metadata = {
  title: 'Swarm - Scale Your Voice AI Testing',
  description: 'Test your voice AI agents at scale with realistic simulations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <div className="honeycomb-pattern" />
        <div className="honeycomb-grid">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.1 + Math.random() * 0.1,
                transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent"
                   style={{
                     clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                   }}
              />
            </div>
          ))}
        </div>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
