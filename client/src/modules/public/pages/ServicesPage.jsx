import CtaSection from '../components/CtaSection';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import { processSteps, services } from '../data/publicContent';

const ServicesPage = () => (
  <>
    <section className="bg-gradient-to-b from-brand-50 to-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Services"
          title="Digital services that connect strategy, software, and execution."
          body="Choose one focused service or combine them into a complete delivery program. The goal is the same: useful systems, clean operations, and maintainable growth."
        />
      </div>
    </section>

    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>
    </section>

    <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Engagement model"
          title="A reusable delivery system behind every service."
          body="Our work is designed to keep stakeholders aligned and make handover easier when your internal team grows."
          align="center"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {processSteps.map((step) => (
            <article key={step.step} className="rounded-lg border border-gray-200 bg-white p-6">
              <span className="text-sm font-black text-brand-700">{step.step}</span>
              <h3 className="mt-4 text-lg font-black text-[#0d1f2d]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <CtaSection
      title="Need a service package shaped around your company?"
      body="We can combine software delivery, workflow design, cloud setup, and team training into one practical roadmap."
    />
  </>
);

export default ServicesPage;
