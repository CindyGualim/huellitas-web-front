import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { Link } from 'react-router-dom';

const municipalities = [
  { id: 1, name: 'Guatemala', date: '2026-06-15', available: true, slotsUsed: 12, slotsTotal: 30 },
  { id: 2, name: 'Mixco', date: '2026-06-18', available: true, slotsUsed: 8, slotsTotal: 25 },
  { id: 3, name: 'Villa Nueva', date: '2026-06-20', available: false, slotsUsed: 20, slotsTotal: 20 },
  { id: 4, name: 'San Miguel Petapa', date: '2026-06-22', available: true, slotsUsed: 5, slotsTotal: 30 }
];

export function CastrationStep1() {
  const navigate = useNavigate();
  const [selectedMunicipality, setSelectedMunicipality] = useState<any>(null);

  const handleMunicipalitySelect = (municipality: any) => {
    if (municipality.available) {
      setSelectedMunicipality(municipality);
      sessionStorage.setItem('castration_municipality', JSON.stringify(municipality));
      navigate('/castration/step-2');
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 pb-16">
        <Link to="/castration" className="flex items-center gap-2 text-[#178C2E] mb-8 hover:text-[#136e24]">
          <ArrowLeft size={20} />
          <span className="font-medium">Volver</span>
        </Link>

        <div className="mb-10">
          <h1 className="text-[#4A2E1F] mb-2 text-3xl">Paso 1 de 3</h1>
          <p className="text-[#4A2E1F]/70">Selecciona el municipio</p>
        </div>

        <div className="bg-[#E7D7B1]/30 rounded-full h-2 mb-10 overflow-hidden">
          <div className="bg-[#178C2E] h-full w-1/3 transition-all duration-300 rounded-full" />
        </div>

        <h2 className="text-[#4A2E1F] mb-6 text-2xl">¿En qué municipio está tu mascota?</h2>
        <div className="space-y-4">
          {municipalities.map(municipality => (
            <button
              key={municipality.id}
              onClick={() => handleMunicipalitySelect(municipality)}
              disabled={!municipality.available}
              className={`w-full p-6 rounded-[16px] text-left transition-all duration-250 border transform ${
                municipality.available
                  ? 'bg-white hover:shadow-md hover:scale-[1.01] shadow-sm cursor-pointer border-[#E7D7B1]/50'
                  : 'bg-[#FFF9F1] cursor-not-allowed border-[#E7D7B1]/30 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-[#4A2E1F] text-lg font-medium">{municipality.name}</h3>
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    municipality.available
                      ? 'bg-[#178C2E]/10 text-[#178C2E] border border-[#178C2E]/20'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  {municipality.available ? 'Cupos disponibles' : 'Lleno'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#4A2E1F]/70 mb-2">
                <Calendar size={18} />
                <span>{municipality.date}</span>
              </div>
              <div className="text-sm text-[#4A2E1F]/60">
                {municipality.slotsUsed}/{municipality.slotsTotal} cupos ocupados
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
