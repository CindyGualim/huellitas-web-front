import { useEffect, useState } from 'react';
import { Plus, Home, Stethoscope, Syringe, Pill, Activity, Scissors, Search } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { MedicalRecordFormModal } from '../../components/admin/MedicalRecordFormModal';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { useAuth } from '../../context/AuthContext';
import { apiGetPets, apiGetMedicalRecords, apiCreateMedicalRecord, ApiPet, ApiMedicalRecord, MedicalRecordPayload } from '../../lib/api';
import { medicalRecordTypeLabel, sizeLabel } from '../../lib/petMappings';

const RECORD_ICONS: Record<string, typeof Stethoscope> = {
  Consulta: Stethoscope,
  Vacunacion: Syringe,
  Desparasitacion: Pill,
  Tratamiento: Activity,
  Castracion: Scissors
};

interface TimelineItem {
  key: string;
  icon: typeof Stethoscope;
  title: string;
  subtitle: string;
  description?: string;
  date: Date;
}

export function AdminTracking() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador' || user?.role === 'Operador';
  const [pets, setPets] = useState<ApiPet[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPet, setSelectedPet] = useState<ApiPet | null>(null);
  const [records, setRecords] = useState<ApiMedicalRecord[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    apiGetPets()
      .then(allPets => {
        setPets(allPets);
        if (allPets.length > 0) setSelectedPet(allPets[0]);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudieron cargar las mascotas'))
      .finally(() => setIsLoadingPets(false));
  }, []);

  useEffect(() => {
    if (!token || !selectedPet) return;

    setIsLoadingTimeline(true);
    apiGetMedicalRecords(token, selectedPet.id)
      .then(setRecords)
      .catch(() => setRecords([]))
      .finally(() => setIsLoadingTimeline(false));
  }, [token, selectedPet]);

  if (!hasAccess) return <RestrictedAccess />;

  const handleAddRecord = async (payload: MedicalRecordPayload) => {
    if (!token || !selectedPet) return;

    const created = await apiCreateMedicalRecord(token, selectedPet.id, payload);
    setRecords([created, ...records]);
  };

  const filteredPets = pets.filter(pet => pet.name.toLowerCase().includes(search.toLowerCase()));

  const timeline: TimelineItem[] = selectedPet ? [
    ...records.map(record => ({
      key: `record-${record.id}`,
      icon: RECORD_ICONS[record.recordType] ?? Stethoscope,
      title: medicalRecordTypeLabel(record.recordType),
      subtitle: record.treatment,
      description: record.observations,
      date: new Date(record.consultationDate)
    })),
    {
      key: 'intake',
      icon: Home,
      title: 'Ingreso al refugio',
      subtitle: `${selectedPet.breed} · ${sizeLabel(selectedPet.size)}`,
      date: new Date(selectedPet.createdAt)
    }
  ].sort((a, b) => b.date.getTime() - a.date.getTime()) : [];

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Seguimiento</h1>
        <p className="text-[#222222]/50">Historial médico y línea de tiempo de cada rescatado</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
            <div className="p-4 border-b border-[#D9D9D9]/40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#222222]/40" size={16} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar mascota..."
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F8F8F8] rounded-xl text-sm text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9]"
                />
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {isLoadingPets ? (
                <p className="text-[#222222]/50 text-sm p-4">Cargando...</p>
              ) : filteredPets.length === 0 ? (
                <p className="text-[#222222]/50 text-sm p-4">No se encontraron mascotas.</p>
              ) : (
                filteredPets.map(pet => {
                  const cover = pet.images.find(img => img.isCover) ?? pet.images[0];

                  return (
                    <button
                      key={pet.id}
                      onClick={() => setSelectedPet(pet)}
                      className={`w-full flex items-center gap-3 p-4 border-b border-[#D9D9D9]/20 last:border-0 transition-colors duration-250 cursor-pointer ${
                        selectedPet?.id === pet.id ? 'bg-[#20A83E]/10' : 'hover:bg-[#F8F8F8]'
                      }`}
                    >
                      {cover ? (
                        <img src={cover.imageUrl} alt={pet.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#D9D9D9]/40 shrink-0" />
                      )}
                      <div className="text-left min-w-0">
                        <div className="text-[#222222] font-medium text-sm truncate">{pet.name}</div>
                        <div className="text-[#222222]/40 text-xs truncate">{pet.breed}</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50 min-h-[400px]">
            {!selectedPet ? (
              <p className="text-[#222222]/50 text-sm">Seleccioná una mascota para ver su historial.</p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-[#222222] text-xl font-medium">{selectedPet.name}</h2>
                    <p className="text-[#222222]/50 text-sm">Línea de tiempo</p>
                  </div>
                  <PrimaryButton variant="primary" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Agregar registro
                  </PrimaryButton>
                </div>

                {isLoadingTimeline ? (
                  <p className="text-[#222222]/50 text-sm">Cargando...</p>
                ) : (
                  <div className="relative pl-8">
                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#D9D9D9]" />
                    <div className="space-y-6">
                      {timeline.map(item => (
                        <div key={item.key} className="relative">
                          <div className="absolute -left-8 top-0 w-8 h-8 rounded-full bg-[#20A83E]/10 border-2 border-white shadow-sm flex items-center justify-center">
                            <item.icon size={15} className="text-[#20A83E]" />
                          </div>
                          <div className="bg-[#F8F8F8] rounded-xl p-4 border border-[#D9D9D9]/40">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-[#222222] text-sm">{item.title}</span>
                              <span className="text-[#222222]/40 text-xs">
                                {item.date.toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-[#222222]/70 text-sm">{item.subtitle}</p>
                            {item.description && (
                              <p className="text-[#222222]/50 text-xs mt-1">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedPet && (
        <MedicalRecordFormModal
          petName={selectedPet.name}
          onSubmit={handleAddRecord}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
