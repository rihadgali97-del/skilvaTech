import { useState } from 'react';
import { usePublicServices, usePublicCategories } from '../hooks/usePublicData';
import { Section, SectionHeader, BrandButton, Card, CardSkeleton, PublicBadge } from '../components/ui';

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const { categories } = usePublicCategories();
  const { services, loading } = usePublicServices(
    activeCategory ? { categoryId: activeCategory } : {}
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d1117] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#00d4d4]/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-[#00d4d4] uppercase tracking-widest mb-4">
            What We Offer
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professional <span className="text-[#00d4d4]">Technology</span> Services
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            From strategy to implementation, we deliver end-to-end technology solutions that drive real business results.
          </p>
          <BrandButton href="/contact" size="lg">Request a Quote</BrandButton>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#0d1f2d] border-y border-white/10 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '01', label: 'Discovery',     desc: 'Understanding your needs' },
              { step: '02', label: 'Strategy',      desc: 'Crafting the right solution' },
              { step: '03', label: 'Execution',     desc: 'Delivering with excellence' },
              { step: '04', label: 'Support',       desc: 'Ongoing partnership' },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                <div className="w-12 h-12 rounded-2xl bg-[#00d4d4]/10 border border-[#00d4d4]/30 flex items-center justify-center text-[#00d4d4] font-bold text-sm mx-auto mb-3">
                  {item.step}
                </div>
                <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
                <p className="text-slate-500 text-xs">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-[#00d4d4]/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services list */}
      <Section>
        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            <button
              onClick={() => setActiveCategory('')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all
                ${!activeCategory ? 'bg-[#00d4d4] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all
                  ${activeCategory === cat.id ? 'bg-[#00d4d4] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <SectionHeader
          eyebrow={activeCategory ? categories.find(c => c.id === activeCategory)?.name : 'All Services'}
          title="Choose the right service for you"
          subtitle="Every service is delivered by certified experts with proven track records."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
            : services.length > 0
              ? services.map((service) => (
                  <Card key={service.id} className="flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center text-2xl">
                        {service.icon || '⚙️'}
                      </div>
                      {service.isFeatured && <PublicBadge color="teal">Featured</PublicBadge>}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                      {service.description || 'Professional service tailored to your business needs.'}
                    </p>
                    {service.category && (
                      <PublicBadge color="gray">{service.category.name}</PublicBadge>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      {service.price
                        ? <span className="text-[#00b3b3] font-semibold">From ${parseFloat(service.price).toLocaleString()}</span>
                        : <span className="text-gray-400 text-sm">Contact for pricing</span>
                      }
                      <BrandButton href="/contact" variant="outline" size="sm">Get Quote</BrandButton>
                    </div>
                  </Card>
                ))
              : (
                <div className="col-span-3 text-center py-16 text-gray-400">
                  <p className="text-5xl mb-4">⚙️</p>
                  <p className="text-lg font-medium text-gray-600 mb-2">Services coming soon</p>
                  <p className="text-sm">Check back shortly or contact us directly.</p>
                  <div className="mt-6"><BrandButton href="/contact">Contact Us</BrandButton></div>
                </div>
              )
          }
        </div>
      </Section>

      {/* Why choose us */}
      <Section dark>
        <SectionHeader eyebrow="Our Advantage" title="Why businesses choose SkilVaTech" dark />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🏆', title: 'Certified Experts',     desc: 'All our professionals hold industry-recognized certifications.' },
            { icon: '⚡', title: 'Fast Delivery',          desc: 'Agile methodology ensures rapid, high-quality delivery.' },
            { icon: '🔄', title: 'Ongoing Support',        desc: '24/7 support and maintenance for all our services.' },
            { icon: '💰', title: 'Transparent Pricing',    desc: 'No hidden fees. Clear, upfront pricing for all services.' },
          ].map((item) => (
            <div key={item.title} className="text-center p-6">
              <span className="text-4xl block mb-4">{item.icon}</span>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="bg-gradient-to-br from-[#0d1f2d] to-[#0d1117] rounded-3xl p-12 text-center border border-[#00d4d4]/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Not sure which service you need?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Our experts will help you find the perfect solution for your business. Book a free 30-minute consultation.
          </p>
          <BrandButton href="/contact" size="lg">Book Free Consultation</BrandButton>
        </div>
      </Section>
    </>
  );
};

export default ServicesPage;