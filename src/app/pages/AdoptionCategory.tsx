import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Search, Scale, ArrowLeft } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { fetchPets, type Pet } from '../data/pets';
import dogsHeroImg from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__1_.jpeg';
import catsHeroImg from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__2_.jpeg';
import othersHeroImg from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__3_.jpeg';

function PetCard({ pet }: { pet: Pet }) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-250 border border-[#D9D9D9]/50 transform hover:-translate-y-1 h-full flex flex-col group">
      <div className="relative overflow-hidden h-64 shrink-0">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
            pet.status === 'Disponible'
              ? 'bg-[#20A83E] text-white'
              : pet.status === 'En proceso'
              ? 'bg-[#146B27] text-white'
              : 'bg-[#D9D9D9] text-[#222222]'
          }`}>
            {pet.status}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-xl font-medium">{pet.name}</h3>
          <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
            <Scale size={14} />
            <span>{pet.weight} · {pet.age}</span>
          </div>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-[#F8F8F8] text-[#222222] px-3 py-1.5 rounded-md text-xs border border-[#D9D9D9]">{pet.gender}</span>
          <span className="bg-[#F8F8F8] text-[#222222] px-3 py-1.5 rounded-md text-xs border border-[#D9D9D9]">{pet.size}</span>
          {pet.traits.slice(0, 2).map(trait => (
            <span key={trait} className="bg-[#F8F8F8] text-[#222222] px-3 py-1.5 rounded-md text-xs border border-[#D9D9D9]">
              {trait}
            </span>
          ))}
        </div>
        <Link to={`/adoptions/pet-profile/${pet.id}`}>
          <PrimaryButton variant="primary" fullWidth className="font-medium">Ver perfil de {pet.name.split(' ')[0]}</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}

export function AdoptionCategory() {
  const { category } = useParams<{ category: string }>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchPets().then(setPets).catch(() => setPets([]));
  }, []);

  const categoryInfo = useMemo(() => {
    switch (category) {
      case 'dogs':
        return {
          title: 'Perritos en Adopción',
          subtitle: 'Lealtad incondicional esperando por ti',
          species: 'Perro',
          hero: dogsHeroImg
        };
      case 'cats':
        return {
          title: 'Gatitos en Adopción',
          subtitle: 'Encuentra a tu nuevo compañero ronroneador',
          species: 'Gato',
          hero: catsHeroImg
        };
      case 'others':
        return {
          title: 'Otras Mascotas',
          subtitle: 'Pequeños amigos que también necesitan amor',
          species: 'Otra',
          hero: othersHeroImg
        };
      default:
        return null;
    }
  }, [category]);

  if (!categoryInfo) {
    return <Navigate to="/adoptions" replace />;
  }

  const filteredPets = pets.filter(pet => {
    if (pet.species !== categoryInfo.species) return false;
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSize = !sizeFilter || pet.size === sizeFilter;
    const matchesGender = !genderFilter || pet.gender === genderFilter;
    return matchesSearch && matchesSize && matchesGender;
  });

  const featuredPets = filteredPets.slice(0, 2); // Show top 2 as featured if any exist, or adjust as needed. 
  // In a real app we might flag them specifically. 
  const displayPets = filteredPets;

  const filterChipClasses = (isActive: boolean) =>
    `px-5 py-2.5 rounded-xl transition-all duration-250 cursor-pointer text-sm font-medium transform hover:scale-[1.02] active:scale-95 ${
      isActive
        ? 'bg-[#20A83E] text-white shadow-md'
        : 'bg-white text-[#222222] hover:bg-[#F8F8F8] border border-[#D9D9D9]/80'
    }`;

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Category Hero */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img src={categoryInfo.hero} alt={categoryInfo.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end px-6 py-12">
            <div className="mx-auto max-w-6xl w-full">
              <Link to="/adoptions" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-250 mb-6 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 w-fit text-sm">
                <ArrowLeft size={16} /> Volver a categorías
              </Link>
              <h1 className="text-white text-4xl md:text-5xl font-bold mb-2">{categoryInfo.title}</h1>
              <p className="text-white/80 text-lg">{categoryInfo.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12 pb-24">
          {/* Filters */}
          <div className="mb-10 bg-[#F8F8F8] p-6 rounded-[24px] border border-[#D9D9D9]/50">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#222222]/40" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-3.5 bg-white rounded-[16px] text-[#222222] placeholder-[#222222]/40 focus:outline-none focus:ring-2 focus:ring-[#20A83E]/50 shadow-sm border border-[#D9D9D9] transition-all duration-250 hover:border-[#20A83E]/30"
                />
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0 items-center">
                {['Pequeño', 'Mediano', 'Grande'].map(size => (
                  <button key={size} onClick={() => setSizeFilter(sizeFilter === size ? null : size)} className={filterChipClasses(sizeFilter === size)}>
                    {size}
                  </button>
                ))}
                <div className="w-px h-8 bg-[#D9D9D9] mx-1 hidden md:block" />
                {['Macho', 'Hembra'].map(gender => (
                  <button key={gender} onClick={() => setGenderFilter(genderFilter === gender ? null : gender)} className={filterChipClasses(genderFilter === gender)}>
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {displayPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPets.map(pet => <PetCard key={pet.id} pet={pet} />)}
            </div>
          ) : (
            <div className="text-center py-24 bg-[#F8F8F8] rounded-[24px] border border-[#D9D9D9]/50">
              <div className="text-6xl mb-4 opacity-50">🐾</div>
              <h3 className="text-[#222222] mb-2 text-xl font-medium">No encontramos {categoryInfo.species.toLowerCase()}s</h3>
              <p className="text-[#222222]/60">Intenta ajustar los filtros de búsqueda</p>
              <button 
                onClick={() => { setSearchTerm(''); setSizeFilter(null); setGenderFilter(null); }}
                className="mt-6 text-[#20A83E] font-medium hover:text-[#146B27] transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}