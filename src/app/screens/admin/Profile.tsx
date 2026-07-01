import { Mail, Phone, Shield, User } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';

const adminData = {
  name: 'María González',
  email: 'maria.gonzalez@huellitas.org',
  phone: '+502 1234-5678',
  role: 'Administrador ONG',
  lastLogin: '2026-05-31 09:30 AM',
  status: 'Activo'
};

export function AdminProfile() {
  return (
    <div className="p-8">
      <h1 className="text-[#4A2E1F] mb-8 text-3xl">Mi Perfil</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#E7D7B1]/50 text-center">
            <div className="w-24 h-24 rounded-full bg-[#F4C542] flex items-center justify-center text-[#4A2E1F] font-bold text-3xl mx-auto mb-4">
              MG
            </div>
            <h2 className="text-[#4A2E1F] mb-1">{adminData.name}</h2>
            <p className="text-[#4A2E1F]/70 text-sm mb-4">{adminData.role}</p>
            <span className="inline-block bg-[#178C2E]/10 text-[#178C2E] px-3 py-1 rounded-full text-sm border border-[#178C2E]/20">
              {adminData.status}
            </span>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#E7D7B1]/50 mb-6">
            <h3 className="text-[#4A2E1F] mb-4 text-lg font-medium">Información de Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#FFF9F1] rounded-lg border border-[#E7D7B1]/50">
                <Mail className="text-[#178C2E]" size={20} />
                <div>
                  <div className="text-xs text-[#4A2E1F]/70">Email</div>
                  <div className="text-[#4A2E1F]">{adminData.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#FFF9F1] rounded-lg border border-[#E7D7B1]/50">
                <Phone className="text-[#178C2E]" size={20} />
                <div>
                  <div className="text-xs text-[#4A2E1F]/70">Teléfono</div>
                  <div className="text-[#4A2E1F]">{adminData.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#FFF9F1] rounded-lg border border-[#E7D7B1]/50">
                <Shield className="text-[#178C2E]" size={20} />
                <div>
                  <div className="text-xs text-[#4A2E1F]/70">Rol</div>
                  <div className="text-[#4A2E1F]">{adminData.role}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#E7D7B1]/50 mb-6">
            <h3 className="text-[#4A2E1F] mb-4 text-lg font-medium">Sesión</h3>
            <div className="flex items-center gap-3 p-3 bg-[#FFF9F1] rounded-lg border border-[#E7D7B1]/50">
              <User className="text-[#178C2E]" size={20} />
              <div>
                <div className="text-xs text-[#4A2E1F]/70">Último acceso</div>
                <div className="text-[#4A2E1F]">{adminData.lastLogin}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#E7D7B1]/50">
            <h3 className="text-[#4A2E1F] mb-4 text-lg font-medium">Configuración de Cuenta</h3>
            <div className="space-y-3">
              <PrimaryButton variant="primary" fullWidth>
                Editar Perfil
              </PrimaryButton>
              <PrimaryButton variant="ghost" fullWidth>
                Cambiar Contraseña
              </PrimaryButton>
              <PrimaryButton variant="ghost" fullWidth>
                Preferencias de Notificaciones
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
