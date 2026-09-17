import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight, PawPrint, HeartHandshake, Syringe, ShieldAlert } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { apiGetPets, apiGetEvents, apiGetImpactStats, ApiPet, ApiEvent, ApiImpactStats } from '../lib/api';
import { eventTypeLabel } from '../lib/eventMappings';
import { useSiteSettings } from '../lib/useSiteSettings';

// Carousel photos
import photoHero1 from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__1_.jpeg';
import photoHero2 from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM.jpeg';
import photoHero3 from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__3_.jpeg';
import photoHero4 from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__2_-1.jpeg';

type HeroSlideView = {
  id: string;
  image: string;
  theme: string;
  headline: string;
  headlineLine2: string;
  focusPosition: string;
};

const defaultHeroSlides: HeroSlideView[] = [
  {
    id: 'slide-1',
    image: photoHero1,
    theme: 'Historias que cambian vidas',
    headline: 'Transformando vidas,',
    headlineLine2: 'una adopción a la vez.',
    focusPosition: 'center top',
  },
  {
    id: 'slide-2',
    image: photoHero2,
    theme: 'Rescate y rehabilitación',
    headline: 'Cada rescate es',
    headlineLine2: 'una segunda oportunidad.',
    focusPosition: 'center center',
  },
  {
    id: 'slide-3',
    image: photoHero3,
    theme: 'Atención comunitaria',
    headline: 'Llevamos bienestar animal',
    headlineLine2: 'a más comunidades.',
    focusPosition: 'center center',
  },
  {
    id: 'slide-4',
    image: photoHero4,
    theme: 'Protección y bienestar',
    headline: 'Juntos construimos',
    headlineLine2: 'un mejor futuro para ellos.',
    focusPosition: 'center center',
  },
];

function HeroCarousel({ slides }: { slides: HeroSlideView[] }) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [slides.length, current]);

  const slide = slides[current] ?? slides[0];

  if (!slide) return null;

  return (
    <div className="relative w-full h-[320px] md:h-[440px] overflow-hidden rounded-[24px]">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 bg-[#146B27]"
          style={{ opacity: i === current && !transitioning ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <ImageWithFallback
            src={s.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
          />
          <ImageWithFallback
            src={s.image}
            alt={s.theme}
            className="absolute inset-0 w-full h-full object-contain"
            style={{ objectPosition: s.focusPosition }}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.1) 100%)' }} />

      <div
        className="absolute inset-0 z-20 flex flex-col justify-end px-14 md:px-20 pb-14 md:pb-16 transition-opacity duration-300"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-[#20A83E] text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide mb-2">
            {slide.theme}
          </span>

          <h1 className="text-white text-2xl md:text-4xl mb-1 leading-tight">
            {slide.headline}
            <br />
            {slide.headlineLine2}
          </h1>

          <p className="text-white/80 text-sm md:text-base mb-4 max-w-xl">
            Acompáñanos a darles el amor y cuidado que se merecen. Conoce nuestros próximos eventos en tu comunidad.
          </p>

          <Link to="/events">
            <PrimaryButton variant="primary" className="min-w-[200px]">
              Ver próximos eventos
            </PrimaryButton>
          </Link>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white rounded-full p-3 transition-all duration-250 backdrop-blur-sm border border-white/20"
        aria-label="Anterior"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white rounded-full p-3 transition-all duration-250 backdrop-blur-sm border border-white/20"
        aria-label="Siguiente"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'bg-[#20A83E] w-7 h-2.5' : 'bg-white/40 hover:bg-white/70 w-2.5 h-2.5'
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-5 right-5 z-30 text-white/40 text-xs tabular-nums">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  );
}

function FeaturedPetCard({ pet }: { pet: ApiPet }) {
  const coverImage = pet.images.find(image => image.isCover) ?? pet.images[0];

  return (
    <Link to={`/adoptions/pet-profile/${pet.id}`} className="group block h-full">
      <div className="bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-250 border border-[#D9D9D9]/50 transform hover:-translate-y-1 h-full flex flex-col">
        <div className="relative overflow-hidden h-64 md:h-72 shrink-0 bg-[#F8F8F8]">
          {coverImage && (
            <ImageWithFallback
              src={coverImage.imageUrl}
              alt={pet.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-[#20A83E] text-white px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm">
              {pet.status}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white text-base font-medium">{pet.name}</h3>
            <p className="text-white/80 text-xs">{pet.weight} kg</p>
          </div>
        </div>
        <div className="p-3.5 flex-1 flex flex-col justify-between">
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="bg-[#F8F8F8] text-[#222222] px-2.5 py-0.5 rounded-md text-xs border border-[#D9D9D9]">
              {pet.breed}
            </span>
            <span className="bg-[#F8F8F8] text-[#222222] px-2.5 py-0.5 rounded-md text-xs border border-[#D9D9D9]">
              {pet.gender}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#146B27] group-hover:text-[#20A83E] font-medium transition-all duration-250">
            <span className="text-sm">Ver perfil</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function Home() {
  const [featuredPets, setFeaturedPets] = useState<ApiPet[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ApiEvent[]>([]);
  const [urgentCases, setUrgentCases] = useState<ApiPet[]>([]);
  const [impactStats, setImpactStats] = useState<ApiImpactStats | null>(null);
  const settings = useSiteSettings();

  const heroSlides: HeroSlideView[] = settings?.heroSlides.length
    ? settings.heroSlides.map((s, i) => ({
        id: `admin-slide-${i}`,
        image: s.imageUrl,
        theme: s.theme,
        headline: s.headline,
        headlineLine2: s.headlineLine2,
        focusPosition: s.focusPosition ?? 'center center'
      }))
    : defaultHeroSlides;

  useEffect(() => {
    apiGetPets({ availableOnly: true, limit: 100 })
      .then(({ items }) => setFeaturedPets(items.filter(pet => pet.featured)))
      .catch(() => setFeaturedPets([]));

    apiGetPets({ limit: 100 })
      .then(({ items }) => setUrgentCases(items.filter(pet => pet.status === 'En_tratamiento').slice(0, 5)))
      .catch(() => setUrgentCases([]));

    apiGetEvents({ limit: 100 })
      .then(({ items }) => setUpcomingEvents(items.filter(e => e.status === 'Programado' || e.status === 'En_curso').slice(0, 3)))
      .catch(() => setUpcomingEvents([]));

    apiGetImpactStats()
      .then(setImpactStats)
      .catch(() => setImpactStats(null));
  }, []);

  return (
    <Layout>
      <div className="pb-10 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 md:pt-5">
          <HeroCarousel slides={heroSlides} />

          {impactStats && (
            <div className="mt-4 md:mt-5 bg-[#146B27] rounded-[24px] py-5 md:py-6 px-4 sm:px-6 grid grid-cols-3 text-center divide-x divide-white/20">
              <div>
                <div className="flex items-center justify-center gap-2 text-white text-xl md:text-3xl font-bold mb-1">
                  <PawPrint size={20} className="text-[#20A83E] hidden sm:block" />
                  {impactStats.rescatados}
                </div>
                <p className="text-white/70 text-xs md:text-sm">Animales rescatados</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 text-white text-xl md:text-3xl font-bold mb-1">
                  <HeartHandshake size={20} className="text-[#20A83E] hidden sm:block" />
                  {impactStats.adoptados}
                </div>
                <p className="text-white/70 text-xs md:text-sm">Adopciones exitosas</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 text-white text-xl md:text-3xl font-bold mb-1">
                  <Syringe size={20} className="text-[#20A83E] hidden sm:block" />
                  {impactStats.castrados}
                </div>
                <p className="text-white/70 text-xs md:text-sm">Castraciones realizadas</p>
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mt-8 md:mt-10 mb-8 md:mb-10 bg-[#20A83E]/[0.06] rounded-[24px] p-5 md:p-7 border border-[#20A83E]/15">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-5 gap-3">
              <div>
                <h2 className="text-[#222222] text-xl md:text-2xl font-semibold mb-1">Rescatados buscando hogar</h2>
                <p className="text-[#222222]/60 text-sm md:text-base">Cada uno tiene una historia — dale un capítulo feliz</p>
              </div>
              <Link to="/adoptions" className="text-[#146B27] hover:text-[#20A83E] font-medium transition-colors duration-250 whitespace-nowrap flex items-center gap-1.5 text-sm">
                Ver todos los rescatados <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredPets.map(pet => (
                <FeaturedPetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </div>

          {/* Próximos Eventos Section */}
          <div className="mb-8 md:mb-10 bg-[#F8F8F8] rounded-[24px] p-5 md:p-7 border border-[#D9D9D9]/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-5 gap-3">
              <div>
                <h2 className="text-[#222222] text-xl md:text-2xl font-semibold mb-1">Próximos Eventos</h2>
                <p className="text-[#222222]/60 text-sm md:text-base">Jornadas comunitarias donde puedes ayudar o participar</p>
              </div>
              <Link to="/events" className="text-[#146B27] hover:text-[#20A83E] font-medium transition-colors duration-250 whitespace-nowrap flex items-center gap-1.5 text-sm">
                Ver calendario completo <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="bg-white rounded-[16px] p-4 border border-[#D9D9D9]/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col transform hover:-translate-y-1">
                  <div className="mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${
                      event.type === 'Jornada_castracion' ? 'bg-[#20A83E] text-white' :
                      event.type === 'Jornada_adopcion' ? 'bg-[#146B27] text-white' :
                      'bg-[#D9D9D9] text-[#222222]'
                    }`}>
                      {eventTypeLabel(event.type)}
                    </span>
                  </div>
                  <h3 className="text-[#222222] text-base font-bold mb-2">{event.title}</h3>
                  <div className="flex flex-col gap-1.5 mb-3">
                    <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
                      <Calendar size={14} className="text-[#20A83E]" />
                      <span>{new Date(event.startDate).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
                      <MapPin size={14} className="text-[#20A83E]" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-[#222222]/70 text-sm mb-4 flex-1 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-auto">
                    <Link to={event.type === 'Jornada_castracion' ? `/events/register/${event.id}` : '/events'} className="block">
                      <button className="w-full bg-[#F8F8F8] hover:bg-[#D9D9D9]/50 text-[#222222] py-2.5 rounded-xl font-medium text-sm transition-colors border border-[#D9D9D9] flex items-center justify-center gap-2">
                        {event.type === 'Jornada_castracion' ? 'Inscribirse' : 'Más información'} <ArrowRight size={14} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {urgentCases.length > 0 && (
            <div className="mb-8 md:mb-10 bg-[#FFF7ED] rounded-[24px] p-5 md:p-7 border border-[#F3DCB8]">
              <div className="flex items-center gap-2.5 mb-5">
                <ShieldAlert className="text-[#C2751A]" size={22} />
                <div>
                  <h2 className="text-[#222222] text-xl md:text-2xl font-semibold mb-1">Casos que necesitan tu ayuda</h2>
                  <p className="text-[#222222]/60 text-sm md:text-base">Están en tratamiento veterinario activo ahora mismo</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                {urgentCases.map(pet => {
                  const cover = pet.images.find(img => img.isCover) ?? pet.images[0];

                  return (
                    <div key={pet.id} className="bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-250 border border-[#D9D9D9]/50 transform hover:-translate-y-1 flex flex-col">
                      <div className="relative overflow-hidden h-64 md:h-72 shrink-0 bg-[#F8F8F8]">
                        {cover && (
                          <ImageWithFallback
                            src={cover.imageUrl}
                            alt={pet.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
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
                      <div className="p-3.5 flex-1 flex flex-col">
                        <p className="text-[#222222]/70 text-sm line-clamp-2">{pet.rescueStory}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <Link to="/help">
                  <PrimaryButton variant="primary" className="min-w-[220px]">
                    Quiero Ayudar
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}