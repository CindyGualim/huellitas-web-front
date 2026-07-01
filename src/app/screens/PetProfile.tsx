import { useParams, Link } from 'react-router-dom';
import { Share2, ArrowLeft, Instagram } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';

const petsData: Record<string, any> = {
  '1': {
    name: 'Max',
    age: '2 años',
    size: 'Mediano',
    gender: 'Macho',
    temperament: 'Juguetón',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
    description: 'Max es un perrito muy alegre y lleno de energía. Le encanta jugar con pelotas y correr en el parque. Es muy sociable con otros perros y le fascina conocer gente nueva. Sería perfecto para una familia activa que le pueda dar mucho ejercicio y atención.'
  },
  '2': {
    name: 'Luna',
    age: '1 año',
    size: 'Pequeño',
    gender: 'Hembra',
    temperament: 'Cariñosa',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop',
    description: 'Luna es una cachorrita dulce y cariñosa. Le encanta acurrucarse y recibir mimos. Es muy tranquila y se adapta bien a espacios pequeños. Perfecta para alguien que busca una compañera fiel y amorosa.'
  },
  '3': {
    name: 'Rocky',
    age: '3 años',
    size: 'Grande',
    gender: 'Macho',
    temperament: 'Tranquilo',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&h=600&fit=crop',
    description: 'Rocky es un perro grande con un corazón aún más grande. A pesar de su tamaño, es muy gentil y tranquilo. Le gusta pasar el tiempo descansando cerca de su familia. Es excelente con niños y otros animales.'
  }
};

export function PetProfile() {
  const { id } = useParams<{ id: string }>();
  const pet = id ? petsData[id] : null;

  if (!pet) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-[#4A2E1F]">Perrito no encontrado</p>
        </div>
      </Layout>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    const message = `¡Conoce a ${pet.name}! Un perrito ${pet.temperament.toLowerCase()} buscando un hogar amoroso.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`, '_blank');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl">
        <Link to="/adoptions" className="flex items-center gap-2 text-[#178C2E] px-4 py-6 hover:text-[#136e24]">
          <ArrowLeft size={20} />
          <span className="font-medium">Volver a adopciones</span>
        </Link>

        <div className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-[#E7D7B1]/50 mb-8">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-[350px] md:h-[500px] object-cover"
          />
        </div>

        <div className="px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[#4A2E1F] text-3xl">{pet.name}</h1>
            <span className="bg-[#178C2E]/10 text-[#178C2E] px-4 py-2 rounded-lg font-medium border border-[#178C2E]/20">
              {pet.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <div className="bg-[#FFF9F1] px-4 py-2 rounded-md text-[#4A2E1F] border border-[#E7D7B1]">
              {pet.age}
            </div>
            <div className="bg-[#FFF9F1] px-4 py-2 rounded-md text-[#4A2E1F] border border-[#E7D7B1]">
              {pet.size}
            </div>
            <div className="bg-[#FFF9F1] px-4 py-2 rounded-md text-[#4A2E1F] border border-[#E7D7B1]">
              {pet.gender}
            </div>
            <div className="bg-[#FFF9F1] px-4 py-2 rounded-md text-[#4A2E1F] border border-[#E7D7B1]">
              {pet.temperament}
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-8 mb-6 shadow-sm border border-[#E7D7B1]/50">
            <h2 className="text-[#4A2E1F] mb-4 text-xl">Sobre {pet.name}</h2>
            <p className="text-[#4A2E1F]/80 leading-relaxed">{pet.description}</p>
          </div>

          <div className="bg-[#F4C542]/5 rounded-[16px] p-8 mb-8 border border-[#F4C542]/20">
            <h2 className="text-[#4A2E1F] mb-3 text-xl">Proceso de Adopción</h2>
            <p className="text-[#4A2E1F]/80 leading-relaxed mb-4">
              Completa el formulario de adopción y nos pondremos en contacto contigo
              para coordinar una visita. Queremos asegurarnos de que sea el mejor
              hogar para {pet.name}.
            </p>
          </div>

          <div className="bg-white rounded-[16px] p-6 mb-8 shadow-sm border border-[#E7D7B1]/50">
            <h3 className="text-[#4A2E1F] mb-4 text-lg font-medium">Compartir</h3>
            <div className="flex gap-3">
              <PrimaryButton
                variant="ghost"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 flex-1"
              >
                <Share2 size={20} />
                WhatsApp
              </PrimaryButton>
              <a
                href="https://www.instagram.com/huellitasdelacalleong/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <PrimaryButton
                  variant="ghost"
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  <Instagram size={20} />
                  Instagram
                </PrimaryButton>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/adoption-request" state={{ petId: id }} className="flex-1">
              <PrimaryButton variant="primary" fullWidth>
                Solicitar adopción
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
