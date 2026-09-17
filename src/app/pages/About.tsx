import { Heart, Eye, Clock } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useSiteSettings } from '../lib/useSiteSettings';

export function About() {
  const settings = useSiteSettings();

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-6 py-8 md:py-10">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-white mb-1 text-2xl md:text-3xl font-bold">Nuestra Historia</h1>
            <p className="text-white/70 text-sm md:text-base">Rescatando vidas, creando familias</p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 pb-10">
          <div className="bg-white rounded-[16px] p-6 mb-4 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-start gap-4 mb-3">
              <div className="bg-[#20A83E]/10 p-2.5 rounded-xl shrink-0">
                <Heart className="text-[#20A83E]" size={20} />
              </div>
              <div>
                <h2 className="text-[#222222] mb-1.5 text-lg font-semibold">Nuestra Misión</h2>
                <p className="text-[#222222]/70 text-sm leading-relaxed">
                  {settings?.mission}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-6 mb-4 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-start gap-4 mb-3">
              <div className="bg-[#20A83E]/10 p-2.5 rounded-xl shrink-0">
                <Eye className="text-[#20A83E]" size={20} />
              </div>
              <div>
                <h2 className="text-[#222222] mb-1.5 text-lg font-semibold">Nuestra Visión</h2>
                <p className="text-[#222222]/70 text-sm leading-relaxed">
                  {settings?.vision}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-[#20A83E]/10 p-2.5 rounded-xl shrink-0">
                <Clock className="text-[#20A83E]" size={20} />
              </div>
              <h2 className="text-[#222222] text-lg font-semibold">Cómo Empezamos</h2>
            </div>
            <div className="space-y-4 text-[#222222]/70">
              {(settings?.timeline ?? []).map((item, i) => (
                <div key={`${item.year}-${i}`} className="flex gap-4 border-l-2 border-[#D9D9D9] pl-4">
                  <div className="w-14 shrink-0 font-semibold text-[#20A83E] text-sm">{item.year}</div>
                  <p className="leading-relaxed text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
