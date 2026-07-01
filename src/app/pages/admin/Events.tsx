import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Calendar } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';

export function AdminEvents() {
  const [events, setEvents] = useState([
    { id: 1, municipality: 'Guatemala', date: '2026-06-15', slots: 30, used: 12, status: 'active' },
    { id: 2, municipality: 'Mixco', date: '2026-06-18', slots: 25, used: 8, status: 'active' },
    { id: 3, municipality: 'Villa Nueva', date: '2026-06-20', slots: 20, used: 20, status: 'full' },
    { id: 4, municipality: 'San Miguel Petapa', date: '2026-06-22', slots: 30, used: 5, status: 'active' }
  ]);

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#222222] mb-1 text-3xl">Jornadas de Castración</h1>
          <p className="text-[#222222]/50">Gestiona eventos y cupos disponibles</p>
        </div>
        <PrimaryButton variant="primary" className="flex items-center gap-2">
          <Plus size={18} />
          Nueva Jornada
        </PrimaryButton>
      </div>

      <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F8F8] border-b border-[#D9D9D9]/50">
              <tr>
                {['Municipio', 'Fecha', 'Cupos', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#222222]/50 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9D9]/30">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-[#F8F8F8]/60 transition-colors duration-250">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-[#222222]/30" />
                      <span className="text-[#222222] font-medium text-sm">{event.municipality}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-[#222222]/30" />
                      <span className="text-[#222222] text-sm">{event.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-[#222222] text-sm">{event.used}/{event.slots}</span>
                      <div className="w-24 bg-[#D9D9D9]/40 rounded-full h-1 mt-1">
                        <div className="bg-[#20A83E] h-1 rounded-full" style={{ width: `${(event.used / event.slots) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      event.status === 'active'
                        ? 'bg-[#20A83E]/10 text-[#20A83E] border border-[#20A83E]/20'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {event.status === 'active' ? 'Activo' : 'Lleno'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#20A83E] hover:bg-[#20A83E]/10 rounded-lg transition-all duration-250">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-250">
                        <Trash2 size={15} />
                      </button>
                    </div>
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
