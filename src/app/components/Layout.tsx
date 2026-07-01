import { ReactNode, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';
import logoImg from '../../imports/huellitaslogo.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export function Layout({ children, showNavbar = true }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
          <div className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-300 flex items-center justify-between ${isScrolled ? 'py-2 flex-row' : 'py-4 flex-col md:flex-row gap-6 relative'}`}>
            
            <Link to="/home" className={`flex items-center transition-all duration-300 ${isScrolled ? 'flex-row gap-3' : 'flex-col gap-2'}`}>
              <img 
                src={logoImg} 
                alt="Huellitas de la Calle" 
                className={`object-contain transition-all duration-300 ease-in-out ${isScrolled ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-28 w-28 sm:h-36 sm:w-36'}`} 
              />
              <div className={`flex flex-col transition-all duration-300 ${isScrolled ? 'items-start' : 'items-center'}`}>
                <div className={`text-[#222222] font-bold transition-all duration-300 ${isScrolled ? 'text-lg sm:text-xl text-left' : 'text-2xl sm:text-3xl text-center'}`} style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Huellitas de la Calle
                </div>
                <div className={`text-[#146B27] font-medium transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0 mt-0 text-[0px]' : 'max-h-12 opacity-100 mt-1 text-sm sm:text-base text-center'}`}>
                  El respeto animal es nuestra pasión
                </div>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`text-[#222222] p-2 hover:bg-[#D9D9D9]/40 rounded-lg md:hidden transition-all duration-300 active:scale-95 ${isScrolled ? 'block' : 'absolute right-4 top-6'}`}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className={`text-[#222222]/80 hover:text-[#20A83E] transition-all duration-300 font-medium ${isScrolled ? 'text-base' : 'text-lg'}`}>
                Nosotros
              </Link>
              <Link to="/adoptions" className={`text-[#222222]/80 hover:text-[#20A83E] transition-all duration-300 font-medium ${isScrolled ? 'text-base' : 'text-lg'}`}>
                Adopciones
              </Link>
              <Link to="/events" className={`text-[#222222]/80 hover:text-[#20A83E] transition-all duration-300 font-medium ${isScrolled ? 'text-base' : 'text-lg'}`}>
                Eventos
              </Link>
              <Link
                to="/help"
                className={`bg-[#20A83E] text-white rounded-full font-medium hover:bg-[#146B27] transition-all duration-300 active:scale-95 ${isScrolled ? 'px-5 py-2 text-sm' : 'px-6 py-2.5 text-lg'}`}
              >
                Quiero Ayudar
              </Link>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-[#D9D9D9] shadow-inner absolute w-full left-0">
              <div className="flex flex-col px-4 py-3 gap-1">
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

      <footer className="bg-[#146B27] mt-auto py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="bg-white inline-flex p-3 rounded-2xl mb-4">
                <ImageWithFallback src={logoImg} alt="Huellitas" className="h-16 w-16 object-contain" />
              </div>
              <div className="text-white text-xl font-bold mb-1">Huellitas de la Calle</div>
              <p className="text-white/80 text-sm">El respeto animal es nuestra pasión</p>
            </div>
            <div>
              <h3 className="mb-4 text-white font-semibold tracking-wider">Explora</h3>
              <div className="flex flex-col gap-3">
                <Link to="/about" className="text-white/80 hover:text-white transition-colors duration-250">Nosotros</Link>
                <Link to="/adoptions" className="text-white/80 hover:text-white transition-colors duration-250">Adopciones</Link>
                <Link to="/events" className="text-white/80 hover:text-white transition-colors duration-250">Eventos</Link>
                <Link to="/help" className="text-white/80 hover:text-white transition-colors duration-250">Quiero Ayudar</Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-white font-semibold tracking-wider">Síguenos</h3>
              <a
                href="https://www.instagram.com/huellitasdelacalleong/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-250"
              >
                <Instagram size={20} />
                @huellitasdelacalleong
              </a>
            </div>
            <div>
              <h3 className="mb-4 text-white font-semibold tracking-wider">Contacto</h3>
              <a href="https://wa.me/50212345678" className="text-white/80 hover:text-white transition-colors duration-250 block mb-6">
                +502 1234-5678
              </a>
              <Link to="/admin" className="text-white/40 hover:text-white/60 text-sm transition-colors duration-250">
                Panel de Administración
              </Link>
            </div>
          </div>
          <div className="text-center text-white/50 text-sm border-t border-white/20 pt-8">
            © 2026 Huellitas de la Calle Guatemala
          </div>
        </div>
      </footer>
    </div>
  );
}