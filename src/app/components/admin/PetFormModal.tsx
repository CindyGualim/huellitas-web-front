import { useState, FormEvent } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { ApiPet, PetPayload } from '../../lib/api';
import { SPECIES_OPTIONS, GENDER_OPTIONS, SIZE_OPTIONS, STATUS_OPTIONS } from '../../lib/petMappings';

interface PetFormModalProps {
  mode: 'create' | 'edit';
  initialData?: ApiPet;
  onSubmit: (payload: PetPayload) => Promise<void>;
  onClose: () => void;
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
    featured: pet?.featured ?? false
  };
}

export function PetFormModal({ mode, initialData, onSubmit, onClose }: PetFormModalProps) {
  const [formData, setFormData] = useState(toFormState(initialData));
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images?.length ? initialData.images.map(image => image.imageUrl) : ['']
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const images = imageUrls
      .map(url => url.trim())
      .filter(Boolean)
      .map((imageUrl, index) => ({ imageUrl, isCover: index === 0 }));

    try {
      await onSubmit({
        ...formData,
        weight: Number(formData.weight),
        images
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la mascota');
    } finally {
      setIsSubmitting(false);
    }
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
              <input name="weight" type="number" step="0.1" min="0" required value={formData.weight} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Color {required}</label>
              <input name="color" required value={formData.color} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Estado {required}</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
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

          <label className="flex items-center gap-2 text-sm text-[#222222]">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="accent-[#20A83E]" />
            Destacar en la página principal
          </label>

          <div>
            <label className={labelClass}>Imágenes (URL) <span className="text-[#222222]/40 font-normal">(opcional)</span></label>
            <div className="space-y-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={url}
                    onChange={e => handleImageUrlChange(index, e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
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
            <PrimaryButton type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
