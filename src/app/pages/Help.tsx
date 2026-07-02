import { useState, useEffect } from 'react';
import { Heart, Package, Banknote, ShieldAlert, Info, HelpCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { fetchPets, type Pet } from '../data/pets';

export function Help() {
  const [casesNeedingHelp, setCasesNeedingHelp] = useState<Pet[]>([]);

  useEffect(() => {
    fetchPets()
      .then(pets => setCasesNeedingHelp(pets.filter(pet => pet.needs.length > 0).slice(0, 3)))
      .catch(() => setCasesNeedingHelp([]));
  }, []);

  return (
    <Layout>
      <div className="bg-[#F8F8F8] min-h-screen pb-20">
        {/* Header */}
        <div className="bg-[#146B27] px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-white mb-3 text-4xl md:text-5xl font-bold">Quiero Ayudar</h1>
            <p className="text-white/80 text-xl max-w-2xl">
              Tu apoyo transforma la vida de animales rescatados. Únete a nuestra comunidad y sé parte del cambio.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-12 space-y-12">
          
          {/* Section 1: ¿Cómo puedes ayudar? */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Heart className="text-[#20A83E]" size={28} />
              <h2 className="text-[#222222] text-2xl font-bold">¿Cómo puedes ayudar?</h2>
            </div>
            <p className="text-[#222222]/70 text-lg mb-8 leading-relaxed">
              Existen múltiples maneras de sumarte a nuestra causa. Desde aportes económicos que nos permiten costear cirugías y tratamientos, hasta donaciones en especie y la apertura de tu hogar como casa cuna temporal. Cada pequeña acción suma en la rehabilitación de nuestros rescatados.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Section 2: Donaciones Monetarias */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#D9D9D9]/50">
                <div className="bg-[#20A83E]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Banknote className="text-[#20A83E]" size={28} />
                </div>
                <h3 className="text-[#222222] text-xl font-bold mb-4">Donaciones Monetarias</h3>
                <p className="text-[#222222]/70 leading-relaxed mb-6">
                  Tus contribuciones financieras son el pilar de nuestra operación. Nos permiten cubrir rescates de emergencia, rehabilitación física, cuidados veterinarios especializados, cirugías, y la alimentación diaria de todos los animales en recuperación.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="bg-[#F8F8F8] p-4 rounded-xl border border-[#D9D9D9]/50">
                    <p className="text-sm text-[#222222]/60 mb-1">Cuenta Monetaria - Banco Industrial</p>
                    <p className="text-[#222222] font-semibold text-lg tracking-wide">123-456789-0</p>
                    <p className="text-sm text-[#222222]/80 mt-1">A nombre de: Asociación Huellitas de la Calle</p>
                  </div>
                </div>
                <button className="w-full bg-[#20A83E] text-white py-3.5 rounded-xl font-semibold hover:bg-[#146B27] transition-colors shadow-sm">
                  Quiero Ayudar
                </button>
              </div>

              {/* Section 3: Donaciones en Especie */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#D9D9D9]/50">
                <div className="bg-[#20A83E]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Package className="text-[#20A83E]" size={28} />
                </div>
                <h3 className="text-[#222222] text-xl font-bold mb-4">Donaciones en Especie</h3>
                <p className="text-[#222222]/70 leading-relaxed mb-6">
                  Recibimos constantemente insumos que son vitales para el día a día de la organización. Puedes entregarlos en nuestro centro de acopio principal.
                </p>
                <h4 className="font-semibold text-[#222222] mb-3">Insumos más necesitados:</h4>
                <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {[
                    'Concentrado para perros',
                    'Concentrado para gatos',
                    'Medicamentos',
                    'Camas y Cobijas',
                    'Correas',
                    'Transportadoras',
                    'Arena para gatos',
                    'Productos de limpieza'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#222222]/80 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#20A83E]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Casos que Necesitan Ayuda */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-center gap-3 mb-8">
              <ShieldAlert className="text-[#20A83E]" size={28} />
              <h2 className="text-[#222222] text-2xl font-bold">Casos que Necesitan Ayuda</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {casesNeedingHelp.map(pet => (
                <div key={pet.id} className="bg-[#F8F8F8] rounded-2xl overflow-hidden border border-[#D9D9D9]/50 flex flex-col">
                  <div className="h-48 relative">
                    <ImageWithFallback src={pet.image} alt={pet.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#146B27]">
                      {pet.species}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-[#222222] mb-2">{pet.name}</h3>
                    <p className="text-[#222222]/70 text-sm mb-4 line-clamp-3">
                      {pet.rescueStory}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="bg-[#20A83E]/10 rounded-xl p-3">
                        <h4 className="text-xs font-semibold uppercase text-[#146B27] mb-2 tracking-wider">Necesidades Urgentes</h4>
                        <ul className="space-y-1.5">
                          {pet.needs.slice(0, 3).map((need, i) => (
                            <li key={i} className="text-sm text-[#222222]/80 flex items-start gap-2">
                              <span className="text-[#20A83E] mt-0.5">•</span>
                              <span className="leading-tight">Necesita {need.toLowerCase()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Preguntas Frecuentes */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="text-[#20A83E]" size={28} />
              <h2 className="text-[#222222] text-2xl font-bold">Preguntas Frecuentes</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D9D9D9]/50">
                <h3 className="text-[#222222] font-semibold text-lg mb-2 flex items-center gap-2">
                  <Info size={18} className="text-[#20A83E]" />
                  ¿Cómo puedo realizar una donación?
                </h3>
                <p className="text-[#222222]/70">
                  Puedes realizar transferencias directas a nuestra cuenta bancaria en Banco Industrial. Para donaciones desde el extranjero o uso de tarjeta, contáctanos a nuestro WhatsApp para enviarte un enlace de pago seguro.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D9D9D9]/50">
                <h3 className="text-[#222222] font-semibold text-lg mb-2 flex items-center gap-2">
                  <Info size={18} className="text-[#20A83E]" />
                  ¿Dónde puedo entregar mis donaciones en especie?
                </h3>
                <p className="text-[#222222]/70">
                  Recibimos donaciones físicas en nuestro centro de acopio principal ubicado en la Zona 10 de la Ciudad de Guatemala, de lunes a sábado de 9:00 AM a 4:00 PM. Por favor, comunícate con nosotros para coordinar tu visita.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D9D9D9]/50">
                <h3 className="text-[#222222] font-semibold text-lg mb-2 flex items-center gap-2">
                  <Info size={18} className="text-[#20A83E]" />
                  ¿Cómo se utilizan las donaciones?
                </h3>
                <p className="text-[#222222]/70">
                  El 100% de las donaciones se destina directamente al bienestar animal. Los fondos cubren facturas veterinarias, cirugías de emergencia, medicamentos, alimentos, y gastos de refugios temporales. Publicamos reportes de transparencia trimestrales en nuestra plataforma.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="bg-[#146B27] rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[#20A83E] opacity-20 transform -skew-y-3 origin-bottom-left" />
            <div className="relative z-10">
              <h2 className="text-white text-3xl font-bold mb-4">¿Listo para hacer la diferencia?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Tu aporte, sin importar el tamaño, significa una nueva oportunidad de vida para un animal rescatado.
              </p>
              <button className="bg-white text-[#146B27] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#F8F8F8] hover:scale-105 transition-all shadow-lg inline-flex items-center gap-2">
                <Heart size={20} className="fill-[#146B27]" />
                Quiero Ayudar
              </button>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}