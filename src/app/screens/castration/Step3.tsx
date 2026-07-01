import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { PrimaryButton } from '../../components/PrimaryButton';

export function CastrationStep3() {
  const navigate = useNavigate();
  const [municipality, setMunicipality] = useState<any>(null);
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    petName: '',
    species: 'Perro',
    age: ''
  });

  useEffect(() => {
    const savedMunicipality = sessionStorage.getItem('castration_municipality');
    const savedTime = sessionStorage.getItem('castration_time');

    if (!savedMunicipality || !savedTime) {
      navigate('/castration/step-1');
    } else {
      setMunicipality(JSON.parse(savedMunicipality));
    }
  }, [navigate]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('castration_form', JSON.stringify(formData));
    navigate('/castration/confirmation');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 pb-16">
        <Link to="/castration/step-2" className="flex items-center gap-2 text-[#178C2E] mb-8 hover:text-[#136e24]">
          <ArrowLeft size={20} />
          <span className="font-medium">Volver</span>
        </Link>

        <div className="mb-10">
          <h1 className="text-[#4A2E1F] mb-2 text-3xl">Paso 3 de 3</h1>
          <p className="text-[#4A2E1F]/70">Completa tus datos</p>
        </div>

        <div className="bg-[#E7D7B1]/30 rounded-full h-2 mb-10 overflow-hidden">
          <div className="bg-[#178C2E] h-full w-full transition-all duration-300 rounded-full" />
        </div>

        <h2 className="text-[#4A2E1F] mb-6 text-2xl">Ingresa tus datos</h2>
        <form onSubmit={handleFormSubmit} className="bg-white rounded-[16px] p-8 space-y-6 shadow-sm border border-[#E7D7B1]/50">
          <div>
            <label htmlFor="ownerName" className="block text-[#4A2E1F] mb-2 font-medium">
              Nombre completo del dueño
            </label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              required
              value={formData.ownerName}
              onChange={handleFormChange}
              className="w-full px-5 py-4 bg-[#FFF9F1] rounded-[12px] text-[#4A2E1F] focus:outline-none focus:ring-2 focus:ring-[#178C2E] border border-[#E7D7B1] transition-all duration-250 hover:border-[#178C2E]/50"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-[#4A2E1F] mb-2 font-medium">
              Número de teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleFormChange}
              className="w-full px-5 py-4 bg-[#FFF9F1] rounded-[12px] text-[#4A2E1F] focus:outline-none focus:ring-2 focus:ring-[#178C2E] border border-[#E7D7B1] transition-all duration-250 hover:border-[#178C2E]/50"
            />
          </div>

          <div>
            <label htmlFor="petName" className="block text-[#4A2E1F] mb-2 font-medium">
              Nombre de la mascota
            </label>
            <input
              type="text"
              id="petName"
              name="petName"
              required
              value={formData.petName}
              onChange={handleFormChange}
              className="w-full px-5 py-4 bg-[#FFF9F1] rounded-[12px] text-[#4A2E1F] focus:outline-none focus:ring-2 focus:ring-[#178C2E] border border-[#E7D7B1] transition-all duration-250 hover:border-[#178C2E]/50"
            />
          </div>

          <div>
            <label className="block text-[#4A2E1F] mb-2 font-medium">Especie</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, species: 'Perro' })}
                className={`flex-1 py-4 rounded-[12px] transition-all duration-250 font-medium border transform hover:scale-[1.02] ${
                  formData.species === 'Perro'
                    ? 'bg-[#178C2E] text-white border-[#178C2E]'
                    : 'bg-[#FFF9F1] text-[#4A2E1F] border-[#E7D7B1] hover:border-[#178C2E]/50'
                }`}
              >
                Perro
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, species: 'Gato' })}
                className={`flex-1 py-4 rounded-[12px] transition-all duration-250 font-medium border transform hover:scale-[1.02] ${
                  formData.species === 'Gato'
                    ? 'bg-[#178C2E] text-white border-[#178C2E]'
                    : 'bg-[#FFF9F1] text-[#4A2E1F] border-[#E7D7B1] hover:border-[#178C2E]/50'
                }`}
              >
                Gato
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="age" className="block text-[#4A2E1F] mb-2 font-medium">
              Edad aproximada
            </label>
            <input
              type="text"
              id="age"
              name="age"
              required
              value={formData.age}
              onChange={handleFormChange}
              placeholder="ej: 2 años"
              className="w-full px-5 py-4 bg-[#FFF9F1] rounded-[12px] text-[#4A2E1F] focus:outline-none focus:ring-2 focus:ring-[#178C2E] border border-[#E7D7B1] transition-all duration-250 hover:border-[#178C2E]/50"
            />
          </div>

          <PrimaryButton type="submit" variant="primary" fullWidth className="mt-8">
            Confirmar inscripción
          </PrimaryButton>
        </form>
      </div>
    </Layout>
  );
}
