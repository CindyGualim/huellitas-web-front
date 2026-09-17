import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Share2, ArrowLeft, Instagram, Scale, Sparkles, HeartHandshake, Info, Clock, PawPrint } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { apiGetPet, apiGetPets, ApiPet } from '../lib/api';
import { sizeLabel, statusLabel } from '../lib/petMappings';
import { useSiteSettings } from '../lib/useSiteSettings';

export function PetProfile() {
  const { petId } = useParams<{ petId: string }>();
  const settings = useSiteSettings();
  const instagramUrl = `https://www.instagram.com/${(settings?.instagramHandle ?? '@huellitasdelacalleong').replace(/^@/, '')}/`;
  const [pet, setPet] = useState<ApiPet | null>(null);
  const [otherPets, setOtherPets] = useState<ApiPet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = Number(petId);

    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    apiGetPet(id)
      .then(fetchedPet => {
        setPet(fetchedPet);
        return apiGetPets({ availableOnly: true, limit: 100 }).then(({ items }) => {
          setOtherPets(items.filter(p => p.id !== fetchedPet.id && p.species === fetchedPet.species).slice(0, 3));
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [petId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-[#222222]/50">Cargando...</div>
      </Layout>
    );
  }

  if (notFound || !pet) return <Navigate to="/adoptions" replace />;

  const handleShare = () => {
    const message = `¡Conoce a ${pet.name}! Buscando un hogar amoroso. ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const categoryLink = pet.species === 'Perro' ? 'dogs' : 'cats';
  const categoryLabel = pet.species === 'Perro' ? 'perritos' : 'gatitos';
  const coverImage = pet.images.find(image => image.isCover) ?? pet.images[0];
  const galleryImages = pet.images.length ? pet.images : coverImage ? [coverImage] : [];

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

            {/* Left Column: Gallery */}
            <div className="flex flex-col gap-8">
              <div className="relative">
                <div className="rounded-[32px] overflow-hidden shadow-lg aspect-[3/4] lg:h-[600px] bg-[#F8F8F8]">
                  {coverImage ? (
                    <img src={coverImage.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#222222]/30">
                      <PawPrint size={64} />
                    </div>
                  )}
                </div>
                <div className="absolute top-6 right-6">
                  <span className={`px-5 py-2 rounded-full text-sm font-bold shadow-md ${
                    pet.status === 'Disponible' ? 'bg-[#20A83E] text-white' : 'bg-[#146B27] text-white'
                  }`}>
                    {statusLabel(pet.status)}
                  </span>
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {galleryImages.map(image => (
                    <div key={image.id} className="rounded-[16px] overflow-hidden aspect-square">
                      <img src={image.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#D9D9D9]/60 shadow-sm">
                <h2 className="text-[#222222] text-xl font-bold mb-3 flex items-center gap-2">
                  <Sparkles size={20} className="text-[#20A83E]" />
                  Historia de rescate
                </h2>
                <p className="text-[#222222]/70 leading-relaxed text-base">{pet.rescueStory}</p>
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
                  <span className="text-[#222222] font-semibold">{pet.estimatedAge}</span>
                </div>
                <div className="bg-[#F8F8F8] p-4 rounded-2xl flex flex-col gap-1 border border-[#D9D9D9]/50">
                  <Scale size={18} className="text-[#20A83E] mb-1" />
                  <span className="text-[#222222]/50 text-xs font-medium uppercase tracking-wider">Peso</span>
                  <span className="text-[#222222] font-semibold">{pet.weight} kg</span>
                </div>
                <div className="bg-[#F8F8F8] p-4 rounded-2xl flex flex-col gap-1 border border-[#D9D9D9]/50">
                  <Info size={18} className="text-[#20A83E] mb-1" />
                  <span className="text-[#222222]/50 text-xs font-medium uppercase tracking-wider">Tamaño</span>
                  <span className="text-[#222222] font-semibold">{sizeLabel(pet.size)}</span>
                </div>
                <div className="bg-[#F8F8F8] p-4 rounded-2xl flex flex-col gap-1 border border-[#D9D9D9]/50">
                  <HeartHandshake size={18} className="text-[#20A83E] mb-1" />
                  <span className="text-[#222222]/50 text-xs font-medium uppercase tracking-wider">Estado</span>
                  <span className="text-[#222222] font-semibold">{statusLabel(pet.status)}</span>
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-6 lg:p-8 mb-6 border border-[#D9D9D9]/60 shadow-sm">
                <h2 className="text-[#222222] text-xl font-bold mb-3">Sobre {pet.name.split(' ')[0]}</h2>
                <p className="text-[#222222]/70 leading-relaxed mb-4">{pet.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#F8F8F8] text-[#222222] px-3 py-1.5 rounded-lg text-sm border border-[#D9D9D9]/60">Raza: {pet.breed}</span>
                  <span className="bg-[#F8F8F8] text-[#222222] px-3 py-1.5 rounded-lg text-sm border border-[#D9D9D9]/60">Color: {pet.color}</span>
                </div>
              </div>

              {pet.status === 'Disponible' && (
                <div className="mt-auto">
                  <Link to={`/adoption-request/${pet.id}`}>
                    <button className="w-full bg-[#20A83E] hover:bg-[#146B27] text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 mb-4">
                      Solicitar adopción de {pet.name.split(' ')[0]}
                    </button>
                  </Link>

                  <div className="flex gap-4">
                    <button onClick={handleShare} className="flex-1 bg-white hover:bg-[#F8F8F8] text-[#222222] border border-[#D9D9D9] py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                      <Share2 size={18} />
                      Compartir
                    </button>
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
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
                  <p className="text-[#222222]/60 text-sm">El estado actual es: {statusLabel(pet.status)}</p>
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
                {otherPets.map(p => {
                  const pCover = p.images.find(image => image.isCover) ?? p.images[0];
                  return (
                    <Link key={p.id} to={`/adoptions/pet-profile/${p.id}`} className="group block">
                      <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#D9D9D9]/50 transform hover:-translate-y-1">
                        <div className="relative h-60 overflow-hidden bg-[#F8F8F8]">
                          {pCover && <img src={pCover.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <p className="text-white text-xl font-medium">{p.name}</p>
                            <p className="text-white/80 text-sm">{p.estimatedAge} · {p.weight} kg</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
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
