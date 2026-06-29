import { useState } from 'react';
import { Section, SectionHeader, BrandButton, PublicBadge } from '../components/ui';

const faqCategories = [
  {
    category: 'Getting Started',
    icon: '🚀',
    items: [
      { q: 'How do I get started with SkilVaTech?', a: 'Simply create a free account, browse our courses or services, and choose what fits your needs. You can start learning or request a service consultation immediately.' },
      { q: 'Do I need any prior experience?',        a: 'Not at all. We offer courses for all skill levels — from complete beginners to advanced professionals looking to specialize.' },
      { q: 'Is there a free trial?',                  a: 'Yes, all paid plans include a 14-day free trial with full access to features. No credit card required to start.' },
    ],
  },
  {
    category: 'Courses & Learning',
    icon: '📚',
    items: [
      { q: 'How long do courses take to complete?',  a: 'Course duration varies from a few hours to several weeks depending on complexity. Each course page shows estimated completion time.' },
      { q: 'Do I get a certificate?',                 a: 'Yes, you receive a verified certificate of completion for every course you finish, which you can share on LinkedIn or with employers.' },
      { q: 'Can I access courses offline?',           a: 'Professional and Enterprise plan members can download course content for offline viewing through our mobile app.' },
      { q: 'What if I get stuck on a lesson?',        a: 'Every course includes a discussion forum where you can ask questions, plus access to instructor support during business hours.' },
    ],
  },
  {
    category: 'Services',
    icon: '⚙️',
    items: [
      { q: 'What types of services do you offer?',   a: 'We offer web and mobile development, cloud solutions, cybersecurity consulting, custom software development, and ongoing technical support.' },
      { q: 'How is service pricing determined?',      a: 'Pricing depends on project scope, complexity, and timeline. We provide a detailed quote after an initial consultation call.' },
      { q: 'Do you offer ongoing support after project completion?', a: 'Yes, we offer flexible maintenance and support packages to keep your systems running smoothly after launch.' },
    ],
  },
  {
    category: 'Billing & Plans',
    icon: '💳',
    items: [
      { q: 'Can I switch plans anytime?',             a: 'Yes, you can upgrade, downgrade, or cancel your plan at any time from your account settings. Changes apply at the next billing cycle.' },
      { q: 'What payment methods are accepted?',      a: 'We accept all major credit cards, PayPal, and bank transfers for annual enterprise plans.' },
      { q: 'Is there a refund policy?',                a: 'We offer a 30-day money-back guarantee on all course purchases if you\'re not satisfied with the content.' },
    ],
  },
  {
    category: 'Account & Security',
    icon: '🔒',
    items: [
      { q: 'How is my data protected?',                a: 'We use bank-grade encryption and follow strict data protection standards including GDPR compliance to keep your information secure.' },
      { q: 'Can I have multiple users on one account?', a: 'Professional and Enterprise plans support team accounts with multiple users and centralized billing.' },
    ],
  },
];

const FAQItem = ({ item, isOpen, onClick }) => (
  <div className="border border-gray-200 rounded-2xl overflow-hidden">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
    >
      <span className="font-medium text-gray-900 pr-4">{item.q}</span>
      <span className={`text-[#00d4d4] text-xl flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
        +
      </span>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
      <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{item.a}</p>
    </div>
  </div>
);

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].category);
  const [openIndex, setOpenIndex]           = useState(0);

  const currentCategory = faqCategories.find((c) => c.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d1117] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-[#00d4d4]/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-[#00d4d4] uppercase tracking-widest mb-4">
            Help Center
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Frequently Asked <span className="text-[#00d4d4]">Questions</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-xl mx-auto">
            Everything you need to know about SkilVaTech. Can't find an answer? Reach out to our team.
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <Section>
        <div className="grid lg:grid-cols-4 gap-10">

          {/* Category sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-2">
              {faqCategories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => { setActiveCategory(cat.category); setOpenIndex(0); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all
                    ${activeCategory === cat.category
                      ? 'bg-[#00d4d4]/10 text-[#008080] border border-[#00d4d4]/20'
                      : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                    }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <PublicBadge color="teal">{currentCategory.items.length} questions</PublicBadge>
              <h2 className="text-2xl font-bold text-gray-900">{currentCategory.category}</h2>
            </div>
            <div className="space-y-3">
              {currentCategory.items.map((item, i) => (
                <FAQItem
                  key={item.q}
                  item={item}
                  isOpen={openIndex === i}
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-[#0d1f2d] py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Our support team is here to help. Reach out and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <BrandButton href="/contact" size="lg">Contact Support</BrandButton>
            <BrandButton href="/pricing" variant="dark" size="lg">View Pricing</BrandButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;