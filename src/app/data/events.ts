export type EventCategory = 'Jornadas de Castración' | 'Jornadas de Vacunación' | 'Jornadas de Adopción';

export interface AppEvent {
  id: string;
  category: EventCategory;
  title: string;
  municipality: string;
  date: string;
  description: string;
  slotsUsed: number;
  slotsTotal: number;
}

export const events: AppEvent[] = [
  {
    id: 'castration-guatemala',
    category: 'Jornadas de Castración',
    title: 'Campaña de Esterilización',
    municipality: 'Guatemala',
    date: '15 de Julio, 2026',
    description: 'Servicio gratuito de esterilización para perros y gatos. Ayudemos a reducir la sobrepoblación animal de manera ética y segura.',
    slotsUsed: 12,
    slotsTotal: 30,
  },
  {
    id: 'vaccination-mixco',
    category: 'Jornadas de Vacunación',
    title: 'Vacunación Antirrábica',
    municipality: 'Mixco',
    date: '18 de Julio, 2026',
    description: 'Jornada gratuita de vacunación antirrábica y desparasitación básica para mascotas comunitarias y rescatadas.',
    slotsUsed: 0,
    slotsTotal: 0, // Not limited
  },
  {
    id: 'adoption-villanueva',
    category: 'Jornadas de Adopción',
    title: 'Festival de Adopción',
    municipality: 'Villa Nueva',
    date: '20 de Julio, 2026',
    description: '¡Ven a conocer a nuestros peluditos rescatados! Habrá música, comida, y lo más importante: perritos y gatitos listos para llenar tu vida de amor.',
    slotsUsed: 0,
    slotsTotal: 0,
  },
  {
    id: 'castration-petapa',
    category: 'Jornadas de Castración',
    title: 'Campaña de Esterilización',
    municipality: 'San Miguel Petapa',
    date: '22 de Julio, 2026',
    description: 'Un equipo de veterinarios voluntarios estará brindando cirugías seguras de esterilización a bajo costo o gratuitas para casos de necesidad.',
    slotsUsed: 25,
    slotsTotal: 25,
  },
  {
    id: 'vaccination-guatemala',
    category: 'Jornadas de Vacunación',
    title: 'Campaña de Salud Preventiva',
    municipality: 'Guatemala (Zona 6)',
    date: '25 de Julio, 2026',
    description: 'Aplicación de vacunas múltiples y evaluación general de mascotas. Asegúrate de que tu compañero esté protegido contra las enfermedades más comunes.',
    slotsUsed: 0,
    slotsTotal: 0,
  }
];
