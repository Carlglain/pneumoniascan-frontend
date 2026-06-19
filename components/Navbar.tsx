'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

const navLinks = [
  { href: '/',            hash: '',            label: 'Home'         },
  { href: '/#about',      hash: '#about',      label: 'About'        },
  { href: '/#how-it-works', hash: '#how-it-works', label: 'How It Works' },
  { href: '/history',     hash: '',            label: 'History'      },
];

export default function Navbar() {
  const pathname = usePathname();
  const [hash, setHash] = useState('');
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (pathname !== '/') { setHash(''); return; }
    setHash(window.location.hash);
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, link: (typeof navLinks)[number]) => {
    if (link.href === '/history') return; // let Next.js handle navigation
    if (pathname !== '/') return;
    e.preventDefault();
    setHash(link.hash);
    if (link.hash) {
      document.getElementById(link.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', link.hash);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', '/');
    }
  };

  const isActive = (link: (typeof navLinks)[number]) => {
    if (link.href === '/history') return pathname === '/history';
    if (pathname !== '/') return false;
    if (link.hash === '') return hash === '' || hash === '#';
    return hash === link.hash;
  };

  return (
    <nav
      className="w-full backdrop-blur-md border-b px-6 py-4 sticky top-0 z-50 transition-colors"
      style={{ backgroundColor: 'var(--bg-nav)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Activity className="text-[#2DD4A0]" size={22} />
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            PneumoScan AI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className={`text-sm font-medium transition-colors relative pb-0.5 ${
                isActive(link)
                  ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2DD4A0] after:rounded-full'
                  : ''
              }`}
              style={{ color: isActive(link) ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-overlay)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link
            href="/analyze"
            className="bg-[#2DD4A0] text-[#0A1628] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#25b88a] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
