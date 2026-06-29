import { Link } from 'react-router-dom';

const footerLinks = {
  Company: [
    { label: 'About Us',  href: '/about' },
    { label: 'Careers',   href: '/careers' },
    { label: 'Blog',      href: '/blog' },
    { label: 'Contact',   href: '/contact' },
  ],
  Services: [
    { label: 'Web Development',   href: '/services' },
    { label: 'Mobile Apps',       href: '/services' },
    { label: 'Cloud Solutions',   href: '/services' },
    { label: 'Cybersecurity',     href: '/services' },
  ],
  Learning: [
    { label: 'All Courses', href: '/courses' },
    { label: 'Pricing',     href: '/pricing' },
    { label: 'FAQ',         href: '/faq' },
    { label: 'Dashboard',   href: '/dashboard' },
  ],
  Legal: [
    { label: 'Privacy Policy',  href: '/privacy' },
    { label: 'Terms of Service',href: '/terms' },
    { label: 'Cookie Policy',   href: '/cookies' },
  ],
};

const socialLinks = [
  { label: 'Twitter',  href: '#', icon: '𝕏' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rihad-gali-06b973376/', icon: 'in' },
  { label: 'GitHub',   href: 'https://github.com/rihadgali97-del', icon: '⌥' },
  { label: 'YouTube',  href: '#', icon: '▶' },
];

const Footer = () => (
  <footer className="bg-[#0d1117] border-t border-white/10">

    {/* Main footer */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[#00d4d4]/20 border border-[#00d4d4]/40 flex items-center justify-center text-[#00d4d4] font-bold">
              S
            </div>
            <span className="text-lg font-bold text-white">
              Skilva<span className="text-[#00d4d4]">Tech</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
            Empowering businesses and individuals with cutting-edge technology solutions, professional training, and expert consulting.
          </p>
          {/* Social links */}
          <div className="flex gap-3">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center
                           text-slate-400 hover:text-[#00d4d4] hover:border-[#00d4d4]/30 hover:bg-[#00d4d4]/5
                           transition-all duration-200 text-xs font-bold">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {category}
            </h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.href}
                    className="text-sm text-slate-400 hover:text-[#00d4d4] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Newsletter */}
    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold">Stay in the loop</p>
            <p className="text-slate-400 text-sm">Get updates on new courses and services.</p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white
                         placeholder-slate-500 focus:outline-none focus:border-[#00d4d4]/50 text-sm"
            />
            <button type="submit"
              className="px-5 py-2.5 bg-[#00d4d4] hover:bg-[#00b3b3] text-white font-semibold rounded-xl text-sm transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} SkilVaTech. All rights reserved.
        </p>
        <p className="text-slate-600 text-xs">
          Built with ❤️ for the future of tech
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;