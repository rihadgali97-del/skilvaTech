import { Link } from 'react-router-dom';

const BrandMark = ({ inverse = false }) => (
  <Link to="/" className="flex items-center gap-3" aria-label="SkilvaTech home">
    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-sm font-black text-white shadow-brand">
      S
    </span>
    <span className={`text-xl font-black tracking-tight ${inverse ? 'text-white' : 'text-[#0d1f2d]'}`}>
      Skilva<span className="text-brand-500">Tech</span>
    </span>
  </Link>
);

export default BrandMark;
