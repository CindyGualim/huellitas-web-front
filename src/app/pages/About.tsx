import { Heart, Eye, Clock } from 'lucide-react';
import { Layout } from '../components/Layout';

export function About() {
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
                  Rescatar, rehabilitar y encontrar hogares amorosos para perros y gatos en situación de calle en Guatemala.
                  Trabajamos incansablemente para darles una segunda oportunidad a los animales abandonados, brindándoles
                  atención veterinaria, alimentación y amor mientras encuentran una familia permanente.
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
                  Soñamos con un Guatemala donde ningún animal esté en situación de calle, donde cada perro y gato tenga
                  un hogar seguro y amoroso. Aspiramos a crear conciencia sobre la tenencia responsable de mascotas y
                  reducir el abandono animal a través de la educación y programas de esterilización.
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
              {[
                { year: '2018', text: 'Un pequeño grupo de amigos comenzó a alimentar a perros callejeros en su comunidad. Lo que inició como un acto de compasión se convirtió en una misión.' },
                { year: '2020', text: 'Fundación oficial de Huellitas de la Calle como organización sin fines de lucro. Rescatamos a nuestros primeros 50 perritos y los ubicamos en hogares temporales.' },
                { year: '2022', text: 'Lanzamos nuestro primer programa de jornadas de castración, esterilizando más de 200 mascotas en comunidades de bajos recursos.' },
                { year: '2024', text: 'Hemos facilitado más de 500 adopciones exitosas y realizamos jornadas mensuales de castración en todo Guatemala.' },
              ].map(item => (
                <div key={item.year} className="flex gap-6 border-l-2 border-[#D9D9D9] pl-6">
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
