import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { STATUS_OPTIONS } from '../../lib/petMappings';
import { CATEGORICAL_COLORS, BRAND_COLOR, CHART_TEXT } from '../../lib/chartColors';
import { ApiPet, ApiDonation, ApiAdoptionRequest } from '../../lib/api';

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

export function PetsByStatusChart({ pets }: { pets: ApiPet[] }) {
  const data = STATUS_OPTIONS
    .map(option => ({ name: option.label, value: pets.filter(p => p.status === option.value).length }))
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

export function PetsBySpeciesChart({ pets }: { pets: ApiPet[] }) {
  const data = [
    { name: 'Perros', value: pets.filter(p => p.species === 'Perro').length },
    { name: 'Gatos', value: pets.filter(p => p.species === 'Gato').length }
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

export function DonationsTrendChart({ donations }: { donations: ApiDonation[] }) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { year: date.getFullYear(), month: date.getMonth(), label: date.toLocaleDateString('es-GT', { month: 'short' }) };
  });

  const data = months.map(({ year, month, label }) => ({
    name: label,
    total: donations
      .filter(d => {
        const date = new Date(d.donationDate);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .reduce((sum, d) => sum + Number(d.amount), 0)
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

export function AdoptionRequestsChart({ requests }: { requests: ApiAdoptionRequest[] }) {
  const statuses = Object.keys(REQUEST_STATUS_LABELS);
  const data = [
    statuses.reduce(
      (row, status) => ({ ...row, [status]: requests.filter(r => r.status === status).length }),
      { name: 'Solicitudes' } as Record<string, string | number>
    )
  ];

  if (requests.length === 0) {
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
