import { useState, useEffect, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { apiGetPet, apiCreateAdoptionRequest, ApiPet } from '../lib/api';

const inputClass = "w-full px-5 py-4 bg-[#F8F8F8] rounded-[12px] text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 hover:border-[#20A83E]/50";
const labelClass = "block text-[#222222] mb-2 font-medium text-sm";
const required = <span className="text-red-500">*</span>;

const YES_NO_QUESTIONS: { key: 'hasChildren' | 'familyAgreement' | 'hasVeterinarian' | 'secureSpace'; question: string }[] = [
  { key: 'hasChildren', question: '¿Hay niños en el hogar?' },
  { key: 'familyAgreement', question: '¿Todas las personas en tu hogar están de acuerdo con la adopción?' },
  { key: 'hasVeterinarian', question: '¿Contás con un veterinario de confianza?' },
  { key: 'secureSpace', question: '¿Tenés un espacio seguro para la mascota (patio cercado, sin riesgos de fuga)?' }
];

export function AdoptionRequest() {
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<ApiPet | null>(null);
  const [isLoadingPet, setIsLoadingPet] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', dpi: '', phone: '', email: '', address: '', municipality: '', reason: ''
  });
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({
    hasChildren: null, familyAgreement: null, hasVeterinarian: null, secureSpace: null
  });

  useEffect(() => {
    const id = Number(petId);

    if (!id) {
      setIsLoadingPet(false);
      return;
    }

    apiGetPet(id)
      .then(setPet)
      .catch(() => setPet(null))
      .finally(() => setIsLoadingPet(false));
  }, [petId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const unanswered = YES_NO_QUESTIONS.find(q => answers[q.key] === null);
    if (unanswered) {
      setError('Respondé todas las preguntas antes de enviar la solicitud');
      return;
    }

    if (!pet) return;
    setIsSubmitting(true);

    try {
      await apiCreateAdoptionRequest({
        ...formData,
        petId: pet.id,
        hasChildren: Boolean(answers.hasChildren),
        familyAgreement: Boolean(answers.familyAgreement),
        hasVeterinarian: Boolean(answers.hasVeterinarian),
        secureSpace: Boolean(answers.secureSpace)
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingPet) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center text-[#222222]/50">Cargando...</div>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
          <p className="text-[#222222] mb-4">No encontramos esta mascota.</p>
          <Link to="/adoptions">
            <PrimaryButton variant="primary">Ver mascotas disponibles</PrimaryButton>
          </Link>
        </div>
      </Layout>
    );
  }

  if (pet.status !== 'Disponible') {
    return (
      <Layout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
          <p className="text-[#222222] mb-4">{pet.name} ya no está disponible para adopción.</p>
          <Link to="/adoptions">
            <PrimaryButton variant="primary">Ver otras mascotas</PrimaryButton>
          </Link>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-20">
          <div className="bg-white rounded-[20px] p-12 text-center shadow-sm border border-[#D9D9D9]/50">
            <div className="flex justify-center mb-6">
              <div className="bg-[#20A83E]/10 p-6 rounded-full">
                <CheckCircle size={56} className="text-[#20A83E]" />
              </div>
            </div>
            <h1 className="text-[#222222] mb-4 text-3xl">¡Solicitud enviada!</h1>
            <p className="text-[#222222]/60 mb-8 max-w-md mx-auto leading-relaxed">
              Hemos recibido tu solicitud para adoptar a {pet.name}. Nos pondremos en contacto contigo
              en las próximas 48 horas para coordinar una visita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Link to="/adoptions" className="flex-1">
                <PrimaryButton variant="primary" fullWidth>Ver más perritos</PrimaryButton>
              </Link>
              <Link to="/home" className="flex-1">
                <PrimaryButton variant="ghost" fullWidth>Volver al inicio</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-6 py-8">
          <div className="mx-auto max-w-2xl">
            <Link to={`/adoptions/pet-profile/${pet.id}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-250 mb-3">
              <ArrowLeft size={16} />
              <span className="text-sm">Volver</span>
            </Link>
            <h1 className="text-white text-2xl font-bold">Solicitud de adopción de {pet.name}</h1>
            <p className="text-white/60 text-sm mt-1">Completa la información a continuación</p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-8 pb-16">
          <div className="bg-white rounded-[18px] p-6 md:p-8 shadow-sm border border-[#D9D9D9]/50">
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <p className="text-xs text-[#222222]/50 mb-6">
              <span className="text-red-500">*</span> Campos obligatorios
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className={labelClass}>Nombre completo {required}</label>
                <input type="text" id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} className={inputClass} placeholder="Ingresa tu nombre completo" />
              </div>

              <div>
                <label htmlFor="dpi" className={labelClass}>DPI {required}</label>
                <input type="text" id="dpi" name="dpi" required value={formData.dpi} onChange={handleChange} className={inputClass} placeholder="Número de tu DPI" />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className={labelClass}>Número de teléfono {required}</label>
                  <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+502 1234-5678" />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>Correo electrónico {required}</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="tucorreo@ejemplo.com" />
                </div>
              </div>

              <div>
                <label htmlFor="address" className={labelClass}>Dirección {required}</label>
                <input type="text" id="address" name="address" required value={formData.address} onChange={handleChange} className={inputClass} placeholder="Dirección completa" />
              </div>

              <div>
                <label htmlFor="municipality" className={labelClass}>Municipio {required}</label>
                <input type="text" id="municipality" name="municipality" required value={formData.municipality} onChange={handleChange} className={inputClass} placeholder="Ciudad de Guatemala" />
              </div>

              <div>
                <label htmlFor="reason" className={labelClass}>¿Por qué quieres adoptar a {pet.name}? {required}</label>
                <textarea
                  id="reason" name="reason" required
                  value={formData.reason} onChange={handleChange}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Cuéntanos por qué quieres darle un hogar a este perrito..."
                />
              </div>

              <div className="border-t border-[#D9D9D9]/50 pt-6 space-y-5">
                {YES_NO_QUESTIONS.map(q => (
                  <div key={q.key}>
                    <p className={labelClass}>{q.question} {required}</p>
                    <div className="flex gap-3">
                      {[{ label: 'Sí', value: true }, { label: 'No', value: false }].map(option => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [q.key]: option.value })}
                          className={`flex-1 py-3 rounded-[12px] transition-all duration-250 font-medium border cursor-pointer ${
                            answers[q.key] === option.value
                              ? 'bg-[#20A83E]/10 text-[#20A83E] border-[#20A83E]'
                              : 'bg-white text-[#222222] border-[#D9D9D9] hover:border-[#20A83E]/50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <PrimaryButton type="submit" variant="primary" fullWidth disabled={isSubmitting} className="mt-4">
                {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
