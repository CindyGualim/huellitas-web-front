import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { PrimaryButton } from '../../components/PrimaryButton';

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

export function CastrationStep2() {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [municipality, setMunicipality] = useState<any>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('castration_municipality');
    if (saved) {
      setMunicipality(JSON.parse(saved));
    } else {
      navigate('/castration/step-1');
    }
  }, [navigate]);

  const handleContinue = () => {
    if (selectedTime) {
      sessionStorage.setItem('castration_time', selectedTime);
      navigate('/castration/step-3');
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 pb-16">
        <Link to="/castration/step-1" className="flex items-center gap-2 text-[#178C2E] mb-8 hover:text-[#136e24]">
          <ArrowLeft size={20} />
          <span className="font-medium">Volver</span>
        </Link>

        <div className="mb-10">
          <h1 className="text-[#4A2E1F] mb-2 text-3xl">Paso 2 de 3</h1>
          <p className="text-[#4A2E1F]/70">Selecciona tu horario en {municipality?.name}</p>
        </div>

        <div className="bg-[#E7D7B1]/30 rounded-full h-2 mb-10 overflow-hidden">
          <div className="bg-[#178C2E] h-full w-2/3 transition-all duration-300 rounded-full" />
        </div>

        <h2 className="text-[#4A2E1F] mb-6 text-2xl">Selecciona tu horario</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {timeSlots.map(slot => (
            <button
              key={slot.time}
              onClick={() => slot.available && setSelectedTime(slot.time)}
              disabled={!slot.available}
              className={`p-4 rounded-[12px] transition-all duration-250 min-h-[70px] font-medium border transform hover:scale-[1.02] ${
                selectedTime === slot.time
                  ? 'bg-[#178C2E] text-white border-[#178C2E] shadow-md'
                  : slot.available
                  ? 'bg-white hover:bg-[#FFF9F1] hover:shadow-sm text-[#4A2E1F] border-[#E7D7B1]/50'
                  : 'bg-[#FFF9F1] text-[#4A2E1F]/40 cursor-not-allowed border-[#E7D7B1]/30'
              }`}
            >
              {slot.time}
              {selectedTime === slot.time && (
                <CheckCircle size={18} className="mx-auto mt-1" />
              )}
            </button>
          ))}
        </div>
        <p className="text-[#4A2E1F]/60 text-sm mb-8 bg-[#F4C542]/5 border border-[#F4C542]/20 rounded-lg p-4">
          Los cupos se bloquean automáticamente al llenarse
        </p>

        <PrimaryButton
          variant="primary"
          onClick={handleContinue}
          disabled={!selectedTime}
          fullWidth
        >
          Continuar
        </PrimaryButton>
      </div>
    </Layout>
  );
}
