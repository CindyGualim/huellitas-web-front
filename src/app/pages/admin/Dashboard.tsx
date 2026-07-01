import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { label: 'Adopciones Pendientes', value: '12', icon: Heart, link: '/admin/adoptions', color: '#20A83E' },
    { label: 'Próximas Jornadas', value: '3', icon: Calendar, link: '/admin/events', color: '#146B27' },
    { label: 'Inscripciones Activas', value: '45', icon: Users, link: '/admin/registrations', color: '#20A83E' },
    { label: 'Total Este Mes', value: '89', icon: TrendingUp, link: '/admin', color: '#146B27' }
  ];

  const recentActivity = [
    { type: 'adoption', name: 'María González', pet: 'Max', time: 'Hace 2 horas' },
    { type: 'registration', name: 'Carlos Pérez', event: 'Castración Guatemala', time: 'Hace 5 horas' },
    { type: 'adoption', name: 'Ana Rodríguez', pet: 'Luna', time: 'Hace 1 día' }
  ];

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Dashboard</h1>
        <p className="text-[#222222]/50">Resumen de actividades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(stat => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50 hover:shadow-md transition-all duration-250 transform hover:scale-[1.02] group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-3xl font-medium text-[#222222] mb-1">{stat.value}</div>
            <div className="text-sm text-[#222222]/50">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
          <h2 className="text-[#222222] mb-4 text-xl">Acceso Rápido</h2>
          <div className="space-y-2">
            {[
              { to: '/admin/events', label: 'Gestionar Jornadas', sub: 'Crear y editar eventos de castración' },
              { to: '/admin/adoptions', label: 'Gestionar Adopciones', sub: 'Administrar perritos disponibles' },
              { to: '/admin/profile', label: 'Mi Perfil', sub: 'Ver información de cuenta' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="block p-4 bg-[#F8F8F8] rounded-xl hover:bg-[#20A83E]/5 hover:border-[#20A83E]/20 transition-all duration-250 border border-transparent"
              >
                <div className="font-medium text-[#222222] text-sm">{item.label}</div>
                <div className="text-xs text-[#222222]/40 mt-0.5">{item.sub}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
          <h2 className="text-[#222222] mb-4 text-xl">Actividad Reciente</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-[#F8F8F8] rounded-xl border border-[#D9D9D9]/30">
                <div className={`p-2 rounded-lg ${activity.type === 'adoption' ? 'bg-[#20A83E]/10' : 'bg-[#146B27]/10'}`}>
                  {activity.type === 'adoption'
                    ? <Heart size={15} className="text-[#20A83E]" />
                    : <Calendar size={15} className="text-[#146B27]" />
                  }
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[#222222] text-sm">{activity.name}</div>
                  <div className="text-xs text-[#222222]/50">
                    {activity.type === 'adoption' ? `Solicitud de ${activity.pet}` : activity.event}
                  </div>
                  <div className="text-xs text-[#222222]/30 mt-0.5">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
