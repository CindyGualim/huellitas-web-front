import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { STATUS_OPTIONS } from '../../lib/petMappings';
import { CATEGORICAL_COLORS, BRAND_COLOR, CHART_TEXT } from '../../lib/chartColors';
import { ApiDashboardStats } from '../../lib/api';

type DashboardDonations = NonNullable<ApiDashboardStats['donations']>;
type DashboardRequests = NonNullable<ApiDashboardStats['adoptionRequests']>;

const tooltipStyle = {
  contentStyle: {
    background: '#ffffff',
    border: '1px solid #D9D9D9',
    borderRadius: 12,
    fontSize: 13,
    color: CHART_TEXT.primary
  },
  labelStyle: { color: CHART_TEXT.primary, fontWeight: 500 }
};

export function PetsByStatusChart({ byStatus }: { byStatus: ApiDashboardStats['pets']['byStatus'] }) {
  const data = STATUS_OPTIONS
    .map(option => ({ name: option.label, value: byStatus[option.value] ?? 0 }))
    .filter(d => d.value > 0);

  if (data.length === 0) {
    return <p className="text-[#222222]/50 text-sm text-center py-16">Todavía no hay mascotas registradas.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
          {data.map((_, index) => (
            <Cell key={index} fill={CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length]} stroke="#ffffff" strokeWidth={2} />
          ))}
        </Pie>
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => <span style={{ color: CHART_TEXT.secondary, fontSize: 13 }}>{value}</span>}
        />
        <Tooltip {...tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PetsBySpeciesChart({ bySpecies }: { bySpecies: ApiDashboardStats['pets']['bySpecies'] }) {
  const data = [
    { name: 'Perros', value: bySpecies.Perro ?? 0 },
    { name: 'Gatos', value: bySpecies.Gato ?? 0 }
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <CartesianGrid horizontal={false} stroke={CHART_TEXT.grid} />
        <XAxis type="number" allowDecimals={false} tick={{ fill: CHART_TEXT.muted, fontSize: 12 }} axisLine={{ stroke: CHART_TEXT.grid }} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fill: CHART_TEXT.secondary, fontSize: 13 }} axisLine={false} tickLine={false} width={60} />
        <Tooltip {...tooltipStyle} cursor={{ fill: '#F8F8F8' }} />
        <Bar dataKey="value" fill={BRAND_COLOR} barSize={24} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonationsTrendChart({ monthly }: { monthly: DashboardDonations['monthly'] }) {
  // Los totales ya vienen agrupados por mes desde el servidor (month de 1 a 12).
  const data = monthly.map(({ year, month, total }) => ({
    name: new Date(year, month - 1, 1).toLocaleDateString('es-GT', { month: 'short' }),
    total
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ left: 8, right: 16, top: 8 }}>
        <CartesianGrid vertical={false} stroke={CHART_TEXT.grid} />
        <XAxis dataKey="name" tick={{ fill: CHART_TEXT.muted, fontSize: 12 }} axisLine={{ stroke: CHART_TEXT.grid }} tickLine={false} />
        <YAxis tick={{ fill: CHART_TEXT.muted, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `Q${v}`} width={50} />
        <Tooltip {...tooltipStyle} formatter={(value: number) => [`Q${value.toFixed(2)}`, 'Donado']} />
        <Line type="monotone" dataKey="total" stroke={BRAND_COLOR} strokeWidth={2} dot={{ r: 4, fill: BRAND_COLOR, stroke: '#ffffff', strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const REQUEST_STATUS_LABELS: Record<string, string> = {
  Pendiente: 'Pendiente',
  En_revision: 'En revisión',
  Aprobada: 'Aprobada',
  Rechazada: 'Rechazada'
};

export function AdoptionRequestsChart({ byStatus }: { byStatus: DashboardRequests['byStatus'] }) {
  const statuses = Object.keys(REQUEST_STATUS_LABELS) as (keyof typeof byStatus)[];
  const data = [
    statuses.reduce(
      (row, status) => ({ ...row, [status]: byStatus[status] ?? 0 }),
      { name: 'Solicitudes' } as Record<string, string | number>
    )
  ];
  const total = statuses.reduce((sum, status) => sum + (byStatus[status] ?? 0), 0);

  if (total === 0) {
    return <p className="text-[#222222]/50 text-sm text-center py-16">Todavía no hay solicitudes de adopción.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <CartesianGrid horizontal={false} stroke={CHART_TEXT.grid} />
        <XAxis type="number" allowDecimals={false} tick={{ fill: CHART_TEXT.muted, fontSize: 12 }} axisLine={{ stroke: CHART_TEXT.grid }} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fill: CHART_TEXT.secondary, fontSize: 13 }} axisLine={false} tickLine={false} width={80} />
        <Tooltip {...tooltipStyle} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => <span style={{ color: CHART_TEXT.secondary, fontSize: 13 }}>{REQUEST_STATUS_LABELS[value] ?? value}</span>}
        />
        {statuses.map((status, index) => (
          <Bar key={status} dataKey={status} stackId="requests" fill={CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length]} barSize={24} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
