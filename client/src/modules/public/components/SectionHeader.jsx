const SectionHeader = ({ eyebrow, title, body, align = 'left' }) => {
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-brand-700">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-black tracking-tight text-[#0d1f2d] sm:text-4xl">
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
          {body}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
