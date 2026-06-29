import { useState } from 'react';
import { Section, SectionHeader, BrandButton } from '../components/ui';
import publicApi from '../api/publicApi';

const contactInfo = [
  { icon: '📍', label: 'Address',  value: 'Ethiopia, Jimma, kochi, kebel 5' },
  { icon: '📧', label: 'Email',    value: 'hello@skilvatech.com' },
  { icon: '📞', label: 'Phone',    value: '+251 911 123 456' },
  { icon: '🕐', label: 'Hours',    value: 'Monday – Friday, 9am – 6pm PST' },
];

const ContactPage = () => {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '', type: 'general' });
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error
  const [error, setError]     = useState('');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    setStatus('sending'); setError('');
    try {
      // In production this would hit a contact form endpoint
      await new Promise((r) => setTimeout(r, 1200)); // simulate API call
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '', type: 'general' });
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again or email us directly.');
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d1117] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#00d4d4]/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-[#00d4d4] uppercase tracking-widest mb-4">
            Contact Us
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Let's <span className="text-[#00d4d4]">Talk</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-xl mx-auto">
            Have a question or ready to start a project? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact section */}
      <Section>
        <div className="grid lg:grid-cols-5 gap-12">

          {/* Left — contact info */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in touch</h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Whether you're looking for a technology partner, want to enroll in a course, or just have a question — our team is ready to help.
            </p>

            <div className="space-y-5 mb-8">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-base">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-gray-700 text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <p className="font-semibold text-gray-900 mb-3 text-sm">Quick options</p>
              <div className="space-y-2">
                {[
                  { label: 'Book a free consultation', href: '#form' },
                  { label: 'View pricing plans',       href: '/pricing' },
                  { label: 'Browse courses',           href: '/courses' },
                ].map((link) => (
                  <a key={link.label} href={link.href}
                    className="flex items-center gap-2 text-sm text-[#00b3b3] hover:text-[#008080] transition-colors">
                    <span>→</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3" id="form">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h3>

              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-3xl mx-auto mb-4">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
                  <p className="text-gray-500 mb-6">We'll get back to you within 24 hours.</p>
                  <BrandButton onClick={() => setStatus('idle')}>Send Another</BrandButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input value={form.name} onChange={set('name')} placeholder="Rihad Gali" required
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30
                                   focus:border-[#00d4d4] text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input type="email" value={form.email} onChange={set('email')} placeholder="you@gmail.com" required
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30
                                   focus:border-[#00d4d4] text-sm transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">I'm interested in</label>
                    <div className="relative">
                      <select value={form.type} onChange={set('type')}
                        className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white border border-gray-300 text-gray-900
                                   focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4]
                                   text-sm appearance-none transition-all">
                        <option value="general">General Inquiry</option>
                        <option value="services">Technology Services</option>
                        <option value="courses">Course Enrollment</option>
                        <option value="enterprise">Enterprise Solutions</option>
                        <option value="partnership">Partnership</option>
                        <option value="support">Technical Support</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <input value={form.subject} onChange={set('subject')} placeholder="How can we help?"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900
                                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30
                                 focus:border-[#00d4d4] text-sm transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea value={form.message} onChange={set('message')} rows={5} required
                      placeholder="Tell us about your project or question..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900
                                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30
                                 focus:border-[#00d4d4] text-sm resize-none transition-all" />
                  </div>

                  <BrandButton type="submit" size="lg" className="w-full">
                    {status === 'sending' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </BrandButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Map placeholder */}
      <div className="h-64 bg-[#0d1f2d] border-t border-white/10 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <p className="text-4xl mb-2">📍</p>
          <p className="text-sm">Ethiopia, Jimma</p>
        </div>
      </div>
    </>
  );
};

export default ContactPage;