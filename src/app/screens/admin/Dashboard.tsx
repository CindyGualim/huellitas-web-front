import { Link } from 'react-router-dom';
import { Calendar, Heart, Users, TrendingUp, ArrowRight } from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { label: 'Jornadas Activas', value: '3', icon: Calendar, color: 'bg-[#178C2E]', link: '/admin/events' },
    { label: 'Adopciones Pendientes', value: '12', icon: Heart, color: 'bg-[#F4C542]', link: '/admin/adoptions' },
    { label: 'Inscritos Este Mes', value: '48', icon: Users, color: 'bg-[#E7D7B1]', link: '/admin/registrations' },
    { label: 'Tasa de Adopción', value: '87%', icon: TrendingUp, color: 'bg-[#178C2E]', link: '/admin/adoptions' }
  ];

  const recentActivity = [
    { type: 'event', message: 'Nueva jornada creada en Mixco', time: 'Hace 2 horas', color: 'bg-[#178C2E]' },
    { type: 'adoption', message: 'Max fue adoptado', time: 'Hace 5 horas', color: 'bg-[#F4C542]' },
    { type: 'registration', message: '15 nuevas inscripciones', time: 'Ayer', color: 'bg-[#178C2E]' },
    { type: 'event', message: 'Jornada completada en Guatemala', time: 'Hace 2 días', color: 'bg-[#4A2E1F]' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[#4A2E1F] text-3xl mb-2">Dashboard</h1>
        <p className="text-[#4A2E1F]/70">Bienvenida, María González</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-[16px] p-6 shadow-sm border border-[#E7D7B1]/50 hover:shadow-md transition-all duration-250 transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                  <Icon className="text-[#178C2E]" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#4A2E1F] mb-1">{stat.value}</div>
              <div className="text-sm text-[#4A2E1F]/70">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#E7D7B1]/50">
          <h2 className="text-[#4A2E1F] mb-4 text-xl">Accesos Rápidos</h2>
          <div className="space-y-3">
            <Link
              to="/admin/events"
              className="flex items-center justify-between p-4 bg-[#FFF9F1] rounded-lg hover:bg-[#E7D7B1] transition-all duration-250 border border-[#E7D7B1]/50 group"
            >
              <div className="flex items-center gap-3">
                <Calendar className="text-[#178C2E]" size={20} />
                <span className="text-[#4A2E1F] font-medium">Gestionar Jornadas</span>
              </div>
              <ArrowRight className="text-[#178C2E] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </Link>
            <Link
              to="/admin/adoptions"
              className="flex items-center justify-between p-4 bg-[#FFF9F1] rounded-lg hover:bg-[#E7D7B1] transition-all duration-250 border border-[#E7D7B1]/50 group"
            >
              <div className="flex items-center gap-3">
                <Heart className="text-[#178C2E]" size={20} />
                <span className="text-[#4A2E1F] font-medium">Gestionar Adopciones</span>
              </div>
              <ArrowRight className="text-[#178C2E] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </Link>
            <Link
              to="/admin/registrations"
              className="flex items-center justify-between p-4 bg-[#FFF9F1] rounded-lg hover:bg-[#E7D7B1] transition-all duration-250 border border-[#E7D7B1]/50 group"
            >
              <div className="flex items-center gap-3">
                <Users className="text-[#178C2E]" size={20} />
                <span className="text-[#4A2E1F] font-medium">Ver Inscritos</span>
              </div>
              <ArrowRight className="text-[#178C2E] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#E7D7B1]/50">
          <h2 className="text-[#4A2E1F] mb-4 text-xl">Actividad Reciente</h2>
          <div className="space-y-4 text-sm">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-[#E7D7B1]/50 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full ${activity.color} mt-2 flex-shrink-0`}></div>
                <div className="flex-1">
                  <p className="text-[#4A2E1F]">{activity.message}</p>
                  <p className="text-[#4A2E1F]/60 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#178C2E] to-[#136e24] rounded-[16px] p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl mb-2">Sitio Público</h3>
            <p className="text-white/90 mb-4">Ver cómo se ve el sitio para los visitantes</p>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 bg-white text-[#178C2E] px-6 py-3 rounded-[50px] font-medium hover:bg-[#FFF9F1] transition-all duration-250"
            >
              Ir al Sitio Público
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
