import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Share2, ArrowLeft, Instagram, Scale, CheckCircle2, Sparkles, HeartHandshake, Info, Clock } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { fetchPetById, fetchPets, type Pet } from '../data/pets';

export function PetProfile() {
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [otherPets, setOtherPets] = useState<Pet[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchPetById(petId ?? '')
      .then(setPet)
      .finally(() => setLoading(false));
  }, [petId]);

  useEffect(() => {
    if (!pet) return;
    fetchPets()
      .then(all => setOtherPets(all.filter(p => p.id !== pet.id && p.species === pet.species).slice(0, 3)))
      .catch(() => setOtherPets([]));
  }, [pet]);

  if (loading) return null;
  if (!pet) return <Navigate to="/adoptions" replace />;

  const handleShare = () => {
    const message = `¡Conoce a ${pet.name}! Buscando un hogar amoroso. ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Determine back link and category based on species
  const categoryLink = pet.species === 'Perro' ? 'dogs' : pet.species === 'Gato' ? 'cats' : 'others';
  const categoryLabel = pet.species === 'Perro' ? 'perritos' : pet.species === 'Gato' ? 'gatitos' : 'otras mascotas';

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-4 md:px-8 py-5">
          <div className="max-w-6xl mx-auto flex items-center gap-2">
            <Link to={`/adoptions/${categoryLink}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-250">
              <ArrowLeft size={18} />
              <span className="text-sm">Volver a {categoryLabel}</span>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-12">
            
            {/* Left Column: Image & Needs */}
            <div className="flex flex-col gap-8">
              <div className="relative">
                <div className="rounded-[32px] overflow-hidden shadow-lg aspect-[3/4] lg:h-[600px]">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-6 right-6">
                  <span className={`px-5 py-2 rounded-full text-sm font-bold shadow-md ${
                    pet.status === 'Disponible' ? 'bg-[#20A83E] text-white' : 'bg-[#146B27] text-white'
                  }`}>
                    {pet.status}
                  </span>
                </div>
              </div>

              {/* Nuevas necesidades */}
              <div className="bg-[#F8F8F8] rounded-[24px] p-8 border border-[#D9D9D9]/80 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#20A83E]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-[#222222] text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
                  <HeartHandshake className="text-[#20A83E]" size={24} />
                  ¿Qué necesita este animal?
                </h3>
                <p className="text-[#222222]/70 text-sm mb-5 relative z-10">
                  Además de amor y un hogar, actualmente necesita ayuda con:
                </p>
                
                <ul className="space-y-3 mb-8 relative z-10">
                  {pet.needs.map(item => (
                    <li key={item} className="flex items-start gap-3 text-[#222222]/80 bg-white p-3 rounded-xl shadow-sm border border-[#D9D9D9]/30">
                      <span className="text-[#20A83E] mt-0.5 shrink-0 bg-[#20A83E]/10 p-1 rounded-full">
                        <CheckCircle2 size={16} />
                      </span>
                      <span className="font-medium text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/about" className="relative z-10 block">
                  <button className="w-full bg-[#146B27] hover:bg-[#20A83E] text-white py-3.5 rounded-xl font-medium transition-colors duration-300 shadow-md">
                    Quiero ayudar
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="flex flex-col pt-2 lg:pt-6">
              
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#20A83E]/10 text-[#20A83E] px-4 py-1.5 rounded-full text-sm font-semibold border border-[#20A83E]/20 uppercase tracking-wide">
                  {pet.species}
                </span>
                <span className="bg-[#F8F8F8] text-[#222222] px-4 py-1.5 rounded-full text-sm border border-[#D9D9D9]">
                  {pet.gender}
                </span>
              </div>

              <h1 className="text-[#222222] text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{pet.name}</h1>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#F8F8F8] p-4 rounded-2xl flex flex-col gap-1 border border-[#D9D9D9]/50">
                  <Clock size={18} className="text-[#20A83E] mb-1" />
                  <span className="text-[#222222]/50 text-xs font-medium uppercase tracking-wider">Edad</span>
                  <span className="text-[#222222] font-semibold">{pet.age}</span>
                </div>
                <div className="bg-[#F8F8F8] p-4 rounded-2xl flex flex-col gap-1 border border-[#D9D9D9]/50">
                  <Scale size={18} className="text-[#20A83E] mb-1" />
                  <span className="text-[#222222]/50 text-xs font-medium uppercase tracking-wider">Peso</span>
                  <span className="text-[#222222] font-semibold">{pet.weight}</span>
                </div>
                <div className="bg-[#F8F8F8] p-4 rounded-2xl flex flex-col gap-1 border border-[#D9D9D9]/50">
                  <Info size={18} className="text-[#20A83E] mb-1" />
                  <span className="text-[#222222]/50 text-xs font-medium uppercase tracking-wider">Tamaño</span>
                  <span className="text-[#222222] font-semibold">{pet.size}</span>
                </div>
                <div className="bg-[#F8F8F8] p-4 rounded-2xl flex flex-col gap-1 border border-[#D9D9D9]/50">
                  <HeartHandshake size={18} className="text-[#20A83E] mb-1" />
                  <span className="text-[#222222]/50 text-xs font-medium uppercase tracking-wider">Estado</span>
                  <span className="text-[#222222] font-semibold">{pet.status}</span>
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-6 lg:p-8 mb-6 border border-[#D9D9D9]/60 shadow-sm">
                <h2 className="text-[#222222] text-xl font-bold mb-3 flex items-center gap-2">
                  <Sparkles size={20} className="text-[#20A83E]" />
                  Historia de rescate
                </h2>
                <p className="text-[#222222]/70 leading-relaxed text-base">{pet.rescueStory}</p>
              </div>

              <div className="bg-white rounded-[24px] p-6 lg:p-8 mb-6 border border-[#D9D9D9]/60 shadow-sm">
                <h2 className="text-[#222222] text-xl font-bold mb-3">Temperamento</h2>
                <p className="text-[#222222]/70 leading-relaxed mb-4">{pet.temperament}</p>
                <div className="flex flex-wrap gap-2">
                  {pet.traits.map(trait => (
                    <span key={trait} className="bg-[#F8F8F8] text-[#222222] px-3 py-1.5 rounded-lg text-sm border border-[#D9D9D9]/60">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-6 lg:p-8 mb-8 border border-[#D9D9D9]/60 shadow-sm">
                <h2 className="text-[#222222] text-xl font-bold mb-4">Información Médica</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {pet.health.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#222222]/70">
                      <CheckCircle2 size={18} className="text-[#20A83E] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {pet.status === 'Disponible' && (
                <div className="mt-auto">
                  <Link to="/adoption-request">
                    <button className="w-full bg-[#20A83E] hover:bg-[#146B27] text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 mb-4">
                      Solicitar adopción de {pet.name.split(' ')[0]}
                    </button>
                  </Link>

                  <div className="flex gap-4">
                    <button onClick={handleShare} className="flex-1 bg-white hover:bg-[#F8F8F8] text-[#222222] border border-[#D9D9D9] py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                      <Share2 size={18} />
                      Compartir
                    </button>
                    <a href="https://www.instagram.com/huellitasdelacalleong/" target="_blank" rel="noopener noreferrer" className="flex-1">
                      <button className="w-full bg-white hover:bg-[#F8F8F8] text-[#222222] border border-[#D9D9D9] py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                        <Instagram size={18} />
                        Instagram
                      </button>
                    </a>
                  </div>
                </div>
              )}

              {pet.status !== 'Disponible' && (
                <div className="mt-auto bg-[#F8F8F8] p-6 rounded-[20px] text-center border border-[#D9D9D9]">
                  <p className="text-[#222222] font-medium mb-1">Actualmente no está disponible para adopción</p>
                  <p className="text-[#222222]/60 text-sm">El estado actual es: {pet.status}</p>
                </div>
              )}
            </div>
          </div>

          {/* Más perritos/gatitos de la misma categoría */}
          {otherPets.length > 0 && (
            <div className="mt-20 pt-16 border-t border-[#D9D9D9]/60">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[#222222] text-3xl font-bold">Más {categoryLabel} buscando hogar</h2>
                <Link to={`/adoptions/${categoryLink}`} className="text-[#146B27] hover:text-[#20A83E] font-medium transition-colors hidden sm:block">
                  Ver todos →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {otherPets.map(p => (
                  <Link key={p.id} to={`/adoptions/pet-profile/${p.id}`} className="group block">
                    <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#D9D9D9]/50 transform hover:-translate-y-1">
                      <div className="relative h-60 overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <p className="text-white text-xl font-medium">{p.name}</p>
                          <p className="text-white/80 text-sm">{p.age} · {p.weight}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link to={`/adoptions/${categoryLink}`} className="block sm:hidden mt-6 text-center">
                <button className="w-full bg-[#F8F8F8] hover:bg-[#D9D9D9]/50 text-[#222222] py-3 rounded-xl font-medium transition-colors border border-[#D9D9D9]">
                  Ver todos
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}