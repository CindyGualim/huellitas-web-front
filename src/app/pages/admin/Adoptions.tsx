import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Eye } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { PetFormModal } from '../../components/admin/PetFormModal';
import { fetchPets, updatePet, type Pet } from '../../data/pets';
import { STATUS_OPTIONS } from '../../data/petCatalog';

function nextStatusId(statusId: number): number {
  const index = STATUS_OPTIONS.findIndex(s => s.id === statusId);
  return STATUS_OPTIONS[(index + 1) % STATUS_OPTIONS.length].id;
}

export function AdminAdoptions() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>(undefined);

  const loadPets = () => {
    setLoading(true);
    fetchPets()
      .then(setPets)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPets();
  }, []);

  const openCreate = () => {
    setEditingPet(undefined);
    setModalOpen(true);
  };

  const openEdit = (pet: Pet) => {
    setEditingPet(pet);
    setModalOpen(true);
  };

  const handleSaved = (saved: Pet) => {
    setPets(prev => {
      const exists = prev.some(p => p.id === saved.id);
      return exists ? prev.map(p => (p.id === saved.id ? saved : p)) : [saved, ...prev];
    });
  };

  const toggleStatus = async (pet: Pet) => {
    const data = new FormData();
    data.set('statusId', String(nextStatusId(pet.statusId)));
    const updated = await updatePet(pet.id, data);
    handleSaved(updated);
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#222222] mb-1 text-3xl">Adopciones</h1>
          <p className="text-[#222222]/50">Gestiona perritos disponibles</p>
        </div>
        <PrimaryButton variant="primary" className="flex items-center gap-2" onClick={openCreate}>
          <Plus size={18} />
          Agregar Perrito
        </PrimaryButton>
      </div>

      {loading ? (
        <p className="text-[#222222]/50">Cargando mascotas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {pets.map(pet => (
            <div key={pet.id} className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-[#D9D9D9]/50 hover:shadow-md transition-all duration-250">
              <div className="relative">
                <img
                  src={pet.image || 'https://placehold.co/400x300?text=Sin+foto'}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleStatus(pet)}
                  className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-250 hover:scale-[1.05] ${
                    pet.status === 'Disponible' ? 'bg-[#20A83E] text-white' : 'bg-[#222222] text-white'
                  }`}
                >
                  {pet.status}
                </button>
              </div>
              <div className="p-5">
                <h3 className="text-[#222222] mb-2 text-lg font-medium">{pet.name}</h3>
                <div className="flex gap-2 mb-4">
                  <span className="bg-[#F8F8F8] text-[#222222] px-2 py-1 rounded-md text-xs border border-[#D9D9D9]">{pet.age}</span>
                  <span className="bg-[#F8F8F8] text-[#222222] px-2 py-1 rounded-md text-xs border border-[#D9D9D9]">{pet.size}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/adoptions/pet-profile/${pet.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[#20A83E] bg-[#20A83E]/10 rounded-lg hover:bg-[#20A83E]/20 transition-all duration-250 text-sm"
                  >
                    <Eye size={15} />
                    Ver
                  </Link>
                  <button
                    onClick={() => openEdit(pet)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[#222222] bg-[#F8F8F8] rounded-lg hover:bg-[#D9D9D9]/40 transition-all duration-250 text-sm border border-[#D9D9D9]"
                  >
                    <Edit2 size={15} />
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PetFormModal open={modalOpen} onOpenChange={setModalOpen} pet={editingPet} onSaved={handleSaved} />
    </div>
  );
}
