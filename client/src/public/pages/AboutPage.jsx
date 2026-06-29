import { Section, SectionHeader, BrandButton, StatItem, Card, FeatureCard } from '../components/ui';

const team = [
  { name: 'Alex Rivera',    role: 'CEO & Founder',       avatar: 'AR', bio: '15+ years in enterprise software development and technology consulting.' },
  { name: 'Priya Sharma',   role: 'CTO',                 avatar: 'PS', bio: 'Former Google engineer specializing in cloud architecture and AI systems.' },
  { name: 'James Okafor',   role: 'Head of Training',    avatar: 'JO', bio: 'Certified instructor with 10+ years teaching professionals worldwide.' },
  { name: 'Lena Mueller',   role: 'Lead Designer',       avatar: 'LM', bio: 'Award-winning UX/UI designer focused on creating exceptional digital experiences.' },
  { name: 'Carlos Mendez',  role: 'Security Lead',       avatar: 'CM', bio: 'Cybersecurity expert with certifications in CISSP, CEH, and OSCP.' },
  { name: 'Nina Patel',     role: 'Client Success',      avatar: 'NP', bio: 'Dedicated to ensuring every client achieves their technology transformation goals.' },
];

const values = [
  { icon: '🎯', title: 'Excellence',    description: 'We hold ourselves to the highest standards in everything we deliver.' },
  { icon: '🤝', title: 'Partnership',   description: 'Your success is our success. We grow together with every client.' },
  { icon: '💡', title: 'Innovation',    description: 'Constantly pushing boundaries to bring you tomorrow\'s solutions today.' },
  { icon: '🔒', title: 'Integrity',     description: 'Transparent, honest, and ethical in every interaction and decision.' },
];

const milestones = [
  { year: '2018', event: 'SkilVaTech founded with a vision to democratize technology education.' },
  { year: '2019', event: 'Launched first enterprise training programs, serving 50+ companies.' },
  { year: '2020', event: 'Expanded to cloud and cybersecurity services during the digital transformation wave.' },
  { year: '2021', event: 'Reached 1,000+ trained professionals across 20 countries.' },
  { year: '2022', event: 'Launched AI-powered learning platform and mobile development division.' },
  { year: '2023', event: '500+ active clients, ISO certified, and recognized as top tech educator.' },
];

const AboutPage = () => (
  <>
    {/* Hero */}
    <section className="relative bg-[#0d1117] pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#00d4d4]/6 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="inline-block text-sm font-semibold text-[#00d4d4] uppercase tracking-widest mb-4">
            About SkilVaTech
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            We Build the
            <span className="text-[#00d4d4]"> Tech Leaders</span>
            {' '}of Tomorrow
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-8">
            Founded in 2018, SkilVaTech is a technology company on a mission to empower businesses and individuals with cutting-edge solutions, world-class training, and expert consulting services.
          </p>
          <BrandButton href="/contact" size="lg">Work With Us</BrandButton>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-[#0d1f2d] border-y border-white/10 py-14">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatItem value="2018"  label="Founded"           dark />
        <StatItem value="500+"  label="Clients Served"    dark />
        <StatItem value="1000+" label="Professionals Trained" dark />
        <StatItem value="20+"   label="Countries Reached" dark />
      </div>
    </section>

    {/* Mission */}
    <Section>
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <SectionHeader eyebrow="Our Mission" title="Technology that empowers, not intimidates" center={false} />
          <p className="text-gray-500 leading-relaxed mb-6">
            We believe that every business deserves access to world-class technology solutions and education — regardless of size or budget. Our mission is to bridge the gap between complex technology and practical business needs.
          </p>
          <p className="text-gray-500 leading-relaxed mb-8">
            Through our integrated platform of services, training programs, and expert consulting, we help organizations navigate digital transformation with confidence and clarity.
          </p>
          <BrandButton href="/services">Explore Our Services</BrandButton>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {values.map((v) => (
            <div key={v.title} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <span className="text-2xl mb-3 block">{v.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-1">{v.title}</h3>
              <p className="text-gray-500 text-sm">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>

    {/* Timeline */}
    <Section dark>
      <SectionHeader eyebrow="Our Journey" title="From startup to industry leader" subtitle="Six years of growth, innovation, and impact." dark />
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00d4d4] via-[#00d4d4]/30 to-transparent" />
        <div className="space-y-8">
          {milestones.map((m, i) => (
            <div key={m.year} className="flex gap-6 items-start">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-[#00d4d4]/10 border border-[#00d4d4]/30 flex items-center justify-center z-10 relative">
                  <span className="text-[#00d4d4] font-bold text-sm">{m.year}</span>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-slate-300 leading-relaxed">{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>

    {/* Team */}
    <Section>
      <SectionHeader eyebrow="Meet The Team" title="The experts behind SkilVaTech" subtitle="A diverse team of technologists, educators, and innovators united by a passion for excellence." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.name} className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-md hover:border-[#00d4d4]/30 transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d4d4]/20 to-blue-500/10 border border-[#00d4d4]/20 flex items-center justify-center text-xl font-bold text-[#00b3b3] mx-auto mb-4">
              {member.avatar}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
            <p className="text-[#00b3b3] text-sm font-medium mb-3">{member.role}</p>
            <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* CTA */}
    <section className="bg-[#0d1f2d] py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to work with us?
        </h2>
        <p className="text-slate-400 text-lg mb-8">
          Let's discuss how SkilVaTech can transform your business or accelerate your career.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <BrandButton href="/contact" size="lg">Get in Touch</BrandButton>
          <BrandButton href="/courses" variant="dark" size="lg">Browse Courses</BrandButton>
        </div>
      </div>
    </section>
  </>
);

export default AboutPage;