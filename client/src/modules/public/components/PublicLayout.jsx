import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import BrandMark from './BrandMark';
import { navLinks } from '../data/publicContent';

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'bg-brand-50 text-brand-800' : 'text-gray-600 hover:bg-gray-100 hover:text-[#0d1f2d]'
    }`;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandMark />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Client Login
            </Link>
            <Link
              to="/contact"
              className="rounded-lg bg-[#0d1f2d] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#153247]"
            >
              Start a Project
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 md:hidden"
            aria-expanded={menuOpen}
          >
            Menu
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={navClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-lg bg-[#0d1f2d] px-4 py-3 text-center text-sm font-bold text-white"
              >
                Start a Project
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-[#0d1f2d] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <BrandMark inverse />
            <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
              SkilvaTech builds reliable digital platforms, training programs, and operational tools for ambitious teams.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-300">Pages</h3>
            <div className="mt-4 grid gap-3">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-white/70 hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-300">Contact</h3>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <p>hello@skilvatech.com</p>
              <p>Ethiopia, Jimma</p>
              <p>Mon - Fri, 9:00 - 18:00</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/45">
          © {new Date().getFullYear()} SkilvaTech. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
