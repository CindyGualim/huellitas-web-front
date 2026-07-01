import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';

const mockJornadas = [
  { id: 1, municipio: 'Guatemala', fecha: '2026-06-15', horarios: '8:00 AM - 4:00 PM', cuposUsados: 12, cuposTotal: 30, estado: 'Activa' },
  { id: 2, municipio: 'Mixco', fecha: '2026-06-18', horarios: '9:00 AM - 3:00 PM', cuposUsados: 8, cuposTotal: 25, estado: 'Activa' },
  { id: 3, municipio: 'Villa Nueva', fecha: '2026-06-20', horarios: '8:00 AM - 2:00 PM', cuposUsados: 20, cuposTotal: 20, estado: 'Llena' }
];

export function AdminEvents() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#4A2E1F] text-3xl">Jornadas de Castración</h1>
        <PrimaryButton
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Jornada
        </PrimaryButton>
      </div>

      <div className="bg-white rounded-[24px] shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#E7D7B1]">
            <tr>
              <th className="text-left p-4 text-[#4A2E1F]">Municipio</th>
              <th className="text-left p-4 text-[#4A2E1F]">Fecha</th>
              <th className="text-left p-4 text-[#4A2E1F]">Horarios</th>
              <th className="text-left p-4 text-[#4A2E1F]">Cupos</th>
              <th className="text-left p-4 text-[#4A2E1F]">Estado</th>
              <th className="text-left p-4 text-[#4A2E1F]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockJornadas.map(jornada => (
              <tr key={jornada.id} className="border-t border-[#E7D7B1] hover:bg-[#FFF9F1] transition-colors duration-250">
                <td className="p-4 text-[#4A2E1F]">{jornada.municipio}</td>
                <td className="p-4 text-[#4A2E1F]">{jornada.fecha}</td>
                <td className="p-4 text-[#4A2E1F]">{jornada.horarios}</td>
                <td className="p-4 text-[#4A2E1F]">
                  {jornada.cuposUsados}/{jornada.cuposTotal}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${
                      jornada.estado === 'Activa'
                        ? 'bg-[#178C2E]/10 text-[#178C2E] border border-[#178C2E]/20'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    {jornada.estado}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-[#E7D7B1] rounded-lg transition-all duration-250 active:scale-95">
                      <Edit size={18} className="text-[#178C2E]" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-all duration-250 active:scale-95">
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#FFF9F1] rounded-[24px] p-8 max-w-md w-full transform transition-all duration-250 scale-100">
            <h2 className="text-[#4A2E1F] mb-4 text-xl font-medium">Nueva Jornada</h2>
            <p className="text-[#4A2E1F]/80 mb-6">
              Formulario para agregar una nueva jornada de castración
            </p>
            <div className="flex gap-3">
              <PrimaryButton
                variant="ghost"
                onClick={() => setShowModal(false)}
                fullWidth
              >
                Cancelar
              </PrimaryButton>
              <PrimaryButton
                variant="primary"
                onClick={() => setShowModal(false)}
                fullWidth
              >
                Guardar
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
