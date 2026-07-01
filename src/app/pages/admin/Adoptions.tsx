import { useState } from 'react';
import { Plus, Edit2, Eye } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';

export function AdminAdoptions() {
  const [pets, setPets] = useState([
    { id: 1, name: 'Max', age: '2 años', size: 'Mediano', status: 'available', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop' },
    { id: 2, name: 'Luna', age: '1 año', size: 'Pequeño', status: 'available', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop' },
    { id: 3, name: 'Rocky', age: '3 años', size: 'Grande', status: 'adopted', image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=200&h=200&fit=crop' },
    { id: 4, name: 'Bella', age: '6 meses', size: 'Pequeño', status: 'available', image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=200&h=200&fit=crop' }
  ]);

  const toggleStatus = (id: number) => {
    setPets(pets.map(pet =>
      pet.id === id ? { ...pet, status: pet.status === 'available' ? 'adopted' : 'available' } : pet
    ));
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#222222] mb-1 text-3xl">Adopciones</h1>
          <p className="text-[#222222]/50">Gestiona perritos disponibles</p>
        </div>
        <PrimaryButton variant="primary" className="flex items-center gap-2">
          <Plus size={18} />
          Agregar Perrito
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {pets.map(pet => (
          <div key={pet.id} className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-[#D9D9D9]/50 hover:shadow-md transition-all duration-250">
            <div className="relative">
              <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
              <button
                onClick={() => toggleStatus(pet.id)}
                className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-250 hover:scale-[1.05] ${
                  pet.status === 'available' ? 'bg-[#20A83E] text-white' : 'bg-[#222222] text-white'
                }`}
              >
                {pet.status === 'available' ? 'Disponible' : 'Adoptado'}
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-[#222222] mb-2 text-lg font-medium">{pet.name}</h3>
              <div className="flex gap-2 mb-4">
                <span className="bg-[#F8F8F8] text-[#222222] px-2 py-1 rounded-md text-xs border border-[#D9D9D9]">{pet.age}</span>
                <span className="bg-[#F8F8F8] text-[#222222] px-2 py-1 rounded-md text-xs border border-[#D9D9D9]">{pet.size}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[#20A83E] bg-[#20A83E]/10 rounded-lg hover:bg-[#20A83E]/20 transition-all duration-250 text-sm">
                  <Eye size={15} />
                  Ver
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[#222222] bg-[#F8F8F8] rounded-lg hover:bg-[#D9D9D9]/40 transition-all duration-250 text-sm border border-[#D9D9D9]">
                  <Edit2 size={15} />
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
