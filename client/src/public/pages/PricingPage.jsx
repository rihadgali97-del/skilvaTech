import { useState } from 'react';
import { Section, SectionHeader, BrandButton, Card } from '../components/ui';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 49, yearly: 39 },
    description: 'Perfect for individuals getting started.',
    color: 'gray',
    features: [
      '5 courses per month',
      'HD video quality',
      'Certificate of completion',
      'Email support',
      'Mobile access',
      'Basic analytics',
    ],
    notIncluded: ['Team management', 'Custom training', 'Priority support', 'API access'],
  },
  {
    name: 'Professional',
    price: { monthly: 99, yearly: 79 },
    description: 'For professionals serious about growth.',
    color: 'teal',
    featured: true,
    features: [
      'Unlimited courses',
      '4K video quality',
      'Certificate of completion',
      'Priority email & chat support',
      'Mobile & offline access',
      'Advanced analytics',
      'Team management (up to 5)',
      'Downloadable resources',
    ],
    notIncluded: ['Custom training', 'API access'],
  },
  {
    name: 'Enterprise',
    price: { monthly: null, yearly: null },
    description: 'For organizations scaling their teams.',
    color: 'dark',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Custom training programs',
      'Dedicated account manager',
      '24/7 phone support',
      'White-label options',
      'API access',
      'SSO & advanced security',
    ],
    notIncluded: [],
  },
];

const faqs = [
  { q: 'Can I switch plans anytime?',      a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.' },
  { q: 'Is there a free trial?',           a: 'Yes! All paid plans come with a 14-day free trial. No credit card required.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
  { q: 'Can I cancel anytime?',            a: 'Absolutely. Cancel anytime with no cancellation fees. Your access continues until the end of the billing period.' },
];

const PricingPage = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d1117] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#00d4d4]/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-[#00d4d4] uppercase tracking-widest mb-4">Pricing</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Simple, <span className="text-[#00d4d4]">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/10 rounded-2xl p-1.5">
            <button onClick={() => setYearly(false)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all
                ${!yearly ? 'bg-white text-gray-900 shadow-sm' : 'text-white/70 hover:text-white'}`}>
              Monthly
            </button>
            <button onClick={() => setYearly(true)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
                ${yearly ? 'bg-white text-gray-900 shadow-sm' : 'text-white/70 hover:text-white'}`}>
              Yearly
              <span className="bg-[#00d4d4] text-white text-xs px-2 py-0.5 rounded-full font-semibold">-20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <Section>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col relative transition-all duration-300
                ${plan.featured
                  ? 'bg-[#0d1f2d] border-[#00d4d4]/40 shadow-xl shadow-[#00d4d4]/10 scale-105'
                  : 'bg-white border-gray-200 hover:border-[#00d4d4]/30 hover:shadow-md'
                }`}>

              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#00d4d4] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.featured ? 'text-slate-400' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                {plan.price.monthly ? (
                  <div className="flex items-end gap-1">
                    <span className={`text-5xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                      ${yearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className={`text-sm mb-2 ${plan.featured ? 'text-slate-400' : 'text-gray-500'}`}>/month</span>
                  </div>
                ) : (
                  <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                    Custom
                  </span>
                )}
                {yearly && plan.price.monthly && (
                  <p className="text-[#00d4d4] text-sm mt-1 font-medium">
                    Save ${(plan.price.monthly - plan.price.yearly) * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="text-[#00d4d4] mt-0.5 flex-shrink-0">✓</span>
                    <span className={`text-sm ${plan.featured ? 'text-slate-300' : 'text-gray-600'}`}>{f}</span>
                  </li>
                ))}
                {plan.notIncluded?.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 opacity-40">
                    <span className={`mt-0.5 flex-shrink-0 ${plan.featured ? 'text-slate-500' : 'text-gray-400'}`}>✕</span>
                    <span className={`text-sm line-through ${plan.featured ? 'text-slate-500' : 'text-gray-400'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <BrandButton
                href={plan.price.monthly ? '/contact' : '/contact'}
                variant={plan.featured ? 'primary' : 'outline'}
                className="w-full justify-center"
              >
                {plan.price.monthly ? 'Start Free Trial' : 'Contact Sales'}
              </BrandButton>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </Section>

      {/* Feature comparison */}
      <Section dark>
        <SectionHeader eyebrow="Compare Plans" title="Everything you need in one platform" dark />
        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm w-1/2">Feature</th>
                {plans.map((p) => (
                  <th key={p.name} className={`py-4 px-4 text-sm font-semibold text-center ${p.featured ? 'text-[#00d4d4]' : 'text-white'}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Course Access',       values: ['5/month', 'Unlimited', 'Unlimited'] },
                { feature: 'Certificate',         values: [true, true, true] },
                { feature: 'Offline Access',      values: [false, true, true] },
                { feature: 'Team Members',        values: ['1', 'Up to 5', 'Unlimited'] },
                { feature: 'Custom Training',     values: [false, false, true] },
                { feature: 'Priority Support',    values: [false, true, true] },
                { feature: 'API Access',          values: [false, false, true] },
                { feature: 'Analytics',           values: ['Basic', 'Advanced', 'Advanced'] },
              ].map((row) => (
                <tr key={row.feature} className="border-b border-white/5 hover:bg-white/3">
                  <td className="py-4 px-4 text-slate-300 text-sm">{row.feature}</td>
                  {row.values.map((val, i) => (
                    <td key={i} className="py-4 px-4 text-center text-sm">
                      {typeof val === 'boolean'
                        ? val
                          ? <span className="text-[#00d4d4]">✓</span>
                          : <span className="text-slate-600">—</span>
                        : <span className="text-slate-300">{val}</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader eyebrow="FAQ" title="Pricing questions answered" />
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <BrandButton href="/contact">Talk to Sales</BrandButton>
        </div>
      </Section>
    </>
  );
};

export default PricingPage;