import { Bell, Lock, Globe, Palette } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';

export function AdminSettings() {
  const sections = [
    {
      icon: Bell,
      title: 'Notificaciones',
      subtitle: 'Gestiona tus preferencias de notificación',
      content: (
        <div className="space-y-2">
          {['Nuevas adopciones', 'Inscripciones a jornadas', 'Recordatorios de eventos'].map((label, i) => (
            <label key={label} className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-xl border border-transparent hover:border-[#D9D9D9]/50 cursor-pointer transition-all duration-250">
              <span className="text-[#222222] text-sm">{label}</span>
              <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 accent-[#20A83E]" />
            </label>
          ))}
        </div>
      )
    },
    {
      icon: Lock,
      title: 'Seguridad',
      subtitle: 'Opciones de seguridad de la cuenta',
      content: (
        <div className="space-y-2">
          {['Cambiar contraseña', 'Autenticación de dos factores', 'Dispositivos conectados'].map(label => (
            <button key={label} className="w-full text-left p-4 bg-[#F8F8F8] rounded-xl hover:bg-[#20A83E]/5 transition-all duration-250 text-[#222222] text-sm border border-transparent hover:border-[#20A83E]/20">
              {label}
            </button>
          ))}
        </div>
      )
    },
    {
      icon: Globe,
      title: 'Sitio Web',
      subtitle: 'Configuración del sitio público',
      content: (
        <div className="space-y-4">
          {[
            { label: 'Instagram', defaultValue: '@huellitasdelacalleong', type: 'text' },
            { label: 'Email de contacto', defaultValue: 'contacto@huellitas.org', type: 'email' },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-sm text-[#222222]/60 mb-2">{field.label}</label>
              <input
                type={field.type}
                defaultValue={field.defaultValue}
                className="w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#20A83E] transition-all duration-250 text-sm"
              />
            </div>
          ))}
        </div>
      )
    },
    {
      icon: Palette,
      title: 'Apariencia',
      subtitle: 'Personaliza la interfaz',
      content: (
        <div>
          <label className="block text-sm text-[#222222]/60 mb-2">Tema</label>
          <select className="w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#20A83E] transition-all duration-250 text-sm">
            <option>Claro</option>
            <option>Oscuro</option>
            <option>Automático</option>
          </select>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Configuración</h1>
        <p className="text-[#222222]/50">Ajustes del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sections.map(section => (
          <div key={section.title} className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#20A83E]/10 rounded-xl">
                <section.icon size={22} className="text-[#20A83E]" />
              </div>
              <div>
                <h2 className="text-[#222222] text-lg font-medium">{section.title}</h2>
                <p className="text-xs text-[#222222]/40">{section.subtitle}</p>
              </div>
            </div>
            {section.content}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <PrimaryButton variant="primary">Guardar Cambios</PrimaryButton>
      </div>
    </div>
  );
}
