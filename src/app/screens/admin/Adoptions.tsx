import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';

const mockPets = [
  { id: 1, nombre: 'Max', estado: 'Disponible', imagen: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop' },
  { id: 2, nombre: 'Luna', estado: 'Disponible', imagen: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop' },
  { id: 3, nombre: 'Rocky', estado: 'Adoptado', imagen: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=200&h=200&fit=crop' }
];

export function AdminAdoptions() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#4A2E1F] text-3xl">Gestión de Adopciones</h1>
        <PrimaryButton
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Agregar Perrito
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPets.map(pet => (
          <div key={pet.id} className="bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-250 border border-[#E7D7B1]/50 transform hover:scale-[1.01]">
            <div className="overflow-hidden">
              <img src={pet.imagen} alt={pet.nombre} className="w-full h-48 object-cover transition-transform duration-250 hover:scale-105" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#4A2E1F]">{pet.nombre}</h3>
                <span
                  className={`px-3 py-1 rounded-lg text-sm ${
                    pet.estado === 'Disponible'
                      ? 'bg-[#178C2E]/10 text-[#178C2E] border border-[#178C2E]/20'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {pet.estado}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-3 bg-[#E7D7B1] hover:bg-[#d8c89f] rounded-lg text-[#4A2E1F] transition-all duration-250 active:scale-95">
                  Editar
                </button>
                <button className="px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-250 active:scale-95">
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#FFF9F1] rounded-[24px] p-8 max-w-md w-full">
            <h2 className="text-[#4A2E1F] mb-4 text-xl font-medium">Nuevo Perrito</h2>
            <p className="text-[#4A2E1F]/80 mb-6">
              Formulario para agregar un perrito en adopción
            </p>
            <div className="flex gap-3">
              <PrimaryButton
                variant="ghost"
                onClick={() => setShowModal(false)}
                fullWidth
              >
                Cancelar
              </PrimaryButton>
              <PrimaryButton
                variant="primary"
                onClick={() => setShowModal(false)}
                fullWidth
              >
                Guardar
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
