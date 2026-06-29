import { Link } from 'react-router-dom';
import { usePublicServices, usePublicCourses } from '../hooks/usePublicData';
import {
  Section, SectionHeader, BrandButton,
  FeatureCard, StatItem, Card, CardSkeleton, PublicBadge,
} from '../components/ui';

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative min-h-screen flex items-center bg-[#0d1117] overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4d4]/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(0,212,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,212,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00d4d4]/10 border border-[#00d4d4]/20 text-[#00d4d4] text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00d4d4] animate-pulse" />
            Trusted by 500+ businesses worldwide
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Build the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00d4d4] to-blue-400">
              Future of Tech
            </span>
            with SkilVaTech
          </h1>

          <p className="text-xl text-slate-400 leading-relaxed mb-8 max-w-lg">
            Professional technology solutions, world-class training programs, and expert consulting — all in one powerful platform.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <BrandButton href="/courses" size="lg">
              Explore Courses →
            </BrandButton>
            <BrandButton href="/services" variant="dark" size="lg">
              Our Services
            </BrandButton>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 flex-wrap">
            {['ISO Certified', '24/7 Support', '100% Satisfaction'].map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="text-[#00d4d4]">✓</span>
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Right — floating cards */}
        <div className="relative hidden lg:block">
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            {/* Center circle */}
            <div className="absolute inset-1/4 rounded-full bg-gradient-to-br from-[#00d4d4]/20 to-blue-500/10 border border-[#00d4d4]/20 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-[#00d4d4]/20 border border-[#00d4d4]/40 flex items-center justify-center text-4xl font-bold text-[#00d4d4]">S</div>
            </div>

            {/* Orbiting cards */}
            {[
              { icon: '📚', label: 'Courses',    top: '5%',  left: '35%' },
              { icon: '⚙️', label: 'Services',   top: '35%', right: '0%' },
              { icon: '🎓', label: 'Certify',    bottom: '5%', left: '35%' },
              { icon: '🏢', label: 'Enterprise', top: '35%', left: '0%' },
            ].map((item) => (
              <div key={item.label}
                className="absolute bg-[#0d1f2d] border border-[#00d4d4]/20 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-lg"
                style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-white text-sm font-medium">{item.label}</span>
              </div>
            ))}

            {/* Rotating ring */}
            <div className="absolute inset-8 rounded-full border border-dashed border-[#00d4d4]/15 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
      <span className="text-xs uppercase tracking-widest">Scroll</span>
      <div className="w-0.5 h-8 bg-gradient-to-b from-[#00d4d4] to-transparent" />
    </div>
  </section>
);

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  { icon: '🚀', title: 'Expert-Led Training',    description: 'Learn from industry professionals with real-world experience in cutting-edge technologies.' },
  { icon: '🛡️', title: 'Enterprise Security',    description: 'Bank-grade security solutions protecting your business from modern cyber threats.' },
  { icon: '☁️', title: 'Cloud Solutions',        description: 'Scalable cloud infrastructure designed to grow with your business needs.' },
  { icon: '📊', title: 'Analytics & Insights',   description: 'Data-driven decisions powered by advanced analytics and real-time reporting.' },
  { icon: '🤝', title: 'Dedicated Support',      description: '24/7 expert support team available to resolve any issue within minutes.' },
  { icon: '🎯', title: 'Custom Development',     description: 'Tailored software solutions built specifically for your unique business requirements.' },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  { name: 'Sarah Johnson',  role: 'CTO, TechCorp',      avatar: 'SJ', text: 'SkilVaTech transformed our team\'s capabilities. The training programs are world-class and the support is unmatched.' },
  { name: 'Michael Chen',   role: 'Founder, StartupXYZ', avatar: 'MC', text: 'From web development to cloud migration, they handled everything perfectly. Our business grew 3x after partnering with them.' },
  { name: 'Aisha Mohammed', role: 'Lead Developer',      avatar: 'AM', text: 'The courses are incredibly detailed and practical. I landed my dream job within 3 months of completing the program.' },
];

// ─── Home Page ────────────────────────────────────────────────────────────────
const HomePage = () => {
  const { services, loading: servicesLoading } = usePublicServices({ limit: 6 });
  const { courses,  loading: coursesLoading  } = usePublicCourses({ limit: 3 });

  return (
    <>
      <Hero />

      {/* Stats */}
      <section className="bg-[#0d1f2d] border-y border-white/10 py-14">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem value="500+"  label="Happy Clients"    dark />
          <StatItem value="50+"   label="Expert Courses"   dark />
          <StatItem value="99%"   label="Satisfaction"     dark />
          <StatItem value="24/7"  label="Support"          dark />
        </div>
      </section>

      {/* Features */}
      <Section dark id="features">
        <SectionHeader
          eyebrow="Why SkilVaTech"
          title="Everything you need to succeed"
          subtitle="A complete ecosystem of technology services, training, and support — built for businesses and individuals who demand the best."
          dark
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => <FeatureCard key={f.title} {...f} dark />)}
        </div>
      </Section>

      {/* Services */}
      <Section id="services">
        <SectionHeader
          eyebrow="What We Offer"
          title="Professional Services"
          subtitle="From consulting to implementation, we provide end-to-end technology solutions for your business."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesLoading
            ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
            : services.length > 0
              ? services.map((service) => (
                  <Card key={service.id}>
                    <div className="w-12 h-12 rounded-xl bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center text-2xl mb-4">
                      {service.icon || '⚙️'}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description || 'Professional technology service tailored to your needs.'}</p>
                    {service.price && (
                      <p className="text-[#00b3b3] font-semibold text-sm mb-4">
                        From ${parseFloat(service.price).toLocaleString()}
                      </p>
                    )}
                    <Link to="/services" className="text-[#00b3b3] text-sm font-medium hover:text-[#008080] transition-colors">
                      Learn more →
                    </Link>
                  </Card>
                ))
              : features.slice(0, 6).map((f) => (
                  <Card key={f.title}>
                    <div className="w-12 h-12 rounded-xl bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center text-2xl mb-4">{f.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                  </Card>
                ))
          }
        </div>
        <div className="text-center mt-10">
          <BrandButton href="/services" variant="outline">View All Services</BrandButton>
        </div>
      </Section>

      {/* Courses */}
      <Section dark id="courses">
        <SectionHeader
          eyebrow="Learn & Grow"
          title="Featured Courses"
          subtitle="Hands-on, industry-relevant courses taught by experts. Advance your career with in-demand skills."
          dark
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesLoading
            ? Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="h-44 bg-white/10 rounded-xl animate-pulse" />
                  <div className="h-5 bg-white/10 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-white/10 rounded animate-pulse" />
                </div>
              ))
            : courses.length > 0
              ? courses.map((course) => (
                  <div key={course.id}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#00d4d4]/30 transition-all duration-300 group">
                    <div className="h-44 bg-gradient-to-br from-[#00d4d4]/20 to-blue-500/10 flex items-center justify-center text-5xl">
                      📚
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <PublicBadge color="teal">{course.level}</PublicBadge>
                        {course.price ? (
                          <span className="text-[#00d4d4] font-semibold text-sm">${parseFloat(course.price).toFixed(2)}</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold text-sm">Free</span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold mb-2 group-hover:text-[#00d4d4] transition-colors">{course.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{course.lessonCount || 0} lessons</span>
                        <span>{course.enrollmentCount || 0} enrolled</span>
                      </div>
                    </div>
                  </div>
                ))
              : (
                <div className="col-span-3 text-center py-12 text-slate-500">
                  <p className="text-5xl mb-4">📚</p>
                  <p>Courses coming soon. Check back later!</p>
                </div>
              )
          }
        </div>
        <div className="text-center mt-10">
          <BrandButton href="/courses" variant="outline">Browse All Courses</BrandButton>
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <SectionHeader
          eyebrow="What People Say"
          title="Trusted by professionals worldwide"
          subtitle="Don't just take our word for it — hear from the people who've transformed their careers and businesses with SkilVaTech."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="relative">
              <div className="text-5xl text-[#00d4d4]/20 font-serif leading-none mb-4">"</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00d4d4] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
              {/* Stars */}
              <div className="absolute top-6 right-6 text-amber-400 text-sm">★★★★★</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative bg-gradient-to-br from-[#0d1f2d] to-[#0d1117] py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#00d4d4]/50 to-transparent" />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(0,212,212,0.4) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Ready to transform your{' '}
            <span className="text-[#00d4d4]">future?</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals and businesses who trust SkilVaTech to power their growth.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <BrandButton href="/courses" size="lg">Start Learning Today</BrandButton>
            <BrandButton href="/contact" variant="dark" size="lg">Talk to an Expert</BrandButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;