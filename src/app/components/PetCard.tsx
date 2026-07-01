import { Link } from 'react-router-dom';
import { PrimaryButton } from './PrimaryButton';

interface Pet {
  id: string;
  name: string;
  age: string;
  size: string;
  temperament: string;
  image: string;
}

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <div className="bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-250 border border-[#E7D7B1]/50 transform hover:scale-[1.02] group">
      <div className="overflow-hidden">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-56 object-cover transition-transform duration-250 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-[#4A2E1F] mb-4 text-xl">{pet.name}</h3>
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="bg-[#FFF9F1] text-[#4A2E1F] px-3 py-1.5 rounded-md text-xs border border-[#E7D7B1] transition-colors duration-250 hover:bg-[#E7D7B1]">
            {pet.age}
          </span>
          <span className="bg-[#FFF9F1] text-[#4A2E1F] px-3 py-1.5 rounded-md text-xs border border-[#E7D7B1] transition-colors duration-250 hover:bg-[#E7D7B1]">
            {pet.size}
          </span>
          <span className="bg-[#FFF9F1] text-[#4A2E1F] px-3 py-1.5 rounded-md text-xs border border-[#E7D7B1] transition-colors duration-250 hover:bg-[#E7D7B1]">
            {pet.temperament}
          </span>
        </div>
        <Link to={`/adoptions/${pet.id}`}>
          <PrimaryButton variant="primary" fullWidth>
            Ver perfil
          </PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
