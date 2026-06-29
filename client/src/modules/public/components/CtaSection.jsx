import { Link } from 'react-router-dom';

const CtaSection = ({
  title = 'Ready to build something your team can grow with?',
  body = 'Tell us what you are trying to improve. We will help shape the right platform, training path, or delivery plan.',
}) => (
  <section className="bg-[#0d1f2d] px-4 py-16 sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 text-base leading-7 text-white/70">{body}</p>
      </div>
      <Link
        to="/contact"
        className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-black text-white shadow-brand transition-colors hover:bg-brand-600"
      >
        Book a Consultation
      </Link>
    </div>
  </section>
);

export default CtaSection;
