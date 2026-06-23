import Link from 'next/link';
import { Activity } from 'lucide-react';

interface FooterProps {
  variant?: 'full' | 'compact';
}

export default function Footer({ variant = 'full' }: FooterProps) {
  if (variant === 'compact') {
    return (
      <footer
        className="w-full border-t mt-auto"
        style={{
          backgroundColor: 'var(--bg-deep)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-[#2DD4A0]" size={18} />
              <span
                className="font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                PneumoScan AI
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              © 2026 PneumoScan AI. Medical Diagnostic Intelligence.
            </p>
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Quick Links
            </p>
            <div
              className="flex flex-col gap-1.5 text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              <a href="#" className="hover:text-[#2DD4A0] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#2DD4A0] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Support
            </p>
            <div
              className="flex flex-col gap-1.5 text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              <Link
                href="/analyze"
                className="hover:text-[#2DD4A0] transition-colors"
              >
                Start Analysis
              </Link>
              <a
                href="/#how-it-works"
                className="hover:text-[#2DD4A0] transition-colors"
              >
                How It Works
              </a>
            </div>
          </div>
          <div className="flex items-start sm:justify-end">
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="w-2 h-2 rounded-full bg-[#2DD4A0] animate-pulse" />
              System Operational
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="w-full border-t"
      style={{
        backgroundColor: 'var(--bg-deep)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-[#2DD4A0]" size={20} />
              <span
                className="font-bold text-lg"
                style={{ color: 'var(--text-primary)' }}
              >
                PneumoScan AI
              </span>
            </div>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: 'var(--text-muted)' }}
            >
              Advancing pulmonary medicine through accessible, AI-powered
              diagnostic intelligence for clinicians worldwide.
            </p>
            <div className="flex gap-3">
              {['in', 'tw', 'gh'].map((s) => (
                <div
                  key={s}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-xs uppercase"
                  style={{
                    backgroundColor: 'var(--bg-overlay)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p
              className="text-sm font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Platform
            </p>
            <div
              className="flex flex-col gap-2.5 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <Link
                href="/analyze"
                className="hover:text-[#2DD4A0] transition-colors"
              >
                Chest X-Ray Analysis
              </Link>
              <Link
                href="/analyze"
                className="hover:text-[#2DD4A0] transition-colors"
              >
                Model Selection
              </Link>
              <a
                href="/#how-it-works"
                className="hover:text-[#2DD4A0] transition-colors"
              >
                Grad-CAM Explainability
              </a>
            </div>
          </div>

          <div>
            <p
              className="text-sm font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Resources
            </p>
            <div
              className="flex flex-col gap-2.5 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <a
                href="/#how-it-works"
                className="hover:text-[#2DD4A0] transition-colors"
              >
                How It Works
              </a>
              <a
                href="/#about"
                className="hover:text-[#2DD4A0] transition-colors"
              >
                About
              </a>
              <Link
                href="/analyze"
                className="hover:text-[#2DD4A0] transition-colors"
              >
                Start Analysis
              </Link>
            </div>
          </div>

          <div>
            <p
              className="text-sm font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Legal
            </p>
            <div
              className="flex flex-col gap-2.5 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <a href="#" className="hover:text-[#2DD4A0] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#2DD4A0] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            © 2026 PneumoScan AI. Medical Diagnostic Intelligence.
          </p>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#2DD4A0]" />
            System Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
