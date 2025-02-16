'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const HoneycombIcon = () => (
  <div className="relative w-8 h-8">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-lg transform rotate-45" />
    <div className="absolute inset-1 bg-black rounded-lg transform rotate-45 flex items-center justify-center">
      <svg className="w-4 h-4 text-primary transform -rotate-45" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4 6.5V17.5L12 22L20 17.5V6.5L12 2ZM18 16.27L12 19.77L6 16.27V7.73L12 4.23L18 7.73V16.27Z" />
      </svg>
    </div>
  </div>
);

export default function Navigation() {
  const pathname = usePathname();
  const { user, signInWithGoogle, signOut } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-4">
      <motion.nav 
        className="relative w-full max-w-7xl mx-auto px-8 py-4 rounded-2xl backdrop-blur-xl bg-black/20 border border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-50" />
        
        {/* Content */}
        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <HoneycombIcon />
            <motion.span 
              className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-display tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Swarm
            </motion.span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex space-x-1 bg-black/20 p-1 rounded-xl backdrop-blur-lg">
              <NavLink href="/" isActive={isActive('/')}>About</NavLink>
              <NavLink href="/dashboard" isActive={isActive('/dashboard')}>Dashboard</NavLink>
              <NavLink href="/create" isActive={isActive('/create')}>Create Test</NavLink>
              <NavLink href="/results" isActive={isActive('/results')}>Results</NavLink>
            </div>
            
            <div className="ml-4">
              {user ? (
                <motion.button 
                  onClick={signOut}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-white/10 text-white/90 hover:border-primary/40 transition-all font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
              ) : (
                <motion.button 
                  onClick={signInWithGoogle}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-black font-semibold hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}

function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        isActive 
          ? 'text-white' 
          : 'text-white/70 hover:text-white'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
} 