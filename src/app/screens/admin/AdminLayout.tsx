import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Heart, Users, User, LayoutDashboard } from 'lucide-react';
import logoImg from '../../../imports/huellitaslogo.png';

const adminData = {
  name: 'María González',
  role: 'Administrador ONG'
};

export function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/events', label: 'Jornadas de Castración', icon: Calendar },
    { path: '/admin/adoptions', label: 'Adopciones', icon: Heart },
    { path: '/admin/registrations', label: 'Inscritos', icon: Users },
    { path: '/admin/profile', label: 'Mi Perfil', icon: User },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-[#FFF9F1]">
      <aside className="w-64 bg-[#178C2E] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/home">
            <img src={logoImg} alt="Huellitas" className="h-16 w-16 mx-auto mb-2" />
          </Link>
          <h2 className="text-center">Admin Panel</h2>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-full bg-[#F4C542] flex items-center justify-center text-[#4A2E1F] font-semibold">
              MG
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-medium">{adminData.name}</div>
              <div className="text-xs text-white/70">{adminData.role}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-250 mb-2 ${
                  isActive(item.path)
                    ? 'bg-white text-[#178C2E]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            to="/home"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-250 text-white hover:bg-white/10 border border-white/20"
          >
            <span className="text-sm">Ir al Sitio Público</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
