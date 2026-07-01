import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Heart, Users, User, LogOut } from 'lucide-react';

export function AdminLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/events', label: 'Eventos', icon: Calendar },
    { path: '/admin/adoptions', label: 'Adopciones', icon: Heart },
    { path: '/admin/registrations', label: 'Inscripciones', icon: Users },
    { path: '/admin/profile', label: 'Perfil', icon: User }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      <aside className="w-64 bg-[#146B27] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#20A83E] border-2 border-white/30 flex items-center justify-center text-sm font-medium text-white">
              MG
            </div>
            <div>
              <div className="font-medium text-sm">Admin</div>
              <div className="text-xs text-white/60">Huellitas de la Calle</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-250 text-sm ${
                    isActive(item.path)
                      ? 'bg-white text-[#146B27] shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            to="/home"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-250 text-sm"
          >
            <LogOut size={18} />
            <span>Ir al Sitio Público</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
