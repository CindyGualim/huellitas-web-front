import { useEffect, useState } from 'react';
import { Plus, Edit2, Eye, Trash2 } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { PetFormModal } from '../../components/admin/PetFormModal';
import { useAuth } from '../../context/AuthContext';
import { apiGetPets, apiCreatePet, apiUpdatePet, apiDeletePet, ApiPet, PetPayload } from '../../lib/api';
import { STATUS_OPTIONS, statusLabel, statusBadgeClass } from '../../lib/petMappings';

export function AdminAdoptions() {
  const { token, user } = useAuth();
  const canManagePets = user?.role === 'Superadministrador' || user?.role === 'Operador';
  const [pets, setPets] = useState<ApiPet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ mode: 'create' | 'edit'; pet?: ApiPet } | null>(null);

  const loadPets = () => {
    setIsLoading(true);
    apiGetPets()
      .then(setPets)
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudieron cargar las mascotas'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadPets();
  }, []);

  const cycleStatus = async (pet: ApiPet) => {
    if (!token) return;

    const currentIndex = STATUS_OPTIONS.findIndex(option => option.value === pet.status);
    const nextStatus = STATUS_OPTIONS[(currentIndex + 1) % STATUS_OPTIONS.length].value;

    const updated = await apiUpdatePet(token, pet.id, { status: nextStatus });
    setPets(pets.map(p => (p.id === pet.id ? updated : p)));
  };

  const handleDelete = async (pet: ApiPet) => {
    if (!token) return;
    if (!confirm(`¿Dar de baja a ${pet.name}? Dejará de listarse públicamente.`)) return;

    await apiDeletePet(token, pet.id);
    setPets(pets.filter(p => p.id !== pet.id));
  };

  const handleFormSubmit = async (payload: PetPayload) => {
    if (!token) throw new Error('No autorizado');

    if (modalState?.mode === 'edit' && modalState.pet) {
      const updated = await apiUpdatePet(token, modalState.pet.id, payload);
      setPets(pets.map(p => (p.id === updated.id ? updated : p)));
    } else {
      const created = await apiCreatePet(token, payload);
      setPets([created, ...pets]);
    }
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#222222] mb-1 text-3xl">Adopciones</h1>
          <p className="text-[#222222]/50">Gestiona perritos y gatitos disponibles</p>
        </div>
        {canManagePets && (
          <PrimaryButton
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setModalState({ mode: 'create' })}
          >
            <Plus size={18} />
            Agregar Mascota
          </PrimaryButton>
        )}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : pets.length === 0 ? (
        <p className="text-[#222222]/50">Todavía no hay mascotas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {pets.map(pet => {
            const coverImage = pet.images.find(image => image.isCover) ?? pet.images[0];

            return (
              <div key={pet.id} className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-[#D9D9D9]/50 hover:shadow-md transition-all duration-250">
                <div className="relative">
                  {coverImage ? (
                    <img src={coverImage.imageUrl} alt={pet.name} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-[#F8F8F8] flex items-center justify-center text-[#222222]/30 text-sm">
                      Sin imagen
                    </div>
                  )}
                  {canManagePets ? (
                    <button
                      onClick={() => cycleStatus(pet)}
                      title="Click para cambiar el estado"
                      className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-250 hover:scale-[1.05] cursor-pointer ${statusBadgeClass(pet.status)}`}
                    >
                      {statusLabel(pet.status)}
                    </button>
                  ) : (
                    <span className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium ${statusBadgeClass(pet.status)}`}>
                      {statusLabel(pet.status)}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-[#222222] mb-2 text-lg font-medium">{pet.name}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className="bg-[#F8F8F8] text-[#222222] px-2 py-1 rounded-md text-xs border border-[#D9D9D9]">{pet.estimatedAge}</span>
                    <span className="bg-[#F8F8F8] text-[#222222] px-2 py-1 rounded-md text-xs border border-[#D9D9D9]">{pet.breed}</span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`/adoptions/pet-profile/${pet.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[#20A83E] bg-[#20A83E]/10 rounded-lg hover:bg-[#20A83E]/20 transition-all duration-250 text-sm"
                    >
                      <Eye size={15} />
                      Ver
                    </a>
                    {canManagePets && (
                      <>
                        <button
                          onClick={() => setModalState({ mode: 'edit', pet })}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[#222222] bg-[#F8F8F8] rounded-lg hover:bg-[#D9D9D9]/40 transition-all duration-250 text-sm border border-[#D9D9D9] cursor-pointer"
                        >
                          <Edit2 size={15} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(pet)}
                          className="flex items-center justify-center px-3 py-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-250 text-sm border border-red-100 cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalState && (
        <PetFormModal
          mode={modalState.mode}
          initialData={modalState.pet}
          onSubmit={handleFormSubmit}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}
