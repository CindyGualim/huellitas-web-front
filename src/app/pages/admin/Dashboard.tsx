import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, DollarSign, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiGetDashboardStats, ApiDashboardStats, ApiActivityItem } from '../../lib/api';
import { ChartCarousel } from '../../components/admin/ChartCarousel';
import { PetsByStatusChart, PetsBySpeciesChart, DonationsTrendChart, AdoptionRequestsChart } from '../../components/admin/DashboardCharts';
import { formatDateOnly } from '../../lib/dateUtils';

interface ActivityItem {
  key: string;
  icon: typeof Heart;
  title: string;
  subtitle: string;
  date: Date;
  // Las donaciones solo tienen fecha (sin hora): "Hace 5 horas" sería engañoso.
  dateOnly?: boolean;
}

function timeAgo(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Hace unos minutos';
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
}

function toActivityItem(item: ApiActivityItem): ActivityItem {
  switch (item.type) {
    case 'event':
      return { key: `event-${item.id}`, icon: Calendar, title: item.title, subtitle: 'Nuevo evento programado', date: new Date(item.date) };
    case 'donation':
      return { key: `donation-${item.id}`, icon: Gift, title: item.donorName, subtitle: `Donó Q${Number(item.amount).toFixed(2)}`, date: new Date(item.date), dateOnly: true };
    case 'adoptionRequest':
      return { key: `request-${item.id}`, icon: Heart, title: item.adopterName, subtitle: `Solicitud de adopción de ${item.petName}`, date: new Date(item.date) };
  }
}

export function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<ApiDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    // Los totales se calculan en el servidor sobre todos los registros (antes se contaban
    // solo los primeros 100 de cada listado). El backend omite donaciones y solicitudes
    // para los roles que no pueden verlas.
    apiGetDashboardStats(token)
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudieron cargar los datos del dashboard'))
      .finally(() => setIsLoading(false));
  }, [token]);

  const activity = data ? data.recentActivity.map(toActivityItem) : [];

  const statCards = data ? [
    { label: 'Mascotas Disponibles', value: String(data.pets.byStatus.Disponible ?? 0), icon: Heart, link: '/admin/adoptions', color: '#20A83E' },
    { label: 'Próximas Jornadas', value: String(data.upcomingEvents), icon: Calendar, link: '/admin/events', color: '#146B27' },
    ...(data.adoptionRequests ? [{ label: 'Adopciones Pendientes', value: String(data.adoptionRequests.pending), icon: Users, link: '/admin/adoption-requests', color: '#20A83E' }] : []),
    ...(data.donations ? [{
      label: 'Donaciones Este Mes',
      value: `Q${data.donations.thisMonth.toFixed(2)}`,
      icon: DollarSign,
      link: '/admin/donations',
      color: '#146B27'
    }] : [])
  ] : [];

  const chartSlides = data ? [
    { title: 'Mascotas por estado', subtitle: 'Distribución actual del refugio', content: <PetsByStatusChart byStatus={data.pets.byStatus} /> },
    { title: 'Mascotas por especie', subtitle: 'Perros vs. gatos en el registro', content: <PetsBySpeciesChart bySpecies={data.pets.bySpecies} /> },
    ...(data.donations ? [{ title: 'Donaciones', subtitle: 'Total recaudado por mes (últimos 6 meses)', content: <DonationsTrendChart monthly={data.donations.monthly} /> }] : []),
    ...(data.adoptionRequests ? [{ title: 'Solicitudes de adopción', subtitle: 'Distribución por estado', content: <AdoptionRequestsChart byStatus={data.adoptionRequests.byStatus} /> }] : [])
  ] : [];

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Dashboard</h1>
        <p className="text-[#222222]/50">Resumen de actividades</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map(stat => (
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
            {data && <ChartCarousel slides={chartSlides} />}

            <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
              <h2 className="text-[#222222] mb-4 text-xl">Actividad Reciente</h2>
              {activity.length === 0 ? (
                <p className="text-[#222222]/50 text-sm">Todavía no hay actividad registrada.</p>
              ) : (
                <div className="space-y-3">
                  {activity.map(item => (
                    <div key={item.key} className="flex items-start gap-3 p-3 bg-[#F8F8F8] rounded-xl border border-[#D9D9D9]/30">
                      <div className="p-2 rounded-lg bg-[#20A83E]/10">
                        <item.icon size={15} className="text-[#20A83E]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#222222] text-sm">{item.title}</div>
                        <div className="text-xs text-[#222222]/50">{item.subtitle}</div>
                        <div className="text-xs text-[#222222]/30 mt-0.5">{item.dateOnly ? formatDateOnly(item.date.toISOString(), { day: 'numeric', month: 'short', year: 'numeric' }) : timeAgo(item.date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
