import { useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  title: string;
  subtitle: string;
  content: ReactNode;
}

export function ChartCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % slides.length);
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);

  const slide = slides[current];

  return (
    <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-[#222222] text-xl">{slide.title}</h2>
          <p className="text-[#222222]/50 text-sm">{slide.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="p-2 rounded-full text-[#222222]/50 hover:text-[#222222] hover:bg-[#F8F8F8] transition-all duration-250 cursor-pointer"
            aria-label="Gráfica anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="p-2 rounded-full text-[#222222]/50 hover:text-[#222222] hover:bg-[#F8F8F8] transition-all duration-250 cursor-pointer"
            aria-label="Siguiente gráfica"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4">{slide.content}</div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current ? 'bg-[#20A83E] w-6 h-2' : 'bg-[#D9D9D9] hover:bg-[#20A83E]/40 w-2 h-2'
            }`}
            aria-label={`Ir a la gráfica ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
