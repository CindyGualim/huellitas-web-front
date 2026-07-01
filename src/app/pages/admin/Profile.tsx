import { Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';

export function AdminProfile() {
  const adminInfo = {
    name: 'María García',
    email: 'admin@huellitas.org',
    phone: '+502 5555-0000',
    role: 'Administrador',
    location: 'Guatemala',
    joinDate: '2024-01-15',
    lastLogin: '2026-06-01 10:30 AM'
  };

  const infoRows = [
    { icon: Mail, label: 'Correo electrónico', value: adminInfo.email },
    { icon: Phone, label: 'Teléfono', value: adminInfo.phone },
    { icon: MapPin, label: 'Ubicación', value: adminInfo.location },
    { icon: Calendar, label: 'Miembro desde', value: adminInfo.joinDate },
  ];

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Mi Perfil</h1>
        <p className="text-[#222222]/50">Información de cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[16px] p-8 shadow-sm border border-[#D9D9D9]/50 mb-5">
            <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#D9D9D9]/40">
              <div className="w-20 h-20 rounded-full bg-[#20A83E] flex items-center justify-center text-2xl font-medium text-white">
                MG
              </div>
              <div>
                <h2 className="text-[#222222] mb-1 text-2xl">{adminInfo.name}</h2>
                <div className="flex items-center gap-2 text-[#222222]/50 text-sm">
                  <Shield size={14} />
                  <span>{adminInfo.role}</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {infoRows.map(row => (
                <div key={row.label} className="flex items-start gap-4">
                  <div className="p-3 bg-[#20A83E]/10 rounded-xl shrink-0">
                    <row.icon size={18} className="text-[#20A83E]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#222222]/40 mb-0.5">{row.label}</div>
                    <div className="text-[#222222] font-medium text-sm">{row.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#D9D9D9]/40">
              <PrimaryButton variant="primary">Editar Perfil</PrimaryButton>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
            <h3 className="text-[#222222] mb-4 text-lg font-medium">Información de Sesión</h3>
            <div>
              <div className="text-xs text-[#222222]/40 mb-1">Último inicio de sesión</div>
              <div className="text-sm text-[#222222]">{adminInfo.lastLogin}</div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
            <h3 className="text-[#222222] mb-4 text-lg font-medium">Configuración de Cuenta</h3>
            <div className="space-y-2">
              {['Cambiar contraseña', 'Notificaciones', 'Seguridad'].map(label => (
                <button
                  key={label}
                  className="w-full text-left px-4 py-3 bg-[#F8F8F8] rounded-xl hover:bg-[#20A83E]/5 transition-all duration-250 text-sm text-[#222222] border border-transparent hover:border-[#20A83E]/20"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
