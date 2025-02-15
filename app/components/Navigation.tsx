'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const { user, signInWithGoogle, signOut } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="nav-island">
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl font-bold gradient-text">Swarm</span>
        </Link>
        
        <div className="flex items-center space-x-8">
          <Link 
            href="/"
            className={`tab-button ${isActive('/') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/create"
            className={`tab-button ${isActive('/create') ? 'active' : ''}`}
          >
            Create Test
          </Link>
          <Link 
            href="/results"
            className={`tab-button ${isActive('/results') ? 'active' : ''}`}
          >
            Results
          </Link>
          <Link 
            href="/docs"
            className={`tab-button ${isActive('/docs') ? 'active' : ''}`}
          >
            Documentation
          </Link>
        </div>

        <div>
          {user ? (
            <button 
              onClick={signOut}
              className="px-6 py-3 rounded-lg border border-white/20 text-white/90 hover:bg-white/5 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="glow-button"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
} 