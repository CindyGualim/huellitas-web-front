import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import dogsImg from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__1_.jpeg';
import catsImg from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__2_.jpeg';
import othersImg from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__3_.jpeg';

export function Adoptions() {
  const categories = [
    {
      id: 'dogs',
      title: 'Perritos en Adopción',
      description: 'Encuentra a tu compañero más leal y fiel. Conoce a los perros que buscan una segunda oportunidad.',
      image: dogsImg,
      count: '4 disponibles'
    },
    {
      id: 'cats',
      title: 'Gatitos en Adopción',
      description: 'Dulces, independientes y llenos de amor. Descubre a los felinos que esperan por un hogar cálido.',
      image: catsImg,
      count: '1 disponible'
    },
    {
      id: 'others',
      title: 'Otras Mascotas',
      description: 'Conejos, aves y otros pequeños amigos que también necesitan amor y una familia que los cuide.',
      image: othersImg,
      count: '1 disponible'
    }
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-6 py-16 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#20A83E]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="mx-auto max-w-6xl relative z-10 text-center md:text-left">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">Adopta, no compres</h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Bríndale un hogar a uno de nuestros rescatados. Cada adopción salva una vida y deja espacio para rescatar a otro animal en necesidad.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 pb-24">
          <h2 className="text-[#222222] text-2xl font-bold mb-8 text-center md:text-left">¿A quién te gustaría adoptar?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/adoptions/${cat.id}`} className="group block">
                <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#D9D9D9]/50 transform hover:-translate-y-1.5 flex flex-col h-full">
                  <div className="relative h-56 md:h-64 overflow-hidden shrink-0">
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-xs font-medium">
                      {cat.count}
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h3 className="text-[#222222] text-2xl font-bold mb-3 group-hover:text-[#20A83E] transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="text-[#222222]/70 leading-relaxed mb-6 flex-1">
                      {cat.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-[#146B27] font-medium group-hover:text-[#20A83E] transition-colors duration-300 mt-auto">
                      Ver perfiles 
                      <ArrowRight size={18} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}