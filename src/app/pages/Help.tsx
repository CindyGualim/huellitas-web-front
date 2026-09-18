import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, Banknote, ShieldAlert, Info, HelpCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { DonationAccountModal } from '../components/DonationAccountModal';
import { apiGetPets, ApiPet } from '../lib/api';
import { useSiteSettings } from '../lib/useSiteSettings';

export function Help() {
  const [casesNeedingHelp, setCasesNeedingHelp] = useState<ApiPet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const settings = useSiteSettings();

  useEffect(() => {
    apiGetPets({ limit: 100 })
      .then(({ items }) => {
        setCasesNeedingHelp(items.filter(pet => pet.status === 'En_tratamiento').slice(0, 5));
      })
      .catch(() => setCasesNeedingHelp([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout>
      <div className="bg-[#F8F8F8] min-h-screen pb-12">
        {/* Header */}
        <div className="bg-[#146B27] px-6 py-8 md:py-10">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-white mb-2 text-2xl md:text-3xl font-bold">Quiero Ayudar</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Tu apoyo transforma la vida de animales rescatados. Únete a nuestra comunidad y sé parte del cambio.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">

          {/* Section 1: ¿Cómo puedes ayudar? */}
          <section>
            <div className="flex items-center gap-2.5 mb-4">
              <Heart className="text-[#20A83E]" size={22} />
              <h2 className="text-[#222222] text-xl font-bold">¿Cómo puedes ayudar?</h2>
            </div>
            <p className="text-[#222222]/70 text-sm mb-5 leading-relaxed">
              Existen múltiples maneras de sumarte a nuestra causa. Desde aportes económicos que nos permiten costear cirugías y tratamientos, hasta donaciones en especie y la apertura de tu hogar como casa cuna temporal. Cada pequeña acción suma en la rehabilitación de nuestros rescatados.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Section 2: Donaciones Monetarias */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9D9D9]/50">
                <div className="bg-[#20A83E]/10 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  <Banknote className="text-[#20A83E]" size={22} />
                </div>
                <h3 className="text-[#222222] text-base font-bold mb-2.5">Donaciones Monetarias</h3>
                <p className="text-[#222222]/70 text-sm leading-relaxed mb-4">
                  Tus contribuciones financieras son el pilar de nuestra operación. Nos permiten cubrir rescates de emergencia, rehabilitación física, cuidados veterinarios especializados, cirugías, y la alimentación diaria de todos los animales en recuperación.
                </p>
                <div className="space-y-3 mb-5">
                  <div className="bg-[#F8F8F8] p-3.5 rounded-xl border border-[#D9D9D9]/50">
                    <p className="text-xs text-[#222222]/60 mb-1">
                      {settings ? `${settings.bankAccountType} - ${settings.bankName}` : 'Cargando datos bancarios...'}
                    </p>
                    <p className="text-[#222222] font-semibold text-base tracking-wide">{settings?.bankAccountNumber ?? '—'}</p>
                    <p className="text-xs text-[#222222]/80 mt-1">A nombre de: {settings?.bankAccountHolder ?? '—'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAccountModal(true)}
                  disabled={!settings}
                  className="w-full bg-[#20A83E] text-white py-2.5 text-sm rounded-xl font-semibold hover:bg-[#146B27] transition-colors shadow-sm disabled:opacity-60"
                >
                  Quiero Ayudar
                </button>
              </div>

              {/* Section 3: Donaciones en Especie */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9D9D9]/50">
                <div className="bg-[#20A83E]/10 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  <Package className="text-[#20A83E]" size={22} />
                </div>
                <h3 className="text-[#222222] text-base font-bold mb-2.5">Donaciones en Especie</h3>
                <p className="text-[#222222]/70 text-sm leading-relaxed mb-4">
                  Recibimos constantemente insumos que son vitales para el día a día de la organización. Puedes entregarlos en nuestro centro de acopio principal.
                </p>
                <h4 className="text-sm font-semibold text-[#222222] mb-2">Insumos más necesitados:</h4>
                <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {(settings?.neededSupplies ?? []).map((item, i) => (
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
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-center gap-2.5 mb-5">
              <ShieldAlert className="text-[#20A83E]" size={22} />
              <h2 className="text-[#222222] text-xl font-bold">Casos que Necesitan Ayuda</h2>
            </div>

            {isLoading ? (
              <p className="text-[#222222]/50 text-sm">Cargando casos...</p>
            ) : casesNeedingHelp.length === 0 ? (
              <p className="text-[#222222]/50 text-sm">Por el momento no hay casos en tratamiento activo. ¡Gracias a tu apoyo!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {casesNeedingHelp.map(pet => {
                  const cover = pet.images.find(img => img.isCover) ?? pet.images[0];

                  return (
                    <Link key={pet.id} to={`/adoptions/pet-profile/${pet.id}`} className="group block">
                      <div className="bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-250 border border-[#D9D9D9]/50 transform hover:-translate-y-1 flex flex-col h-full">
                        <div className="relative overflow-hidden h-64 md:h-72 shrink-0 bg-[#F8F8F8]">
                          {cover && (
                            <ImageWithFallback
                              src={cover.imageUrl}
                              alt={pet.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                          <div className="absolute top-2.5 right-2.5">
                            <span className="bg-[#20A83E] text-white px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm">
                              {pet.species}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="text-white text-base font-medium">{pet.name}</h3>
                          </div>
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="inline-block text-xs font-semibold uppercase text-[#146B27] bg-[#20A83E]/10 px-2.5 py-1 rounded-full tracking-wider mb-2">
                              En Recuperación
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="bg-[#F8F8F8] text-[#222222] px-2.5 py-0.5 rounded-md text-xs border border-[#D9D9D9]">{pet.breed}</span>
                              <span className="bg-[#F8F8F8] text-[#222222] px-2.5 py-0.5 rounded-md text-xs border border-[#D9D9D9]">{pet.gender}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[#146B27] group-hover:text-[#20A83E] font-medium transition-all duration-250 mt-3">
                            <span className="text-sm">Conocer su historia</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section 5: Preguntas Frecuentes */}
          <section>
            <div className="flex items-center gap-2.5 mb-4">
              <HelpCircle className="text-[#20A83E]" size={22} />
              <h2 className="text-[#222222] text-xl font-bold">Preguntas Frecuentes</h2>
            </div>

            <div className="space-y-3">
              {(settings?.faqs ?? []).map((faq, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-[#D9D9D9]/50">
                  <h3 className="text-[#222222] font-semibold text-sm mb-1.5 flex items-center gap-2">
                    <Info size={16} className="text-[#20A83E]" />
                    {faq.question}
                  </h3>
                  <p className="text-[#222222]/70 text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="bg-[#146B27] rounded-2xl p-6 md:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[#20A83E] opacity-20 transform -skew-y-3 origin-bottom-left" />
            <div className="relative z-10">
              <h2 className="text-white text-xl md:text-2xl font-bold mb-2">¿Listo para hacer la diferencia?</h2>
              <p className="text-white/80 text-sm mb-5 max-w-2xl mx-auto">
                Tu aporte, sin importar el tamaño, significa una nueva oportunidad de vida para un animal rescatado.
              </p>
              <button
                onClick={() => setShowAccountModal(true)}
                disabled={!settings}
                className="bg-white text-[#146B27] px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#F8F8F8] hover:scale-105 transition-all shadow-lg inline-flex items-center gap-2 disabled:opacity-60"
              >
                <Heart size={18} className="fill-[#146B27]" />
                Quiero Ayudar
              </button>
            </div>
          </section>

        </div>
      </div>

      {showAccountModal && settings && (
        <DonationAccountModal settings={settings} onClose={() => setShowAccountModal(false)} />
      )}
    </Layout>
  );
}