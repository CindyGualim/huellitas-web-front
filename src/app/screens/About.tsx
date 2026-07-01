import { Heart, Eye, Clock, Instagram } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';

export function About() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-12 pb-16">
        <div className="mb-12 text-center">
          <h1 className="text-[#4A2E1F] mb-4 text-3xl md:text-4xl">Nuestra Historia</h1>
          <p className="text-[#4A2E1F]/70 text-lg max-w-2xl mx-auto">
            Rescatando vidas, creando familias
          </p>
        </div>

        <div className="bg-white rounded-[16px] p-8 mb-6 shadow-sm border border-[#E7D7B1]/50">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-[#178C2E]/10 p-3 rounded-lg">
              <Heart className="text-[#178C2E]" size={24} />
            </div>
            <div>
              <h2 className="text-[#4A2E1F] mb-2 text-xl">Nuestra Misión</h2>
              <p className="text-[#4A2E1F]/80 leading-relaxed">
                Rescatar, rehabilitar y encontrar hogares amorosos para perros y gatos en situación de calle en Guatemala.
                Trabajamos incansablemente para darles una segunda oportunidad a los animales abandonados, brindándoles
                atención veterinaria, alimentación y amor mientras encuentran una familia permanente.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-8 mb-8 shadow-sm border border-[#E7D7B1]/50">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-[#F4C542]/10 p-3 rounded-lg">
              <Eye className="text-[#F4C542]" size={24} />
            </div>
            <div>
              <h2 className="text-[#4A2E1F] mb-2 text-xl">Nuestra Visión</h2>
              <p className="text-[#4A2E1F]/80 leading-relaxed">
                Soñamos con un Guatemala donde ningún animal esté en situación de calle, donde cada perro y gato tenga
                un hogar seguro y amoroso. Aspiramos a crear conciencia sobre la tenencia responsable de mascotas y
                reducir el abandono animal a través de la educación y programas de esterilización.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-8 shadow-sm border border-[#E7D7B1]/50">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-[#178C2E]/10 p-3 rounded-lg">
              <Clock className="text-[#178C2E]" size={24} />
            </div>
            <h2 className="text-[#4A2E1F] text-xl">Cómo Empezamos</h2>
          </div>
          <div className="space-y-6 text-[#4A2E1F]/80">
            <div className="flex gap-6 border-l-2 border-[#E7D7B1] pl-6">
              <div className="w-16 flex-shrink-0 font-semibold text-[#178C2E]">2018</div>
              <p className="leading-relaxed">
                Un pequeño grupo de amigos comenzó a alimentar a perros callejeros en su comunidad.
                Lo que inició como un acto de compasión se convirtió en una misión.
              </p>
            </div>
            <div className="flex gap-6 border-l-2 border-[#E7D7B1] pl-6">
              <div className="w-16 flex-shrink-0 font-semibold text-[#178C2E]">2020</div>
              <p className="leading-relaxed">
                Fundación oficial de Huellitas de la Calle como organización sin fines de lucro.
                Rescatamos a nuestros primeros 50 perritos y los ubicamos en hogares temporales.
              </p>
            </div>
            <div className="flex gap-6 border-l-2 border-[#E7D7B1] pl-6">
              <div className="w-16 flex-shrink-0 font-semibold text-[#178C2E]">2022</div>
              <p className="leading-relaxed">
                Lanzamos nuestro primer programa de jornadas de castración, esterilizando más de
                200 mascotas en comunidades de bajos recursos.
              </p>
            </div>
            <div className="flex gap-6 border-l-2 border-[#E7D7B1] pl-6">
              <div className="w-16 flex-shrink-0 font-semibold text-[#178C2E]">2024</div>
              <p className="leading-relaxed">
                Hemos facilitado más de 500 adopciones exitosas y realizamos jornadas mensuales
                de castración en todo Guatemala.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-8 shadow-sm border border-[#E7D7B1]/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#178C2E]/10 p-3 rounded-full">
              <Instagram className="text-[#178C2E]" size={24} />
            </div>
            <div>
              <h2 className="text-[#4A2E1F] text-xl">Síguenos en Instagram</h2>
              <p className="text-[#4A2E1F]/70 text-sm">@huellitasdelacalleong</p>
            </div>
          </div>
          <p className="text-[#4A2E1F]/80 mb-6">
            Mantente al día con nuestras historias de rescate, adopciones exitosas y eventos especiales.
            Síguenos en Instagram para ver más.
          </p>
          <a
            href="https://www.instagram.com/huellitasdelacalleong/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <PrimaryButton variant="ghost" fullWidth className="flex items-center justify-center gap-2">
              <Instagram size={20} />
              Visitar Instagram
            </PrimaryButton>
          </a>
        </div>
      </div>
    </Layout>
  );
}
