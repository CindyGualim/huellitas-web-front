import { ReactNode, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';
import logoImg from '../../imports/huellitaslogo.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useSiteSettings } from '../lib/useSiteSettings';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export function Layout({ children, showNavbar = true }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const settings = useSiteSettings();
  const instagramUrl = `https://www.instagram.com/${(settings?.instagramHandle ?? '@huellitasdelacalleong').replace(/^@/, '')}/`;
  const whatsappNumber = settings?.whatsappNumber ?? '50212345678';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {showNavbar && (
        <nav className={`sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md ${isScrolled ? 'shadow-md border-b border-[#D9D9D9]' : 'shadow-sm border-b border-[#D9D9D9]'}`}>
          <div className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-300 flex items-center justify-between gap-4 ${isScrolled ? 'py-2' : 'py-2.5'}`}>

            <Link to="/home" className="flex items-center flex-row gap-2.5">
              <img
                src={logoImg}
                alt="Huellitas de la Calle"
                className={`object-contain transition-all duration-300 ease-in-out ${isScrolled ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-11 w-11 sm:h-14 sm:w-14'}`}
              />
              <div className="flex flex-col items-start">
                <div className={`text-[#222222] font-bold transition-all duration-300 text-left ${isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`} style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Huellitas de la Calle
                </div>
                <div className={`text-[#146B27] font-medium transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0 mt-0 text-[0px]' : 'max-h-6 opacity-100 text-xs sm:text-sm'}`}>
                  El respeto animal es nuestra pasión
                </div>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#222222] p-2 hover:bg-[#D9D9D9]/40 rounded-lg md:hidden transition-all duration-300 active:scale-95"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/home" className="text-[#222222]/80 hover:text-[#20A83E] transition-all duration-300 font-medium text-sm">
                Inicio
              </Link>
              <Link to="/about" className="text-[#222222]/80 hover:text-[#20A83E] transition-all duration-300 font-medium text-sm">
                Nosotros
              </Link>
              <Link to="/adoptions" className="text-[#222222]/80 hover:text-[#20A83E] transition-all duration-300 font-medium text-sm">
                Adopciones
              </Link>
              <Link to="/events" className="text-[#222222]/80 hover:text-[#20A83E] transition-all duration-300 font-medium text-sm">
                Eventos
              </Link>
              <Link
                to="/help"
                className="bg-[#20A83E] text-white rounded-full font-medium hover:bg-[#146B27] transition-all duration-300 active:scale-95 px-4 py-1.5 text-sm"
              >
                Quiero Ayudar
              </Link>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-[#D9D9D9] shadow-inner absolute w-full left-0">
              <div className="flex flex-col px-4 py-3 gap-1">
                <Link
                  to="/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#222222] py-3 px-4 rounded-lg hover:bg-[#D9D9D9]/30 transition-all duration-250 text-lg font-medium"
                >
                  Inicio
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#222222] py-3 px-4 rounded-lg hover:bg-[#D9D9D9]/30 transition-all duration-250 text-lg font-medium"
                >
                  Nosotros
                </Link>
                <Link
                  to="/adoptions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#222222] py-3 px-4 rounded-lg hover:bg-[#D9D9D9]/30 transition-all duration-250 text-lg font-medium"
                >
                  Adopciones
                </Link>
                <Link
                  to="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#222222] py-3 px-4 rounded-lg hover:bg-[#D9D9D9]/30 transition-all duration-250 text-lg font-medium"
                >
                  Eventos
                </Link>
                <Link
                  to="/help"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#20A83E] py-3 px-4 rounded-lg hover:bg-[#D9D9D9]/30 transition-all duration-250 text-lg font-medium"
                >
                  Quiero Ayudar
                </Link>
              </div>
            </div>
          )}
        </nav>
      )}
      {children}

      <footer className="bg-[#146B27] mt-auto py-8 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6 mb-6 pb-6 border-b border-white/15">
            <div className="flex items-center gap-3 sm:col-span-1">
              <div className="bg-white inline-flex p-1.5 rounded-xl shrink-0">
                <ImageWithFallback src={logoImg} alt="Huellitas" className="h-9 w-9 object-contain" />
              </div>
              <div>
                <div className="text-white text-sm font-bold">Huellitas de la Calle</div>
                <p className="text-white/70 text-xs">El respeto animal es nuestra pasión</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-center sm:items-center text-sm">
              <Link to="/about" className="text-white/80 hover:text-white transition-colors duration-250">Nosotros</Link>
              <Link to="/adoptions" className="text-white/80 hover:text-white transition-colors duration-250">Adopciones</Link>
              <Link to="/events" className="text-white/80 hover:text-white transition-colors duration-250">Eventos</Link>
              <Link to="/help" className="text-white/80 hover:text-white transition-colors duration-250">Quiero Ayudar</Link>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end sm:items-center text-sm">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors duration-250"
              >
                <Instagram size={16} />
                {settings?.instagramHandle ?? '@huellitasdelacalleong'}
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} className="text-white/80 hover:text-white transition-colors duration-250">
                +{whatsappNumber}
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-white/50 text-xs">
            <span>© 2026 Huellitas de la Calle Guatemala</span>
            <Link to="/admin" className="hover:text-white/70 transition-colors duration-250">
              Panel de Administración
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}