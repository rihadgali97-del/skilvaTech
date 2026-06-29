import { contactCards } from '../data/publicContent';

const ContactPage = () => (
  <section className="bg-gradient-to-b from-brand-50 via-white to-gray-50 px-4 py-20 sm:px-6 lg:px-8">
    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-700">Contact</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-[#0d1f2d] sm:text-6xl">
          Let us shape the next useful thing together.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Share what you want to build, modernize, or teach. We will respond with a clear next step for discovery, scope, and delivery.
        </p>
        <div className="mt-10 grid gap-4">
          {contactCards.map((card) => (
            <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{card.label}</p>
              <p className="mt-2 text-lg font-black text-[#0d1f2d]">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      <form className="rounded-lg border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-gray-700">First name</span>
            <input className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-gray-700">Last name</span>
            <input className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
          </label>
        </div>
        <label className="mt-5 block">
          <span className="text-sm font-bold text-gray-700">Email</span>
          <input type="email" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
        </label>
        <label className="mt-5 block">
          <span className="text-sm font-bold text-gray-700">What do you need?</span>
          <select className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
            <option>Custom software development</option>
            <option>Digital transformation</option>
            <option>Training program</option>
            <option>CRM or business platform</option>
          </select>
        </label>
        <label className="mt-5 block">
          <span className="text-sm font-bold text-gray-700">Project details</span>
          <textarea rows="6" className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
        </label>
        <button
          type="button"
          className="mt-6 w-full rounded-lg bg-[#0d1f2d] px-6 py-3 text-sm font-black text-white transition-colors hover:bg-[#153247]"
        >
          Send Message
        </button>
        <p className="mt-4 text-center text-xs leading-5 text-gray-500">
          This public form is ready for backend wiring when the contact endpoint is available.
        </p>
      </form>
    </div>
  </section>
);

export default ContactPage;
