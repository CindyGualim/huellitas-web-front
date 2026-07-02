import { useEffect, useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { PrimaryButton } from '../PrimaryButton';
import { createPet, updatePet, type Pet } from '../../data/pets';
import { SPECIES_OPTIONS, GENDER_OPTIONS, SIZE_OPTIONS, STATUS_OPTIONS } from '../../data/petCatalog';

interface PetFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pet?: Pet;
  onSaved: (pet: Pet) => void;
}

interface FormState {
  name: string;
  speciesId: string;
  breed: string;
  genderId: string;
  sizeId: string;
  statusId: string;
  estimatedBirthDate: string;
  weightLbs: string;
  temperament: string;
  traits: string;
  rescueStory: string;
  healthNotes: string;
  needs: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  speciesId: String(SPECIES_OPTIONS[0].id),
  breed: 'Mestizo',
  genderId: String(GENDER_OPTIONS[0].id),
  sizeId: String(SIZE_OPTIONS[1].id),
  statusId: String(STATUS_OPTIONS[0].id),
  estimatedBirthDate: '',
  weightLbs: '',
  temperament: '',
  traits: '',
  rescueStory: '',
  healthNotes: '',
  needs: '',
};

function petToForm(pet: Pet): FormState {
  return {
    name: pet.name,
    speciesId: String(pet.speciesId),
    breed: pet.breed,
    genderId: String(pet.genderId),
    sizeId: String(pet.sizeId),
    statusId: String(pet.statusId),
    estimatedBirthDate: pet.estimatedBirthDate ?? '',
    weightLbs: pet.weightLbs ? String(pet.weightLbs) : '',
    temperament: pet.temperament,
    traits: pet.traits.join(', '),
    rescueStory: pet.rescueStory,
    healthNotes: pet.health.join(', '),
    needs: pet.needs.join(', '),
  };
}

export function PetFormModal({ open, onOpenChange, pet, onSaved }: PetFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(pet ? petToForm(pet) : EMPTY_FORM);
      setPhoto(null);
      setError(null);
    }
  }, [open, pet]);

  const set = (key: keyof FormState) => (value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData();
    data.set('name', form.name);
    data.set('speciesId', form.speciesId);
    data.set('breed', form.breed);
    data.set('genderId', form.genderId);
    data.set('sizeId', form.sizeId);
    data.set('statusId', form.statusId);
    data.set('estimatedBirthDate', form.estimatedBirthDate);
    data.set('weightLbs', form.weightLbs);
    data.set('temperament', form.temperament);
    data.set('traits', form.traits);
    data.set('rescueStory', form.rescueStory);
    data.set('healthNotes', form.healthNotes);
    data.set('needs', form.needs);
    if (photo) data.set('photo', photo);

    try {
      const saved = pet ? await updatePet(pet.id, data) : await createPet(data);
      onSaved(saved);
      onOpenChange(false);
    } catch {
      setError('Algo salió mal guardando la mascota. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{pet ? `Editar a ${pet.name}` : 'Agregar mascota'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pet-name">Nombre</Label>
              <Input id="pet-name" value={form.name} onChange={e => set('name')(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label>Foto</Label>
              <Input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] ?? null)} />
            </div>

            <div className="space-y-1.5">
              <Label>Especie</Label>
              <Select value={form.speciesId} onValueChange={set('speciesId')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SPECIES_OPTIONS.map(o => (
                    <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pet-breed">Raza</Label>
              <Input id="pet-breed" value={form.breed} onChange={e => set('breed')(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Género</Label>
              <Select value={form.genderId} onValueChange={set('genderId')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map(o => (
                    <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Tamaño</Label>
              <Select value={form.sizeId} onValueChange={set('sizeId')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map(o => (
                    <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={form.statusId} onValueChange={set('statusId')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(o => (
                    <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pet-birth">Fecha de nacimiento estimada</Label>
              <Input id="pet-birth" type="date" value={form.estimatedBirthDate} onChange={e => set('estimatedBirthDate')(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pet-weight">Peso (libras)</Label>
              <Input id="pet-weight" type="number" min="0" step="0.1" value={form.weightLbs} onChange={e => set('weightLbs')(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pet-temperament">Temperamento</Label>
            <Textarea id="pet-temperament" value={form.temperament} onChange={e => set('temperament')(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pet-traits">Rasgos (separados por coma)</Label>
            <Input id="pet-traits" value={form.traits} onChange={e => set('traits')(e.target.value)} placeholder="Noble, Guerrero, Leal" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pet-story">Historia de rescate</Label>
            <Textarea id="pet-story" value={form.rescueStory} onChange={e => set('rescueStory')(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pet-health">Información médica (separada por coma)</Label>
            <Input id="pet-health" value={form.healthNotes} onChange={e => set('healthNotes')(e.target.value)} placeholder="Vacunado, Desparasitado, Esterilizado" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pet-needs">Necesidades (separadas por coma)</Label>
            <Input id="pet-needs" value={form.needs} onChange={e => set('needs')(e.target.value)} placeholder="Concentrado, Hogar temporal" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <PrimaryButton type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancelar
            </PrimaryButton>
            <PrimaryButton type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </PrimaryButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
