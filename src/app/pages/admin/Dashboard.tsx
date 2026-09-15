import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, DollarSign, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiGetPets, apiGetEvents, apiGetDonations, apiGetAdoptionRequests, ApiPet, ApiEvent, ApiDonation, ApiAdoptionRequest } from '../../lib/api';
import { ChartCarousel } from '../../components/admin/ChartCarousel';
import { PetsByStatusChart, PetsBySpeciesChart, DonationsTrendChart, AdoptionRequestsChart } from '../../components/admin/DashboardCharts';

interface ActivityItem {
  key: string;
  icon: typeof Heart;
  title: string;
  subtitle: string;
  date: Date;
}

interface DashboardData {
  pets: ApiPet[];
  events: ApiEvent[];
  donations: ApiDonation[] | null;
  requests: ApiAdoptionRequest[] | null;
}

function timeAgo(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Hace unos minutos';
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
}

export function AdminDashboard() {
  const { token, user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cada rol solo puede consultar lo que el backend le permite — pedir de más
  // solo produce un 403 y rompe el dashboard entero para ese usuario.
  const canViewDonations = user?.role === 'Superadministrador';
  const canViewAdoptionRequests = user?.role === 'Superadministrador' || user?.role === 'Operador';

  useEffect(() => {
    if (!token) return;

    Promise.all([
      apiGetPets({ limit: 100 }),
      apiGetEvents({ limit: 100 }),
      canViewDonations ? apiGetDonations(token, { limit: 100 }) : Promise.resolve(null),
      canViewAdoptionRequests ? apiGetAdoptionRequests(token, { limit: 100 }) : Promise.resolve(null)
    ])
      .then(([petsPage, eventsPage, donationsPage, requestsPage]) => {
        const pets = petsPage.items;
        const events = eventsPage.items;
        const donations = donationsPage?.items ?? null;
        const requests = requestsPage?.items ?? null;

        setData({ pets, events, donations, requests });

        const eventItems: ActivityItem[] = events.map(e => ({
          key: `event-${e.id}`,
          icon: Calendar,
          title: e.title,
          subtitle: 'Nuevo evento programado',
          date: new Date(e.createdAt)
        }));

        const donationItems: ActivityItem[] = (donations ?? []).map(d => ({
          key: `donation-${d.id}`,
          icon: Gift,
          title: d.donorName,
          subtitle: `Donó Q${Number(d.amount).toFixed(2)}`,
          date: new Date(d.donationDate)
        }));

        const requestItems: ActivityItem[] = (requests ?? []).map(r => ({
          key: `request-${r.id}`,
          icon: Heart,
          title: r.adopter.fullName,
          subtitle: `Solicitud de adopción de ${r.pet.name}`,
          date: new Date(r.submittedAt)
        }));

        const merged = [...eventItems, ...donationItems, ...requestItems]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 5);

        setActivity(merged);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudieron cargar los datos del dashboard'))
      .finally(() => setIsLoading(false));
  }, [token, canViewDonations, canViewAdoptionRequests]);

  const now = new Date();
  const statCards = data ? [
    { label: 'Mascotas Disponibles', value: String(data.pets.filter(p => p.status === 'Disponible').length), icon: Heart, link: '/admin/adoptions', color: '#20A83E' },
    { label: 'Próximas Jornadas', value: String(data.events.filter(e => e.status === 'Programado').length), icon: Calendar, link: '/admin/events', color: '#146B27' },
    ...(data.requests ? [{ label: 'Adopciones Pendientes', value: String(data.requests.filter(r => r.status === 'Pendiente').length), icon: Users, link: '/admin/adoptions', color: '#20A83E' }] : []),
    ...(data.donations ? [{
      label: 'Donaciones Este Mes',
      value: `Q${data.donations
        .filter(d => {
          const date = new Date(d.donationDate);
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        })
        .reduce((sum, d) => sum + Number(d.amount), 0)
        .toFixed(2)}`,
      icon: DollarSign,
      link: '/admin/donations',
      color: '#146B27'
    }] : [])
  ] : [];

  const chartSlides = data ? [
    { title: 'Mascotas por estado', subtitle: 'Distribución actual del refugio', content: <PetsByStatusChart pets={data.pets} /> },
    { title: 'Mascotas por especie', subtitle: 'Perros vs. gatos disponibles', content: <PetsBySpeciesChart pets={data.pets} /> },
    ...(data.donations ? [{ title: 'Donaciones', subtitle: 'Total recaudado por mes (últimos 6 meses)', content: <DonationsTrendChart donations={data.donations} /> }] : []),
    ...(data.requests ? [{ title: 'Solicitudes de adopción', subtitle: 'Distribución por estado', content: <AdoptionRequestsChart requests={data.requests} /> }] : [])
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
                        <div className="text-xs text-[#222222]/30 mt-0.5">{timeAgo(item.date)}</div>
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
