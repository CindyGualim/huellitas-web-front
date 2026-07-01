import { Link } from 'react-router-dom';
import { PawPrint, Heart, Calendar, Instagram } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { PetCard } from '../components/PetCard';
import { InstagramSection } from '../components/InstagramSection';
import logoImg from '../../imports/huellitaslogo.png';

const featuredPets = [
  {
    id: '1',
    name: 'Max',
    age: '2 años',
    size: 'Mediano',
    temperament: 'Juguetón',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'Luna',
    age: '1 año',
    size: 'Pequeño',
    temperament: 'Cariñosa',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Rocky',
    age: '3 años',
    size: 'Grande',
    temperament: 'Tranquilo',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop'
  }
];

export function Home() {
  return (
    <Layout>
      <div className="pb-16">
        <div className="bg-gradient-to-br from-[#4A2E1F] via-[#5a3725] to-[#4A2E1F] text-white px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-5 text-3xl md:text-5xl text-[#FFF9F1]">Dale un hogar a quien más lo necesita</h1>
            <p className="text-lg md:text-xl mb-10 text-[#E7D7B1] max-w-2xl mx-auto">
              Rescatamos, cuidamos y conectamos mascotas con familias amorosas en Guatemala
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/adoptions">
                <PrimaryButton variant="primary" className="min-w-[220px]">
                  Ver adopciones
                </PrimaryButton>
              </Link>
              <Link to="/castration">
                <PrimaryButton variant="accent" className="min-w-[220px]">
                  Jornadas de castración
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 mt-16">
          <div className="mb-12">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-[#4A2E1F] text-2xl">Perritos buscando hogar</h2>
              <Link to="/adoptions" className="text-[#178C2E] hover:text-[#136e24] text-sm font-medium">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-8 md:p-12 shadow-sm border border-[#E7D7B1]/50 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-[#4A2E1F] mb-4 text-2xl">Próximas jornadas de castración</h2>
              <p className="text-[#4A2E1F]/80 mb-8">
                Ofrecemos servicios gratuitos de esterilización en diferentes municipios de Guatemala.
                Ayúdanos a controlar la población de animales en la calle.
              </p>
              <Link to="/castration">
                <PrimaryButton variant="primary">
                  Ver calendario y inscribir
                </PrimaryButton>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Link to="/about" className="group">
              <div className="bg-white rounded-[16px] p-8 text-center shadow-sm hover:shadow-md transition-all duration-250 border border-[#E7D7B1]/50 transform hover:scale-[1.02]">
                <PawPrint size={32} className="mx-auto mb-3 text-[#178C2E] transition-transform duration-250 group-hover:scale-110" />
                <h3 className="font-medium text-[#4A2E1F] group-hover:text-[#178C2E] transition-colors duration-250">Nosotros</h3>
                <p className="text-[#4A2E1F]/70 text-sm mt-2">Conoce nuestra misión</p>
              </div>
            </Link>
            <Link to="/adoptions" className="group">
              <div className="bg-white rounded-[16px] p-8 text-center shadow-sm hover:shadow-md transition-all duration-250 border border-[#E7D7B1]/50 transform hover:scale-[1.02]">
                <Heart size={32} className="mx-auto mb-3 text-[#178C2E] transition-transform duration-250 group-hover:scale-110" />
                <h3 className="font-medium text-[#4A2E1F] group-hover:text-[#178C2E] transition-colors duration-250">Adopciones</h3>
                <p className="text-[#4A2E1F]/70 text-sm mt-2">Encuentra tu compañero</p>
              </div>
            </Link>
            <Link to="/castration" className="group">
              <div className="bg-white rounded-[16px] p-8 text-center shadow-sm hover:shadow-md transition-all duration-250 border border-[#E7D7B1]/50 transform hover:scale-[1.02]">
                <Calendar size={32} className="mx-auto mb-3 text-[#178C2E] transition-transform duration-250 group-hover:scale-110" />
                <h3 className="font-medium text-[#4A2E1F] group-hover:text-[#178C2E] transition-colors duration-250">Castración</h3>
                <p className="text-[#4A2E1F]/70 text-sm mt-2">Servicio gratuito</p>
              </div>
            </Link>
          </div>

          <InstagramSection />
        </div>

        <footer className="bg-[#4A2E1F] mt-16 py-12 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-1">
                <img src={logoImg} alt="Huellitas" className="h-16 w-16 mb-3" />
                <p className="text-[#E7D7B1] text-sm">El respeto animal es nuestra pasión</p>
              </div>
              <div>
                <h3 className="mb-3 text-[#FFF9F1]">Explora</h3>
                <div className="flex flex-col gap-2">
                  <Link to="/about" className="text-[#E7D7B1] hover:text-[#F4C542] transition-colors text-sm">
                    Nosotros
                  </Link>
                  <Link to="/adoptions" className="text-[#E7D7B1] hover:text-[#F4C542] transition-colors text-sm">
                    Adopciones
                  </Link>
                  <Link to="/castration" className="text-[#E7D7B1] hover:text-[#F4C542] transition-colors text-sm">
                    Jornadas de Castración
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-[#FFF9F1]">Síguenos</h3>
                <a
                  href="https://www.instagram.com/huellitasdelacalleong/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#E7D7B1] hover:text-[#F4C542] transition-colors duration-250 text-sm"
                >
                  <Instagram size={18} />
                  @huellitasdelacalleong
                </a>
              </div>
              <div>
                <h3 className="mb-3 text-[#FFF9F1]">Contacto</h3>
                <a
                  href="https://wa.me/50212345678"
                  className="text-[#E7D7B1] hover:text-[#F4C542] transition-colors text-sm block"
                >
                  +502 1234-5678
                </a>
              </div>
            </div>
            <div className="text-center text-[#E7D7B1]/60 text-xs border-t border-white/10 pt-8">
              © 2026 Huellitas de la Calle Guatemala
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
