import { Phone, MapPin, Calendar } from 'lucide-react';

export function AdminRegistrations() {
  const registrations = [
    { id: 1, ownerName: 'María González', phone: '+502 5555-1234', petName: 'Firulais', municipality: 'Guatemala', date: '2026-06-15', time: '9:00 AM', species: 'Perro' },
    { id: 2, ownerName: 'Carlos Pérez', phone: '+502 5555-5678', petName: 'Michi', municipality: 'Mixco', date: '2026-06-18', time: '10:00 AM', species: 'Gato' },
    { id: 3, ownerName: 'Ana Rodríguez', phone: '+502 5555-9012', petName: 'Pelusa', municipality: 'Guatemala', date: '2026-06-15', time: '11:00 AM', species: 'Perro' }
  ];

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Inscripciones</h1>
        <p className="text-[#222222]/50">Registro de participantes en jornadas</p>
      </div>

      <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F8F8] border-b border-[#D9D9D9]/50">
              <tr>
                {['Dueño', 'Contacto', 'Mascota', 'Ubicación', 'Fecha y Hora'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#222222]/50 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9D9]/30">
              {registrations.map(reg => (
                <tr key={reg.id} className="hover:bg-[#F8F8F8]/60 transition-colors duration-250">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#222222] text-sm">{reg.ownerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[#222222]/50 text-sm">
                      <Phone size={13} />
                      <span>{reg.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#222222] text-sm">{reg.petName}</div>
                    <div className="text-xs text-[#222222]/40">{reg.species}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-[#222222]/30" />
                      <span className="text-[#222222] text-sm">{reg.municipality}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={13} className="text-[#222222]/30" />
                      <span className="text-[#222222] text-sm">{reg.date}</span>
                    </div>
                    <div className="text-xs text-[#222222]/40 ml-5">{reg.time}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
