import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { EventDetailModal } from '../components/EventDetailModal';
import { apiGetEvents, ApiEvent } from '../lib/api';
import { EVENT_TYPE_OPTIONS, eventTypeLabel } from '../lib/eventMappings';

function formatEventDate(value: string) {
  return new Date(value).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function eventBadgeClass(type: string) {
  if (type === 'Jornada_castracion') return 'bg-[#20A83E] text-white';
  if (type === 'Jornada_adopcion') return 'bg-[#146B27] text-white';
  return 'bg-[#D9D9D9] text-[#222222]';
}

function EventCard({ event }: { event: ApiEvent }) {
  const isCastration = event.type === 'Jornada_castracion';
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="bg-white rounded-[16px] p-4 border border-[#D9D9D9]/60 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3 gap-2">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${eventBadgeClass(event.type)}`}>
          {eventTypeLabel(event.type)}
        </span>
      </div>

      <h3 className="text-[#222222] text-base font-bold mb-2">{event.title}</h3>

      <div className="flex flex-col gap-1.5 mb-3">
        <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
          <Calendar size={14} className="text-[#20A83E]" />
          <span>{formatEventDate(event.startDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
          <MapPin size={14} className="text-[#20A83E]" />
          <span>{event.location}</span>
        </div>
      </div>

      <p className="text-[#222222]/70 text-sm mb-4 flex-1 line-clamp-2">
        {event.description}
      </p>

      <div className="mt-auto">
        {isCastration ? (
          <Link to={`/events/register/${event.id}`}>
            <PrimaryButton variant="primary" fullWidth>
              Inscribirse ahora
            </PrimaryButton>
          </Link>
        ) : (
          <button
            onClick={() => setShowDetail(true)}
            className="w-full bg-[#F8F8F8] text-[#222222] py-2.5 text-sm rounded-xl font-medium border border-[#D9D9D9] hover:border-[#20A83E]/50 transition-colors flex items-center justify-center gap-2"
          >
            Ver detalles <ArrowRight size={14} />
          </button>
        )}
      </div>

      {showDetail && <EventDetailModal event={event} onClose={() => setShowDetail(false)} />}
    </div>
  );
}

export function Events() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeType, setActiveType] = useState<string | 'Todas'>('Todas');

  useEffect(() => {
    apiGetEvents({ limit: 100 })
      .then(({ items }) => setEvents(items.filter(e => e.status === 'Programado' || e.status === 'En_curso')))
      .catch(() => setEvents([]))
      .finally(() => setIsLoading(false));
  }, []);

  const availableTypes = EVENT_TYPE_OPTIONS.filter(option => events.some(e => e.type === option.value));
  const filteredEvents = events.filter(e => activeType === 'Todas' || e.type === activeType);

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-6 py-8 md:py-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#20A83E]/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
          <div className="mx-auto max-w-6xl relative z-10 text-center md:text-left">
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">Próximos Eventos</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Únete a nosotros en nuestras jornadas de salud, castración y adopción en distintos municipios. Tu participación hace la diferencia.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 pb-16">
          {availableTypes.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide mb-5">
              {(['Todas', ...availableTypes.map(t => t.value)] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-2 rounded-xl transition-all duration-250 cursor-pointer text-sm font-medium whitespace-nowrap transform hover:scale-[1.02] active:scale-95 ${
                    activeType === type
                      ? 'bg-[#20A83E] text-white shadow-md'
                      : 'bg-[#F8F8F8] text-[#222222] hover:bg-[#D9D9D9]/50 border border-[#D9D9D9]/80'
                  }`}
                >
                  {type === 'Todas' ? 'Todas' : eventTypeLabel(type)}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <p className="text-center text-[#222222]/50 py-16 text-sm">Cargando...</p>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-14 bg-[#F8F8F8] rounded-[16px] border border-[#D9D9D9]/50">
              <div className="text-4xl mb-3 opacity-50">📅</div>
              <h3 className="text-[#222222] mb-1.5 text-lg font-medium">No hay eventos programados</h3>
              <p className="text-[#222222]/60 text-sm">Pronto anunciaremos nuevas fechas para esta categoría.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
