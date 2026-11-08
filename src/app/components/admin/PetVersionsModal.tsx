import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiGetPetVersions, apiRestorePetVersion, ApiPet, ApiPetSnapshot, ApiPetVersion } from '../../lib/api';
import { statusLabel, sizeLabel } from '../../lib/petMappings';

const FIELD_LABELS: Record<keyof ApiPetSnapshot, string> = {
  name: 'Nombre',
  species: 'Especie',
  breed: 'Raza',
  gender: 'Sexo',
  estimatedAge: 'Edad',
  size: 'Tamaño',
  weight: 'Peso',
  color: 'Color',
  description: 'Descripción',
  rescueStory: 'Historia de rescate',
  status: 'Estado',
  intakeDate: 'Fecha de ingreso',
  featured: 'Destacada',
  images: 'Fotos'
};

const FIELDS = Object.keys(FIELD_LABELS) as (keyof ApiPetSnapshot)[];

function formatValue(field: keyof ApiPetSnapshot, snapshot: ApiPetSnapshot): string {
  const value = snapshot[field];
  switch (field) {
    case 'status': return statusLabel(String(value));
    case 'size': return sizeLabel(String(value));
    case 'weight': return `${value} kg`;
    case 'featured': return value ? 'Sí' : 'No';
    case 'intakeDate': return value ? new Date(String(value)).toLocaleDateString('es-GT', { timeZone: 'UTC' }) : '—';
    case 'images': return `${snapshot.images.length} foto${snapshot.images.length === 1 ? '' : 's'}`;
    default: {
      const text = String(value ?? '');
      return text.length > 60 ? `${text.slice(0, 60)}…` : text || '—';
    }
  }
}

function changedFields(current: ApiPetSnapshot, previous: ApiPetSnapshot) {
  return FIELDS.filter(field => JSON.stringify(current[field]) !== JSON.stringify(previous[field]));
}

export function PetVersionsModal({ pet, onClose, onRestored }: {
  pet: ApiPet;
  onClose: () => void;
  onRestored: (pet: ApiPet) => void;
}) {
  const { token } = useAuth();
  const [versions, setVersions] = useState<ApiPetVersion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [restoringVersion, setRestoringVersion] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!token) return;
    setError(null);
    apiGetPetVersions(token, pet.id)
      .then(setVersions)
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudo cargar el historial'));
  }, [token, pet.id, reloadKey]);

  const restore = async (version: ApiPetVersion) => {
    if (!token) return;
    const when = new Date(version.changedAt).toLocaleString('es-GT', { dateStyle: 'medium', timeStyle: 'short' });
    if (!window.confirm(`¿Restaurar los datos y fotos de ${pet.name} como estaban el ${when}? El estado actual (${statusLabel(pet.status)}) no cambia.`)) return;

    setRestoringVersion(version.version);
    setError(null);
    try {
      const restored = await apiRestorePetVersion(token, pet.id, version.version);
      onRestored(restored);
      setReloadKey(key => key + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restaurar la versión');
    } finally {
      setRestoringVersion(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg border border-[#D9D9D9]/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#D9D9D9]/50 sticky top-0 bg-white">
          <div>
            <h2 className="text-[#222222] text-xl font-medium">Historial de cambios</h2>
            <p className="text-xs text-[#222222]/50 mt-0.5">{pet.name} · se guardan las últimas 10 versiones</p>
          </div>
          <button type="button" onClick={onClose} className="text-[#222222]/50 hover:text-[#222222] cursor-pointer" aria-label="Cerrar">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          {!versions && !error && <p className="text-sm text-[#222222]/50">Cargando...</p>}

          {versions?.length === 0 && (
            <p className="text-sm text-[#222222]/50">Todavía no hay cambios registrados. El historial empieza con la próxima edición.</p>
          )}

          {versions?.map((version, index) => {
            const previous = versions[index + 1];
            const fields = previous ? changedFields(version.snapshot, previous.snapshot) : [];
            const isCurrent = index === 0;
            const who = version.changedBy?.name ?? 'Sistema';
            const title = !previous
              ? (version.version === 1 && version.changedBy ? `Creada por ${who}` : 'Versión más antigua guardada')
              : `Editada por ${who}`;

            return (
              <div key={version.id} className="p-4 rounded-xl border border-[#D9D9D9]/60 bg-[#F8F8F8]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-[#222222]">
                      {title}
                      {isCurrent && <span className="ml-2 text-xs font-medium text-[#146B27] bg-[#20A83E]/10 px-2 py-0.5 rounded-full">Actual</span>}
                    </div>
                    <div className="text-xs text-[#222222]/50">
                      {new Date(version.changedAt).toLocaleString('es-GT', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => restore(version)}
                      disabled={restoringVersion !== null}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#20A83E] hover:text-[#146B27] disabled:opacity-40 cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      {restoringVersion === version.version ? 'Restaurando...' : 'Restaurar'}
                    </button>
                  )}
                </div>

                {previous && (
                  fields.length === 0 ? (
                    <p className="text-xs text-[#222222]/50 mt-2">Guardó sin cambios.</p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {fields.map(field => (
                        <li key={field} className="text-xs text-[#222222]/70">
                          <span className="font-medium text-[#222222]">{FIELD_LABELS[field]}:</span>{' '}
                          <span className="line-through text-[#222222]/40">{formatValue(field, previous.snapshot)}</span>{' → '}
                          {formatValue(field, version.snapshot)}
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
