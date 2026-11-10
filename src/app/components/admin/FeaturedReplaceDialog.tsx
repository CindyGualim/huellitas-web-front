import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, X } from 'lucide-react';
import { ApiPet, MAX_FEATURED_PETS } from '../../lib/api';
import { statusLabel } from '../../lib/petMappings';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface FeaturedReplaceDialogProps {
  /** Nombre de la mascota que se quiere destacar. */
  newPetName: string;
  /** Mascotas destacadas actualmente (las candidatas a retirar). */
  featuredPets: ApiPet[];
  isSubmitting?: boolean;
  onCancel: () => void;
  onReplace: (petIdToRemove: number) => void;
}

// Aviso que aparece al destacar una mascota cuando ya hay MAX_FEATURED_PETS destacadas.
// En el teléfono se muestra como panel inferior; en pantallas grandes, centrado.
export function FeaturedReplaceDialog({ newPetName, featuredPets, isSubmitting = false, onCancel, onReplace }: FeaturedReplaceDialogProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isSubmitting) onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel, isSubmitting]);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:p-4 z-[60]"
      onClick={() => !isSubmitting && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="featured-replace-title"
        className="bg-white w-full sm:max-w-md max-h-[85vh] flex flex-col rounded-t-[20px] sm:rounded-[20px] shadow-lg border border-[#D9D9D9]/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-[#D9D9D9]/50">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#20A83E]/10 shrink-0">
              <Star size={18} className="text-[#20A83E]" />
            </div>
            <div>
              <h2 id="featured-replace-title" className="text-[#222222] text-lg font-medium leading-snug">
                Ya hay {MAX_FEATURED_PETS} mascotas destacadas
              </h2>
              <p className="text-sm text-[#222222]/60 mt-1">
                ¿Deseas retirar alguna para destacar a <strong className="text-[#222222]">{newPetName || 'esta mascota'}</strong>?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-1 -m-1 text-[#222222]/50 hover:text-[#222222] cursor-pointer shrink-0"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        <fieldset className="p-3 sm:p-4 overflow-y-auto flex-1">
          <legend className="sr-only">Mascota destacada a retirar</legend>
          <div className="space-y-2">
            {featuredPets.map(pet => {
              const cover = pet.images.find(image => image.isCover) ?? pet.images[0];
              const isSelected = selectedId === pet.id;

              return (
                <label
                  key={pet.id}
                  className={`flex items-center gap-3 p-3 min-h-[56px] rounded-xl border cursor-pointer transition-colors duration-200 ${
                    isSelected ? 'border-[#20A83E] bg-[#20A83E]/[0.06]' : 'border-[#D9D9D9]/70 hover:bg-[#F8F8F8]'
                  }`}
                >
                  <input
                    type="radio"
                    name="featured-to-remove"
                    value={pet.id}
                    checked={isSelected}
                    onChange={() => setSelectedId(pet.id)}
                    disabled={isSubmitting}
                    className="appearance-none shrink-0 w-5 h-5 rounded-full border-2 border-[#D9D9D9] bg-white checked:border-[#20A83E] checked:border-[6px] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20A83E]/40 cursor-pointer"
                  />
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#F8F8F8] shrink-0">
                    {cover && <ImageWithFallback src={cover.imageUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-[#222222] truncate">{pet.name}</div>
                    <div className="text-xs text-[#222222]/50 truncate">
                      {pet.species} · {statusLabel(pet.status)}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="p-4 sm:p-5 border-t border-[#D9D9D9]/50 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:flex-1 min-h-[44px] px-4 rounded-xl border border-[#D9D9D9] text-[#222222] text-sm font-medium hover:bg-[#F8F8F8] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => selectedId !== null && onReplace(selectedId)}
            disabled={selectedId === null || isSubmitting}
            className="w-full sm:flex-1 min-h-[44px] px-4 rounded-xl bg-[#20A83E] text-white text-sm font-medium hover:bg-[#146B27] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : 'Reemplazar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
