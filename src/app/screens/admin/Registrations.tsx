import { Download } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';

const mockInscritos = [
  { id: 1, nombreDueno: 'María García', telefono: '5555-1234', mascota: 'Firulais', especie: 'Perro', horario: '9:00 AM', fecha: '2026-06-15' },
  { id: 2, nombreDueno: 'Carlos López', telefono: '5555-5678', mascota: 'Michi', especie: 'Gato', horario: '10:00 AM', fecha: '2026-06-15' },
  { id: 3, nombreDueno: 'Ana Martínez', telefono: '5555-9012', mascota: 'Bobby', especie: 'Perro', horario: '11:00 AM', fecha: '2026-06-15' }
];

export function AdminRegistrations() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#4A2E1F] text-3xl">Inscritos por Jornada</h1>
        <PrimaryButton
          variant="accent"
          className="flex items-center gap-2"
        >
          <Download size={20} />
          Exportar CSV
        </PrimaryButton>
      </div>

      <div className="mb-6">
        <select className="px-4 py-3 bg-[#E7D7B1] rounded-[20px] text-[#4A2E1F] focus:outline-none focus:ring-2 focus:ring-[#178C2E] min-w-[250px]">
          <option>Guatemala - 2026-06-15</option>
          <option>Mixco - 2026-06-18</option>
          <option>Villa Nueva - 2026-06-20</option>
        </select>
      </div>

      <div className="bg-white rounded-[24px] shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#E7D7B1]">
            <tr>
              <th className="text-left p-4 text-[#4A2E1F]">Nombre dueño</th>
              <th className="text-left p-4 text-[#4A2E1F]">Teléfono</th>
              <th className="text-left p-4 text-[#4A2E1F]">Mascota</th>
              <th className="text-left p-4 text-[#4A2E1F]">Especie</th>
              <th className="text-left p-4 text-[#4A2E1F]">Horario</th>
              <th className="text-left p-4 text-[#4A2E1F]">Fecha inscripción</th>
            </tr>
          </thead>
          <tbody>
            {mockInscritos.map(inscrito => (
              <tr key={inscrito.id} className="border-t border-[#E7D7B1] hover:bg-[#FFF9F1] transition-colors duration-250">
                <td className="p-4 text-[#4A2E1F]">{inscrito.nombreDueno}</td>
                <td className="p-4 text-[#4A2E1F]">{inscrito.telefono}</td>
                <td className="p-4 text-[#4A2E1F]">{inscrito.mascota}</td>
                <td className="p-4 text-[#4A2E1F]">{inscrito.especie}</td>
                <td className="p-4 text-[#4A2E1F]">{inscrito.horario}</td>
                <td className="p-4 text-[#4A2E1F]">{inscrito.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
