const ServiceCard = ({ service }) => (
  <article className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
    <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${service.accent}`} />
    <h3 className="mt-6 text-xl font-black text-[#0d1f2d]">{service.title}</h3>
    <p className="mt-3 text-sm leading-6 text-gray-600">{service.summary}</p>
    <ul className="mt-6 space-y-3">
      {service.points.map((point) => (
        <li key={point} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          {point}
        </li>
      ))}
    </ul>
  </article>
);

export default ServiceCard;
