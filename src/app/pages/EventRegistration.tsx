import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { events } from '../data/events';

const timeSlots = [
  { time: '8:00 AM', available: true },
  { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '12:00 PM', available: false },
  { time: '1:00 PM', available: true },
  { time: '2:00 PM', available: true },
  { time: '3:00 PM', available: true }
];

export function EventRegistration() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = events.find(e => e.id === eventId);
  
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ownerName: '', phone: '', petName: '', species: 'Perro', age: '' });

  if (!event || event.category !== 'Jornadas de Castración') {
    return (
      <Layout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <p className="text-[#222222] mb-4">Evento no encontrado o no requiere inscripción.</p>
          <PrimaryButton onClick={() => navigate('/events')}>Volver a Eventos</PrimaryButton>
        </div>
      </Layout>
    );
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/castration/confirmation';
  };

  const progressPercentage = (step / 2) * 100;
  const inputClass = "w-full px-5 py-4 bg-[#F8F8F8] rounded-[14px] text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#20A83E]/50 border border-[#D9D9D9] transition-all duration-250 hover:border-[#20A83E]/50";

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-4 md:px-8 py-5">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <button onClick={() => navigate('/events')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-250">
              <ArrowLeft size={18} />
              <span className="text-sm">Volver a eventos</span>
            </button>
          </div>
        </div>
        
        <div className="bg-[#146B27] px-6 pb-12 pt-6">
          <div className="mx-auto max-w-3xl">
            <span className="bg-[#20A83E] text-white px-3 py-1 rounded-full text-xs font-medium mb-3 inline-block">Inscripción</span>
            <h1 className="text-white text-3xl md:text-4xl mb-3 font-bold">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{event.municipality}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{event.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10 pb-20 -mt-8 relative z-10">
          <div className="bg-white rounded-[24px] shadow-lg border border-[#D9D9D9]/50 p-6 md:p-10">
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {timeSlots.map(slot => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-4 rounded-[16px] transition-all duration-250 min-h-[80px] font-medium border transform hover:-translate-y-0.5 ${
                        selectedTime === slot.time
                          ? 'bg-[#20A83E] text-white border-[#20A83E] shadow-md'
                          : slot.available
                          ? 'bg-white hover:bg-[#F8F8F8] text-[#222222] border-[#D9D9D9]'
                          : 'bg-[#F8F8F8] text-[#222222]/30 cursor-not-allowed border-[#D9D9D9]/40'
                      }`}
                    >
                      {slot.time}
                      {selectedTime === slot.time && <CheckCircle size={18} className="mx-auto mt-1" />}
                    </button>
                  ))}
                </div>
                <p className="text-[#222222]/50 text-sm mb-8 bg-[#F8F8F8] border border-[#D9D9D9]/50 rounded-xl p-4 flex items-center gap-2">
                  <span className="text-[#20A83E]">ℹ</span> Los cupos se bloquean automáticamente al llenarse
                </p>
                <div className="flex gap-3">
                  <PrimaryButton variant="primary" onClick={() => setStep(2)} disabled={!selectedTime} fullWidth className="py-4">
                    Continuar a datos
                  </PrimaryButton>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-[#222222] mb-6 text-2xl font-bold">Ingresa los datos del paciente</h2>
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { id: 'ownerName', label: 'Nombre completo del dueño', type: 'text' },
                      { id: 'phone', label: 'Número de teléfono', type: 'tel' },
                    ].map(field => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className="block text-[#222222] mb-2 font-medium text-sm">{field.label}</label>
                        <input
                          type={field.type} id={field.id} name={field.id} required
                          value={formData[field.id as keyof typeof formData]}
                          onChange={handleFormChange}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-[#D9D9D9]/50 pt-5 mt-2">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="petName" className="block text-[#222222] mb-2 font-medium text-sm">Nombre de la mascota</label>
                        <input
                          type="text" id="petName" name="petName" required
                          value={formData.petName}
                          onChange={handleFormChange}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label htmlFor="age" className="block text-[#222222] mb-2 font-medium text-sm">Edad aproximada</label>
                        <input
                          type="text" id="age" name="age" required
                          value={formData.age} onChange={handleFormChange}
                          placeholder="ej: 2 años" className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#222222] mb-2 font-medium text-sm">Especie</label>
                    <div className="flex gap-3">
                      {['Perro', 'Gato'].map(s => (
                        <button
                          key={s} type="button"
                          onClick={() => setFormData({ ...formData, species: s })}
                          className={`flex-1 py-3.5 rounded-[14px] transition-all duration-250 font-medium border ${
                            formData.species === s
                              ? 'bg-[#20A83E]/10 text-[#20A83E] border-[#20A83E]'
                              : 'bg-white text-[#222222] border-[#D9D9D9] hover:border-[#20A83E]/50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 mt-4">
                    <PrimaryButton type="button" variant="ghost" onClick={() => setStep(1)} className="px-8">Atrás</PrimaryButton>
                    <PrimaryButton type="submit" variant="primary" fullWidth className="py-4">Confirmar inscripción</PrimaryButton>
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