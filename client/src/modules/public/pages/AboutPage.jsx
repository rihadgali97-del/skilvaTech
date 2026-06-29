import CtaSection from '../components/CtaSection';
import SectionHeader from '../components/SectionHeader';
import { processSteps, values } from '../data/publicContent';

const AboutPage = () => (
  <>
    <section className="bg-[#0d1f2d] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-300">About SkilvaTech</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            We build technology with business clarity and engineering discipline.
          </h1>
        </div>
        <div className="space-y-5 text-lg leading-8 text-white/72">
          <p>
            SkilvaTech helps organizations turn scattered operations into reliable digital systems. We work across software development, training, CRM, cloud workflows, and product delivery.
          </p>
          <p>
            Our style is professional, direct, and maintainable: clear scope, reusable code, thoughtful interfaces, and delivery habits that keep teams confident after launch.
          </p>
        </div>
      </div>
    </section>

    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Our principles"
          title="Built for teams that care about quality after launch."
          body="Good systems are not only attractive. They are understandable, adaptable, secure, and easy for real teams to operate."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="rounded-lg border border-gray-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-black text-[#0d1f2d]">{value.title}</h2>
              <p className="mt-4 text-sm leading-6 text-gray-600">{value.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeader
          eyebrow="How we work"
          title="Focused collaboration, from discovery to scale."
          body="Every project gets a clear path, practical milestones, and a codebase designed for the next team member who touches it."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {processSteps.map((step) => (
            <div key={step.step} className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-sm font-black text-brand-700">{step.step}</p>
              <h3 className="mt-3 text-lg font-black text-[#0d1f2d]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <CtaSection
      title="Bring us your messy workflow, ambitious product idea, or training goal."
      body="We will help turn it into a clear delivery plan and a system people enjoy using."
    />
  </>
);

export default AboutPage;
