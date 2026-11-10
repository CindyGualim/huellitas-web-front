import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Heart, Users, User, LogOut, Home, UserCog, Gift, Stethoscope, ClipboardList, Settings, FileText, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // En pantallas chicas el menú es un cajón que se abre con el botón de la barra superior.
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(part => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/events', label: 'Eventos', icon: Calendar },
    { path: '/admin/adoptions', label: 'Adopciones', icon: Heart },
    ...(user?.role === 'Superadministrador' || user?.role === 'Operador'
      ? [
          { path: '/admin/adoption-requests', label: 'Solicitudes', icon: ClipboardList },
          { path: '/admin/tracking', label: 'Seguimiento', icon: Stethoscope }
        ]
      : []),
    { path: '/admin/registrations', label: 'Inscripciones', icon: Users },
    { path: '/admin/profile', label: 'Perfil', icon: User },
    ...(user?.role === 'Superadministrador'
      ? [
          { path: '/admin/donations', label: 'Donaciones', icon: Gift },
          { path: '/admin/users', label: 'Usuarios', icon: UserCog },
          { path: '/admin/content', label: 'Contenido', icon: FileText },
          { path: '/admin/settings', label: 'Configuración', icon: Settings }
        ]
      : [])
  ];

  return (
    <div className="lg:flex min-h-screen bg-[#F8F8F8]">
      {/* Barra superior solo en teléfono/tablet */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-14 px-3 bg-[#146B27] text-white shadow-sm">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          aria-controls="admin-menu"
        >
          <Menu size={22} />
        </button>
        <span className="font-medium text-sm truncate">
          {menuItems.find(item => isActive(item.path))?.label ?? 'Panel'}
        </span>
      </header>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      <aside
        id="admin-menu"
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-[#146B27] text-white flex flex-col overflow-y-auto transform transition-transform duration-250 lg:static lg:z-auto lg:max-w-none lg:translate-x-0 lg:overflow-visible ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/10 relative">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="lg:hidden absolute top-3 right-3 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#20A83E] border-2 border-white/30 flex items-center justify-center text-sm font-medium text-white">
              {initials}
            </div>
            <div>
              <div className="font-medium text-sm">{user?.name}</div>
              <div className="text-xs text-white/60">{user?.role}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
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

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            to="/home"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-250 text-sm"
          >
            <Home size={18} />
            <span>Ir al Sitio Público</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-250 text-sm cursor-pointer"
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* min-w-0 evita que tablas o tarjetas anchas desborden la pantalla; en teléfono se reduce
          el padding p-8 que usan las páginas del panel. */}
      <main className="flex-1 min-w-0 max-sm:[&>div]:px-4! max-sm:[&>div]:py-5!">
        <Outlet />
      </main>
    </div>
  );
}
