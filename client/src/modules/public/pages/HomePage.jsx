import { Link } from 'react-router-dom';
import CtaSection from '../components/CtaSection';
import HeroVisual from '../components/HeroVisual';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import { processSteps, services, stats, testimonials } from '../data/publicContent';

const HomePage = () => (
  <>
    <section className="overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-700">
            Software, training, and business systems
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-[#0d1f2d] sm:text-6xl">
            SkilvaTech builds digital platforms that make teams faster.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            We design and deliver reliable web applications, CRM workflows, cloud-ready systems, and practical training programs for teams that want cleaner operations.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-lg bg-[#0d1f2d] px-6 py-3 text-center text-sm font-black text-white shadow-sm transition-colors hover:bg-[#153247]"
            >
              Start a Project
            </Link>
            <Link
              to="/services"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-black text-gray-800 transition-colors hover:bg-gray-50"
            >
              Explore Services
            </Link>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>

    <section className="border-y border-gray-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <p className="text-3xl font-black text-[#0d1f2d]">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="What we do"
            title="Practical technology services for growing organizations."
            body="Each engagement is shaped around reusable delivery patterns, clear ownership, and systems your team can maintain."
          />
          <Link to="/services" className="text-sm font-black text-brand-700 hover:text-brand-800">
            View all services
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>

    <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Delivery method"
          title="A calm, transparent path from idea to launch."
          body="We keep decisions visible, releases focused, and quality measurable from the first workshop through production."
          align="center"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {processSteps.map((item) => (
            <div key={item.step} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-black text-brand-700">{item.step}</p>
              <h3 className="mt-4 text-lg font-black text-[#0d1f2d]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        {testimonials.map((item) => (
          <figure key={item.name} className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <blockquote className="text-xl font-bold leading-8 text-[#0d1f2d]">"{item.quote}"</blockquote>
            <figcaption className="mt-6 text-sm font-semibold text-gray-600">
              {item.name} · {item.company}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>

    <CtaSection />
  </>
);

export default HomePage;
