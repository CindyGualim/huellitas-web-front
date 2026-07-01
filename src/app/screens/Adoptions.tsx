import { useState } from 'react';
import { Search } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PetCard } from '../components/PetCard';

const allPets = [
  {
    id: '1',
    name: 'Max',
    age: '2 años',
    size: 'Mediano',
    temperament: 'Juguetón',
    gender: 'Macho',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'Luna',
    age: '1 año',
    size: 'Pequeño',
    temperament: 'Cariñosa',
    gender: 'Hembra',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Rocky',
    age: '3 años',
    size: 'Grande',
    temperament: 'Tranquilo',
    gender: 'Macho',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    name: 'Bella',
    age: '6 meses',
    size: 'Pequeño',
    temperament: 'Energética',
    gender: 'Hembra',
    image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=400&fit=crop'
  },
  {
    id: '5',
    name: 'Toby',
    age: '4 años',
    size: 'Mediano',
    temperament: 'Sociable',
    gender: 'Macho',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop'
  },
  {
    id: '6',
    name: 'Mía',
    age: '2 años',
    size: 'Grande',
    temperament: 'Protectora',
    gender: 'Hembra',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=400&fit=crop'
  }
];

export function Adoptions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);

  const filteredPets = allPets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSize = !sizeFilter || pet.size === sizeFilter;
    const matchesGender = !genderFilter || pet.gender === genderFilter;
    return matchesSearch && matchesSize && matchesGender;
  });

  const filterChipClasses = (isActive: boolean) =>
    `px-5 py-2.5 rounded-lg transition-all duration-250 cursor-pointer font-medium text-sm transform hover:scale-[1.02] ${
      isActive
        ? 'bg-[#178C2E] text-white shadow-sm'
        : 'bg-white text-[#4A2E1F] hover:bg-[#FFF9F1] border border-[#E7D7B1]/50'
    }`;

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-12 pb-16">
        <div className="mb-8">
          <h1 className="text-[#4A2E1F] mb-2 text-3xl">Perritos en Adopción</h1>
          <p className="text-[#4A2E1F]/70">Encuentra a tu nuevo mejor amigo</p>
        </div>

        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4A2E1F]/40" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-white rounded-[12px] text-[#4A2E1F] placeholder-[#4A2E1F]/50 focus:outline-none focus:ring-2 focus:ring-[#178C2E] shadow-sm border border-[#E7D7B1]/50 transition-all duration-250 hover:border-[#178C2E]/50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSizeFilter(sizeFilter === 'Pequeño' ? null : 'Pequeño')}
              className={filterChipClasses(sizeFilter === 'Pequeño')}
            >
              Pequeño
            </button>
            <button
              onClick={() => setSizeFilter(sizeFilter === 'Mediano' ? null : 'Mediano')}
              className={filterChipClasses(sizeFilter === 'Mediano')}
            >
              Mediano
            </button>
            <button
              onClick={() => setSizeFilter(sizeFilter === 'Grande' ? null : 'Grande')}
              className={filterChipClasses(sizeFilter === 'Grande')}
            >
              Grande
            </button>
            <button
              onClick={() => setGenderFilter(genderFilter === 'Macho' ? null : 'Macho')}
              className={filterChipClasses(genderFilter === 'Macho')}
            >
              Macho
            </button>
            <button
              onClick={() => setGenderFilter(genderFilter === 'Hembra' ? null : 'Hembra')}
              className={filterChipClasses(genderFilter === 'Hembra')}
            >
              Hembra
            </button>
          </div>
        </div>

        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map(pet => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-[16px] p-12 inline-block shadow-sm border border-[#E7D7B1]/50">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-[#4A2E1F] mb-2 text-xl">No hay perritos disponibles</h3>
              <p className="text-[#4A2E1F]/70">
                No encontramos perritos que coincidan con tu búsqueda
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
