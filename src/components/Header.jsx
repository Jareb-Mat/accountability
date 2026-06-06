import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const CLASSIC_LINKS = [
  { path: '/',         label: 'today' },
  { path: '/settings', label: 'schedule' },
  { path: '/review',   label: 'review' },
];

const V2_LINKS = [
  { path: '/v2',          label: 'today' },
  { path: '/v2/tomorrow', label: 'tomorrow' },
  { path: '/v2/classes',  label: 'classes' },
  { path: '/v2/settings', label: 'settings' },
];

export default function Header() {
  const location = useLocation();
  const navigate  = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isV2Route = location.pathname.startsWith('/v2');
  const [v2Mode, setV2Mode] = useState(() => {
    if (isV2Route) return true;
    return localStorage.getItem('v2_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('v2_mode', String(v2Mode));
  }, [v2Mode]);

  const showV2Nav = isV2Route || v2Mode;
  const links = showV2Nav ? V2_LINKS : CLASSIC_LINKS;
  const isActive = (path) => location.pathname === path;

  const toggleMode = () => {
    const next = !v2Mode;
    setV2Mode(next);
    setMobileOpen(false);
    navigate(next ? '/v2' : '/');
  };

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-[880px] mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to={showV2Nav ? '/v2' : '/'} className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Accountability
          </span>
          {showV2Nav && (
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>v2</span>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-1.5 text-xs transition-colors"
                style={{ color: isActive(link.path) ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={toggleMode}
            className="ml-3 px-3 py-1.5 text-xs transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            {showV2Nav ? 'classic' : 'v2'}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t animate-fadeIn" style={{ borderColor: 'var(--border-subtle)' }}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-3 text-sm border-b"
              style={{
                color: isActive(link.path) ? 'var(--text-primary)' : 'var(--text-muted)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={toggleMode}
            className="block w-full text-left px-6 py-3 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {showV2Nav ? 'switch to classic' : 'switch to v2'}
          </button>
        </div>
      )}
    </header>
  );
}
