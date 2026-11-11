import { useState, FormEvent } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { ApiPet, PetPayload, apiUploadImage, apiGetPets, ApiRequestError, MAX_FEATURED_PETS } from '../../lib/api';
import { FeaturedReplaceDialog } from './FeaturedReplaceDialog';
import { SPECIES_OPTIONS, GENDER_OPTIONS, SIZE_OPTIONS, STATUS_OPTIONS, INITIAL_PET_STATUSES, nextValidStatuses } from '../../lib/petMappings';
import { todayDateInputValue } from '../../lib/dateUtils';
import { useAuth } from '../../context/AuthContext';

interface PetFormModalProps {
  mode: 'create' | 'edit';
  initialData?: ApiPet;
  // Al crear se envía la ficha completa; al editar, solo los campos que cambiaron.
  onSubmit: (payload: Partial<PetPayload>) => Promise<void>;
  onClose: () => void;
}

// La portada primero: si las fotos llegan en otro orden, editar no debe cambiar la portada.
function initialImageUrls(pet?: ApiPet) {
  if (!pet?.images?.length) return [''];
  return [...pet.images]
    .sort((a, b) => Number(Boolean(b.isCover)) - Number(Boolean(a.isCover)) || a.id - b.id)
    .map(image => image.imageUrl);
}

function toImagesPayload(urls: string[]) {
  return urls
    .map(url => url.trim())
    .filter(Boolean)
    .map((imageUrl, index) => ({ imageUrl, isCover: index === 0 }));
}

function toFormState(pet?: ApiPet) {
  return {
    name: pet?.name ?? '',
    species: pet?.species ?? SPECIES_OPTIONS[0].value,
    breed: pet?.breed ?? '',
    gender: pet?.gender ?? GENDER_OPTIONS[0].value,
    estimatedAge: pet?.estimatedAge ?? '',
    size: pet?.size ?? SIZE_OPTIONS[0].value,
    weight: pet?.weight?.toString() ?? '',
    color: pet?.color ?? '',
    description: pet?.description ?? '',
    rescueStory: pet?.rescueStory ?? '',
    status: pet?.status ?? STATUS_OPTIONS[0].value,
    intakeDate: pet?.intakeDate ? pet.intakeDate.slice(0, 10) : todayDateInputValue(),
    featured: pet?.featured ?? false
  };
}

export function PetFormModal({ mode, initialData, onSubmit, onClose }: PetFormModalProps) {
  const { token } = useAuth();
  const [formData, setFormData] = useState(toFormState(initialData));
  const [imageUrls, setImageUrls] = useState<string[]>(() => initialImageUrls(initialData));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  // Aviso de "ya hay 4 destacadas": guarda el formulario pendiente hasta que se elija qué retirar.
  const [replaceState, setReplaceState] = useState<{ payload: Partial<PetPayload>; candidates: ApiPet[] } | null>(null);

  const inputClass = "w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 text-sm";
  const labelClass = "block text-[#222222] mb-1.5 font-medium text-sm";
  const required = <span className="text-red-500">*</span>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setImageUrls(imageUrls.map((url, i) => (i === index ? value : url)));
  };

  const addImageUrlField = () => setImageUrls([...imageUrls, '']);
  const removeImageUrlField = (index: number) => setImageUrls(imageUrls.filter((_, i) => i !== index));

  const handleFileUpload = async (index: number, file: File | undefined) => {
    if (!file || !token) return;

    setError(null);
    setUploadingIndex(index);

    try {
      const { imageUrl } = await apiUploadImage(token, file);
      handleImageUrlChange(index, imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen');
    } finally {
      setUploadingIndex(null);
    }
  };

  // Mascotas destacadas actuales, sin contar la que se está editando.
  const loadOtherFeatured = async () => {
    const { items } = await apiGetPets({ featured: true, limit: 100 });
    return items.filter(pet => pet.id !== initialData?.id);
  };

  const save = async (payload: Partial<PetPayload>) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(payload);
      setReplaceState(null);
      onClose();
    } catch (err) {
      // Otro admin pudo destacar una mascota mientras tanto: se vuelve a ofrecer el reemplazo.
      if (err instanceof ApiRequestError && err.code === 'FEATURED_LIMIT') {
        const candidates = await loadOtherFeatured().catch(() => []);
        if (candidates.length > 0) {
          setReplaceState({ payload: { ...payload, replaceFeaturedPetId: undefined }, candidates });
          return;
        }
      }
      setReplaceState(null);
      setError(err instanceof Error ? err.message : 'No se pudo guardar la mascota');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const images = toImagesPayload(imageUrls);
    let payload: Partial<PetPayload> = {
      ...formData,
      weight: Number(formData.weight),
      images
    };

    if (mode === 'edit' && initialData) {
      // Solo lo que cambió: si otra persona cambió el estado o "destacada" mientras este formulario
      // estaba abierto, corregir un dato no debe revertir su cambio.
      const initial = toFormState(initialData);
      const changed: Record<string, unknown> = {};
      for (const key of Object.keys(initial) as (keyof typeof initial)[]) {
        if (formData[key] !== initial[key]) {
          changed[key] = key === 'weight' ? Number(formData.weight) : formData[key];
        }
      }
      if (JSON.stringify(images) !== JSON.stringify(toImagesPayload(initialImageUrls(initialData)))) {
        changed.images = images;
      }
      if (Object.keys(changed).length === 0) {
        onClose();
        return;
      }
      payload = changed as Partial<PetPayload>;
    }

    const becomesFeatured = formData.featured && !initialData?.featured;

    if (becomesFeatured) {
      setError(null);
      setIsSubmitting(true);
      try {
        const others = await loadOtherFeatured();
        if (others.length >= MAX_FEATURED_PETS) {
          setReplaceState({ payload, candidates: others });
          setIsSubmitting(false);
          return;
        }
      } catch {
        // Si no se pudo consultar, el backend igual valida el máximo al guardar.
      }
    }

    await save(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg border border-[#D9D9D9]/50">
        <div className="flex items-center justify-between p-6 border-b border-[#D9D9D9]/50 sticky top-0 bg-white">
          <h2 className="text-[#222222] text-xl font-medium">
            {mode === 'create' ? 'Agregar mascota' : `Editar a ${initialData?.name}`}
          </h2>
          <button type="button" onClick={onClose} className="text-[#222222]/50 hover:text-[#222222] cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <p className="text-xs text-[#222222]/50">
            <span className="text-red-500">*</span> Campos obligatorios
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Nombre {required}</label>
              <input name="name" required value={formData.name} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Especie {required}</label>
              <select name="species" value={formData.species} onChange={handleChange} className={inputClass}>
                {SPECIES_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Raza {required}</label>
              <input name="breed" required value={formData.breed} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Género {required}</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                {GENDER_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Edad estimada {required}</label>
              <input name="estimatedAge" required placeholder="Ej. 2 años" value={formData.estimatedAge} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Tamaño {required}</label>
              <select name="size" value={formData.size} onChange={handleChange} className={inputClass}>
                {SIZE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Peso (kg) {required}</label>
              <input name="weight" type="number" step="0.01" min="0.01" max="999.99" required value={formData.weight} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Color {required}</label>
              <input name="color" required value={formData.color} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Estado {required}</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                {STATUS_OPTIONS.filter(option =>
                  // Al crear solo se permiten estados iniciales; al editar, el actual y sus transiciones válidas.
                  mode === 'create'
                    ? INITIAL_PET_STATUSES.includes(option.value)
                    : option.value === initialData?.status || nextValidStatuses(initialData?.status ?? '').includes(option.value)
                ).map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Fecha de ingreso al refugio {required}</label>
              <input
                name="intakeDate"
                type="date"
                required
                max={todayDateInputValue()}
                value={formData.intakeDate}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-xs text-[#222222]/40 mt-1">Usá la fecha real en que la mascota llegó al refugio, aunque la estés registrando después.</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Descripción {required}</label>
            <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Historia de rescate {required}</label>
            <textarea name="rescueStory" required rows={3} value={formData.rescueStory} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={`flex items-center gap-2 text-sm text-[#222222] ${formData.status === 'Adoptada' ? 'opacity-50' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured && formData.status !== 'Adoptada'}
                disabled={formData.status === 'Adoptada'}
                onChange={handleChange}
                className="accent-[#20A83E] w-4 h-4"
              />
              Destacar en la página principal
            </label>
            <p className="text-xs text-[#222222]/50 mt-1 ml-6">
              {formData.status === 'Adoptada'
                ? 'Las mascotas adoptadas no se destacan.'
                : `Máximo ${MAX_FEATURED_PETS}. Al aprobarse su adopción deja de estar destacada automáticamente.`}
            </p>
          </div>

          <div>
            <label className={labelClass}>Imágenes <span className="text-[#222222]/40 font-normal">(opcional, la primera es la portada)</span></label>
            <div className="space-y-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={url}
                    onChange={e => handleImageUrlChange(index, e.target.value)}
                    placeholder="https://... o subí un archivo"
                    className={inputClass}
                  />
                  <label className="px-3 flex items-center rounded-xl border border-[#D9D9D9] text-[#222222]/50 hover:text-[#20A83E] hover:border-[#20A83E]/50 transition-colors cursor-pointer">
                    {uploadingIndex === index ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <Upload size={16} />
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={uploadingIndex !== null}
                      onChange={e => handleFileUpload(index, e.target.files?.[0])}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeImageUrlField(index)}
                    className="px-3 rounded-xl border border-[#D9D9D9] text-[#222222]/50 hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addImageUrlField}
              className="mt-2 flex items-center gap-1.5 text-[#20A83E] text-sm font-medium hover:text-[#146B27] transition-colors cursor-pointer"
            >
              <Plus size={16} /> Agregar imagen
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <PrimaryButton type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancelar
            </PrimaryButton>
            <PrimaryButton type="submit" variant="primary" disabled={isSubmitting || uploadingIndex !== null} className="flex-1">
              {isSubmitting ? 'Guardando...' : uploadingIndex !== null ? 'Subiendo imagen...' : 'Guardar'}
            </PrimaryButton>
          </div>
        </form>
      </div>

      {replaceState && (
        <FeaturedReplaceDialog
          newPetName={formData.name}
          featuredPets={replaceState.candidates}
          isSubmitting={isSubmitting}
          onCancel={() => setReplaceState(null)}
          onReplace={petIdToRemove => save({ ...replaceState.payload, replaceFeaturedPetId: petIdToRemove })}
        />
      )}
    </div>
  );
}
