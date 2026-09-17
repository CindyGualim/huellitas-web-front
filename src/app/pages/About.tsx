import { Heart, Eye, Clock } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useSiteSettings } from '../lib/useSiteSettings';

export function About() {
  const settings = useSiteSettings();

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-white mb-2 text-3xl md:text-4xl">Nuestra Historia</h1>
            <p className="text-white/70 text-lg">Rescatando vidas, creando familias</p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-12 pb-16">
          <div className="bg-white rounded-[20px] p-8 mb-5 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-[#20A83E]/10 p-3 rounded-xl shrink-0">
                <Heart className="text-[#20A83E]" size={24} />
              </div>
              <div>
                <h2 className="text-[#222222] mb-2 text-xl">Nuestra Misión</h2>
                <p className="text-[#222222]/70 leading-relaxed">
                  {settings?.mission}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-8 mb-5 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-[#20A83E]/10 p-3 rounded-xl shrink-0">
                <Eye className="text-[#20A83E]" size={24} />
              </div>
              <div>
                <h2 className="text-[#222222] mb-2 text-xl">Nuestra Visión</h2>
                <p className="text-[#222222]/70 leading-relaxed">
                  {settings?.vision}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-[#20A83E]/10 p-3 rounded-xl shrink-0">
                <Clock className="text-[#20A83E]" size={24} />
              </div>
              <h2 className="text-[#222222] text-xl">Cómo Empezamos</h2>
            </div>
            <div className="space-y-6 text-[#222222]/70">
              {(settings?.timeline ?? []).map((item, i) => (
                <div key={`${item.year}-${i}`} className="flex gap-6 border-l-2 border-[#D9D9D9] pl-6">
                  <div className="w-16 shrink-0 font-semibold text-[#20A83E]">{item.year}</div>
                  <p className="leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
