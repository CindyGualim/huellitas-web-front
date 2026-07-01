import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { pets } from '../data/pets';
import { events } from '../data/events';
import logoImg from '../../imports/huellitaslogo.png';

// Carousel photos
import photoHero1 from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__1_.jpeg';
import photoHero2 from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM.jpeg';
import photoHero3 from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__3_.jpeg';
import photoHero4 from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__2_-1.jpeg';

// Info cards photos
import photoAbout from '../../imports/WhatsApp_Image_2026-06-16_at_3.01.12_PM-1.jpeg';
import photoEvents from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__2_.jpeg';
import photoDonate from '../../imports/WhatsApp_Image_2026-06-16_at_3.01.12_PM__1_.jpeg';

const heroSlides = [
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

function HeroCarousel() {
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

  const next = useCallback(() => goTo((current + 1) % heroSlides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + heroSlides.length) % heroSlides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <div className="relative w-full h-[540px] md:h-[700px] overflow-hidden">
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current && !transitioning ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <ImageWithFallback
            src={s.image}
            alt={s.theme}
            className="w-full h-full object-cover"
            style={{ objectPosition: s.focusPosition }}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.1) 100%)' }} />

      <div
        className="absolute inset-0 z-20 flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24 transition-opacity duration-300"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-[#20A83E] text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            {slide.theme}
          </span>

          <h1 className="text-white text-4xl md:text-6xl mb-1 leading-tight">
            {slide.headline}
            <br />
            {slide.headlineLine2}
          </h1>

          <p className="text-white/80 text-lg mb-8 max-w-xl">
            Acompáñanos a darles el amor y cuidado que se merecen. Conoce nuestros próximos eventos en tu comunidad.
          </p>

          <Link to="/events">
            <PrimaryButton variant="primary" className="min-w-[220px]">
              Ver próximos eventos
            </PrimaryButton>
          </Link>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white rounded-full p-3 transition-all duration-250 backdrop-blur-sm border border-white/20"
        aria-label="Anterior"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white rounded-full p-3 transition-all duration-250 backdrop-blur-sm border border-white/20"
        aria-label="Siguiente"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {heroSlides.map((_, i) => (
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

      <div className="absolute bottom-6 right-6 z-30 text-white/40 text-xs tabular-nums">
        {String(current + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
      </div>
    </div>
  );
}

function FeaturedPetCard({ pet }: { pet: typeof pets[0] }) {
  return (
    <Link to={`/adoptions/pet-profile/${pet.id}`} className="group block h-full">
      <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-250 border border-[#D9D9D9]/50 transform hover:-translate-y-1 h-full flex flex-col">
        <div className="relative overflow-hidden h-64 md:h-72 shrink-0">
          <ImageWithFallback
            src={pet.image}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3">
            <span className="bg-[#20A83E] text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              {pet.status}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-xl font-medium">{pet.name}</h3>
            <p className="text-white/80 text-sm">{pet.weight}</p>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="flex flex-wrap gap-2 mb-4">
            {pet.traits.map(trait => (
              <span key={trait} className="bg-[#F8F8F8] text-[#222222] px-3 py-1 rounded-md text-xs border border-[#D9D9D9]">
                {trait}
              </span>
            ))}
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
  const upcomingEvents = events.slice(0, 3);

  return (
    <Layout>
      <div className="pb-16 bg-white">
        <HeroCarousel />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-[#222222] text-3xl md:text-4xl font-semibold mb-2">Rescatados buscando hogar</h2>
                <p className="text-[#222222]/60 text-lg">Cada uno tiene una historia — dale un capítulo feliz</p>
              </div>
              <Link to="/adoptions" className="text-[#146B27] hover:text-[#20A83E] font-medium transition-colors duration-250 whitespace-nowrap flex items-center gap-2">
                Ver todos los rescatados <span className="text-xl">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pets.map(pet => (
                <FeaturedPetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </div>

          {/* Próximos Eventos Section */}
          <div className="mb-20 bg-[#F8F8F8] rounded-[32px] p-8 md:p-12 border border-[#D9D9D9]/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-[#222222] text-3xl md:text-4xl font-semibold mb-2">Próximos Eventos</h2>
                <p className="text-[#222222]/60 text-lg">Jornadas comunitarias donde puedes ayudar o participar</p>
              </div>
              <Link to="/events" className="text-[#146B27] hover:text-[#20A83E] font-medium transition-colors duration-250 whitespace-nowrap flex items-center gap-2">
                Ver calendario completo <span className="text-xl">→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <div key={event.id} className="bg-white rounded-[24px] p-6 border border-[#D9D9D9]/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col transform hover:-translate-y-1">
                  <div className="mb-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                      event.category === 'Jornadas de Castración' ? 'bg-[#20A83E] text-white' : 
                      event.category === 'Jornadas de Adopción' ? 'bg-[#146B27] text-white' : 
                      'bg-[#D9D9D9] text-[#222222]'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-[#222222] text-xl font-bold mb-3">{event.title}</h3>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
                      <Calendar size={16} className="text-[#20A83E]" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
                      <MapPin size={16} className="text-[#20A83E]" />
                      <span>{event.municipality}</span>
                    </div>
                  </div>
                  
                  <p className="text-[#222222]/70 text-sm mb-6 flex-1 line-clamp-3">
                    {event.description}
                  </p>

                  {event.category === 'Jornadas de Castración' && event.slotsTotal > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-[#222222]/60 mb-1.5 font-medium">
                        <span>Cupos disponibles</span>
                        <span>{event.slotsTotal - event.slotsUsed} de {event.slotsTotal}</span>
                      </div>
                      <div className="w-full bg-[#D9D9D9]/40 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${event.slotsUsed >= event.slotsTotal ? 'bg-red-500' : 'bg-[#20A83E]'}`}
                          style={{ width: `${Math.min((event.slotsUsed / event.slotsTotal) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-auto">
                    <Link to={event.category === 'Jornadas de Castración' ? `/events/register/${event.id}` : '/events'} className="block">
                      <button className="w-full bg-[#F8F8F8] hover:bg-[#D9D9D9]/50 text-[#222222] py-3 rounded-xl font-medium transition-colors border border-[#D9D9D9] flex items-center justify-center gap-2">
                        {event.category === 'Jornadas de Castración' ? 'Inscribirse' : 'Más información'} <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              { to: '/about', img: photoAbout, label: 'Nosotros', desc: 'Conoce nuestra misión y equipo', btn: 'Nuestra historia' },
              { to: '/events', img: photoEvents, label: 'Eventos', desc: 'Jornadas de salud en tu municipio', btn: 'Ver calendario' },
              { to: '/help', img: photoDonate, label: 'Quiero Ayudar', desc: 'Ayúdanos a seguir rescatando', btn: 'Cómo apoyar' },
            ].map(({ to, img, label, desc, btn }) => (
              <Link key={label} to={to} className="group block">
                <div className="relative bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[320px] transform hover:-translate-y-1">
                  <ImageWithFallback src={img} alt={label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h3 className="text-white text-3xl font-semibold mb-2">{label}</h3>
                    <p className="text-white/80 mb-6">{desc}</p>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium w-fit border border-white/20 group-hover:bg-white group-hover:text-[#146B27] transition-all duration-300">
                      {btn} <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}