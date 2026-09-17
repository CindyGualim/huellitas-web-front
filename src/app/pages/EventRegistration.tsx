import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { apiGetEvent, apiCreateEventRegistration, ApiEvent } from '../lib/api';
import { todayDateInputValue } from '../lib/dateUtils';

const MIN_AGE_MONTHS = 5;
const MAX_AGE_MONTHS = 6 * 12;
const MAX_DEWORMING_AGE_MONTHS = 5;
const MAX_VACCINATION_AGE_MONTHS = 12;

function monthsBetween(from: Date, to: Date) {
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  return months;
}

function birthDateFromAge(years: number, months: number) {
  const today = new Date();
  const result = new Date(today.getFullYear() - years, today.getMonth() - months, today.getDate());
  return result.toISOString().slice(0, 10);
}

export function EventRegistration() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    ownerName: '', phone: '', email: '',
    petName: '', species: 'Perro', gender: 'Macho', breed: '',
    ageYears: '', ageMonths: '',
    lastDewormingDate: '', lastVaccinationDate: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const id = Number(eventId);

    if (!id) {
      setIsLoading(false);
      return;
    }

    apiGetEvent(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setIsLoading(false));
  }, [eventId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center text-[#222222]/50">Cargando...</div>
      </Layout>
    );
  }

  if (!event || event.type !== 'Jornada_castracion') {
    return (
      <Layout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <p className="text-[#222222] mb-4">Evento no encontrado o no requiere inscripción.</p>
          <PrimaryButton onClick={() => navigate('/events')}>Volver a Eventos</PrimaryButton>
        </div>
      </Layout>
    );
  }

  const eventDate = new Date(event.startDate);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateClinicalDates = (): string | null => {
    const years = Number(formData.ageYears) || 0;
    const months = Number(formData.ageMonths) || 0;
    const birthDate = new Date(birthDateFromAge(years, months));
    const ageAtEvent = monthsBetween(birthDate, eventDate);

    if (ageAtEvent < MIN_AGE_MONTHS) {
      return `La mascota es muy joven para esta jornada (edad mínima: ${MIN_AGE_MONTHS} meses)`;
    }
    if (ageAtEvent > MAX_AGE_MONTHS) {
      return `La mascota supera la edad máxima para esta jornada (máximo: ${MAX_AGE_MONTHS / 12} años)`;
    }

    if (formData.lastDewormingDate) {
      const dewormingAge = monthsBetween(new Date(formData.lastDewormingDate), eventDate);
      if (dewormingAge > MAX_DEWORMING_AGE_MONTHS) {
        return `La desparasitación debe tener menos de ${MAX_DEWORMING_AGE_MONTHS} meses a la fecha de la jornada`;
      }
    }

    if (formData.lastVaccinationDate) {
      const vaccinationAge = monthsBetween(new Date(formData.lastVaccinationDate), eventDate);
      if (vaccinationAge > MAX_VACCINATION_AGE_MONTHS) {
        return `La vacunación debe tener menos de ${MAX_VACCINATION_AGE_MONTHS} meses a la fecha de la jornada`;
      }
    }

    return null;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clinicalError = validateClinicalDates();
    if (clinicalError) {
      setError(clinicalError);
      return;
    }

    if (!selectedTimeSlotId) {
      setError('Seleccioná un horario');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiCreateEventRegistration({
        eventId: event.id,
        timeSlotId: selectedTimeSlotId,
        petName: formData.petName,
        species: formData.species,
        gender: formData.gender,
        breed: formData.breed,
        birthDate: birthDateFromAge(Number(formData.ageYears) || 0, Number(formData.ageMonths) || 0),
        lastDewormingDate: formData.lastDewormingDate,
        lastVaccinationDate: formData.lastVaccinationDate,
        ownerName: formData.ownerName,
        ownerPhone: formData.phone,
        ownerEmail: formData.email,
        procedureType: 'Castracion'
      });
      navigate('/castration/confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la inscripción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (step / 2) * 100;
  const inputClass = "w-full px-5 py-4 bg-[#F8F8F8] rounded-[14px] text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#20A83E]/50 border border-[#D9D9D9] transition-all duration-250 hover:border-[#20A83E]/50";
  const labelClass = "block text-[#222222] mb-2 font-medium text-sm";
  const required = <span className="text-red-500">*</span>;

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-4 md:px-8 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <button onClick={() => navigate('/events')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-250">
              <ArrowLeft size={16} />
              <span className="text-sm">Volver a eventos</span>
            </button>
          </div>
        </div>

        <div className="bg-[#146B27] px-6 pb-8 pt-4">
          <div className="mx-auto max-w-3xl">
            <span className="bg-[#20A83E] text-white px-3 py-1 rounded-full text-xs font-medium mb-2 inline-block">Inscripción</span>
            <h1 className="text-white text-2xl md:text-3xl mb-2 font-bold">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{eventDate.toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-8 pb-16 -mt-6 relative z-10">
          <div className="bg-white rounded-[20px] shadow-lg border border-[#D9D9D9]/50 p-5 md:p-8">
            <div className="mb-8">
              <p className="text-[#222222]/60 text-sm mb-3">Paso {step} de 2</p>
              <div className="bg-[#D9D9D9]/30 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#20A83E] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {step === 1 && (
              <div>
                <h2 className="text-[#222222] mb-6 text-2xl font-bold">Selecciona tu horario</h2>
                {event.timeSlots.length === 0 ? (
                  <p className="text-[#222222]/50 text-sm mb-8 bg-[#F8F8F8] border border-[#D9D9D9]/50 rounded-xl p-4">
                    Todavía no hay horarios configurados para esta jornada. Volvé a intentarlo más tarde.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {event.timeSlots.map(slot => {
                      const isFull = slot.available <= 0;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => !isFull && setSelectedTimeSlotId(slot.id)}
                          disabled={isFull}
                          className={`p-4 rounded-[16px] transition-all duration-250 min-h-[80px] font-medium border transform hover:-translate-y-0.5 ${
                            selectedTimeSlotId === slot.id
                              ? 'bg-[#20A83E] text-white border-[#20A83E] shadow-md'
                              : isFull
                              ? 'bg-[#F8F8F8] text-[#222222]/30 cursor-not-allowed border-[#D9D9D9]/40'
                              : 'bg-white hover:bg-[#F8F8F8] text-[#222222] border-[#D9D9D9]'
                          }`}
                        >
                          {slot.startTime}
                          <div className="text-xs mt-1 opacity-70">{isFull ? 'Sin cupo' : `${slot.available} cupos`}</div>
                          {selectedTimeSlotId === slot.id && <CheckCircle size={18} className="mx-auto mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="text-[#222222]/50 text-sm mb-8 bg-[#F8F8F8] border border-[#D9D9D9]/50 rounded-xl p-4 flex items-center gap-2">
                  <span className="text-[#20A83E]">ℹ</span> Si un horario ya no tiene cupo, tu inscripción será rechazada al enviarla.
                </p>
                <div className="flex gap-3">
                  <PrimaryButton variant="primary" onClick={() => setStep(2)} disabled={!selectedTimeSlotId} fullWidth className="py-4">
                    Continuar a datos
                  </PrimaryButton>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-[#222222] mb-6 text-2xl font-bold">Ingresa los datos del paciente</h2>

                {error && (
                  <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <p className="text-xs text-[#222222]/50 mb-5">
                  <span className="text-red-500">*</span> Campos obligatorios
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="border-b border-[#D9D9D9]/50 pb-5">
                    <h3 className="text-[#222222] font-medium mb-3 text-sm">Datos del propietario</h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="ownerName" className={labelClass}>Nombre completo {required}</label>
                        <input type="text" id="ownerName" name="ownerName" required value={formData.ownerName} onChange={handleFormChange} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelClass}>Número de teléfono {required}</label>
                        <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleFormChange} className={inputClass} />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="email" className={labelClass}>Correo electrónico {required}</label>
                        <input type="email" id="email" name="email" required value={formData.email} onChange={handleFormChange} className={inputClass} />
                        <p className="text-xs text-[#222222]/40 mt-1">Te enviaremos recordatorios antes y después de la jornada.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-[#D9D9D9]/50 pb-5">
                    <h3 className="text-[#222222] font-medium mb-3 text-sm">Datos de la mascota</h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="petName" className={labelClass}>Nombre {required}</label>
                        <input type="text" id="petName" name="petName" required value={formData.petName} onChange={handleFormChange} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="breed" className={labelClass}>Raza {required}</label>
                        <input type="text" id="breed" name="breed" required value={formData.breed} onChange={handleFormChange} placeholder="ej: Mestizo" className={inputClass} />
                        <p className="text-xs text-[#222222]/40 mt-1">Importante en perros: algunas razas braquicéfalas requieren consideraciones anestésicas especiales.</p>
                      </div>

                      <div>
                        <label className={labelClass}>Especie {required}</label>
                        <div className="flex gap-3">
                          {['Perro', 'Gato'].map(s => (
                            <button
                              key={s} type="button"
                              onClick={() => setFormData({ ...formData, species: s })}
                              className={`flex-1 py-3 rounded-[14px] transition-all duration-250 font-medium border text-sm ${
                                formData.species === s ? 'bg-[#20A83E]/10 text-[#20A83E] border-[#20A83E]' : 'bg-white text-[#222222] border-[#D9D9D9] hover:border-[#20A83E]/50'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Sexo {required}</label>
                        <div className="flex gap-3">
                          {['Macho', 'Hembra'].map(g => (
                            <button
                              key={g} type="button"
                              onClick={() => setFormData({ ...formData, gender: g })}
                              className={`flex-1 py-3 rounded-[14px] transition-all duration-250 font-medium border text-sm ${
                                formData.gender === g ? 'bg-[#20A83E]/10 text-[#20A83E] border-[#20A83E]' : 'bg-white text-[#222222] border-[#D9D9D9] hover:border-[#20A83E]/50'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelClass}>Edad aproximada {required}</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input type="number" min="0" max="20" name="ageYears" required placeholder="Años" value={formData.ageYears} onChange={handleFormChange} className={inputClass} />
                          </div>
                          <div>
                            <input type="number" min="0" max="11" name="ageMonths" required placeholder="Meses" value={formData.ageMonths} onChange={handleFormChange} className={inputClass} />
                          </div>
                        </div>
                        <p className="text-xs text-[#222222]/40 mt-1">Se acepta entre 5 meses y 6 años a la fecha de la jornada.</p>
                      </div>

                      <div>
                        <label htmlFor="lastDewormingDate" className={labelClass}>Última desparasitación {required}</label>
                        <input
                          type="date" id="lastDewormingDate" name="lastDewormingDate" required
                          max={todayDateInputValue()}
                          value={formData.lastDewormingDate} onChange={handleFormChange} className={inputClass}
                        />
                      </div>

                      <div>
                        <label htmlFor="lastVaccinationDate" className={labelClass}>Última vacunación {required}</label>
                        <input
                          type="date" id="lastVaccinationDate" name="lastVaccinationDate" required
                          max={todayDateInputValue()}
                          value={formData.lastVaccinationDate} onChange={handleFormChange} className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <PrimaryButton type="button" variant="ghost" onClick={() => setStep(1)} className="px-8">Atrás</PrimaryButton>
                    <PrimaryButton type="submit" variant="primary" fullWidth className="py-4" disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando...' : 'Confirmar inscripción'}
                    </PrimaryButton>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
