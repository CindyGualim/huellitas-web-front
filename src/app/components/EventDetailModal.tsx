import { Link } from 'react-router-dom';
import { X, Calendar, MapPin } from 'lucide-react';
import { ApiEvent } from '../lib/api';
import { eventTypeLabel, eventStatusLabel, eventStatusBadgeClass } from '../lib/eventMappings';

interface EventDetailModalProps {
  event: ApiEvent;
  onClose: () => void;
}

function formatEventDate(value: string) {
  return new Date(value).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-xl relative max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#222222]/40 hover:text-[#222222] transition-colors"
          aria-label="Cerrar"
        >
          <X size={22} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#D9D9D9] text-[#222222]">
            {eventTypeLabel(event.type)}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${eventStatusBadgeClass(event.status)}`}>
            {eventStatusLabel(event.status)}
          </span>
        </div>

        <h2 className="text-[#222222] text-xl font-bold mb-4 pr-6">{event.title}</h2>

        <div className="flex flex-col gap-2 mb-4 text-sm text-[#222222]/70">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#20A83E]" />
            <span>{formatEventDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#20A83E]" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-[#222222]/80 text-sm leading-relaxed whitespace-pre-line mb-6">
          {event.description}
        </p>

        <Link to="/help" onClick={onClose} className="block text-center bg-[#20A83E] text-white py-2.5 text-sm rounded-xl font-semibold hover:bg-[#146B27] transition-colors">
          Quiero participar o ayudar
        </Link>
      </div>
    </div>
  );
}
