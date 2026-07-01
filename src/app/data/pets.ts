import algodMessiImg from '../../imports/WhatsApp_Image_2026-06-16_at_3.01.12_PM__3_-1.jpeg';
import pelucheYamalImg from '../../imports/WhatsApp_Image_2026-06-16_at_3.01.12_PM__2_-1.jpeg';
import princesaJRImg from '../../imports/WhatsApp_Image_2026-06-16_at_3.01.12_PM__1_-1.jpeg';
import rockyRonaldoImg from '../../imports/WhatsApp_Image_2026-06-16_at_3.01.12_PM-1.jpeg';
import cat1Img from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__2_.jpeg';
import other1Img from '../../imports/WhatsApp_Image_2026-06-16_at_3.21.02_PM__3_.jpeg';

export interface Pet {
  id: string;
  name: string;
  species: 'Perro' | 'Gato' | 'Otra';
  age: string;
  weight: string;
  size: 'Pequeño' | 'Mediano' | 'Grande';
  gender: 'Macho' | 'Hembra';
  temperament: string;
  traits: string[];
  status: 'Disponible' | 'En proceso' | 'Adoptado';
  image: string;
  rescueStory: string;
  health: string[];
  needs: string[];
}

export const pets: Pet[] = [
  {
    id: 'algodon-messi',
    name: 'Algodón Messi',
    species: 'Perro',
    age: '2 años',
    weight: '23 libras',
    size: 'Mediano',
    gender: 'Macho',
    temperament: 'Noble, Guerrero y Leal. Siempre protector.',
    traits: ['Noble', 'Guerrero', 'Leal'],
    status: 'Disponible',
    image: algodMessiImg,
    rescueStory:
      'Algodón Messi fue rescatado de las calles de la zona 3 de Guatemala Ciudad. A pesar de sus días difíciles en la calle, su espíritu noble y guerrero nunca se quebró. Lleva ese nombre porque, como el gran campeón, nunca se rinde y siempre da lo mejor.',
    health: ['Vacunado al día', 'Desparasitado', 'Esterilizado', 'Revisado por veterinario'],
    needs: ['Concentrado', 'Tratamiento médico preventivo', 'Medicamentos desparasitantes', 'Hogar temporal'],
  },
  {
    id: 'peluche-yamal',
    name: 'Peluche Yamal',
    species: 'Perro',
    age: '3 meses',
    weight: '6 libras',
    size: 'Pequeño',
    gender: 'Macho',
    temperament: 'Muy juguetón, cariñoso y lleno de energía.',
    traits: ['Noble', 'Cariñoso', 'Juguetón'],
    status: 'Disponible',
    image: pelucheYamalImg,
    rescueStory:
      'Este pequeño campeón fue encontrado solo en Mixco cuando apenas tenía semanas de vida. Tierno como un peluche y talentoso como Yamal, este cachorrito llegó para robar corazones. Le encanta jugar y nunca falta con sus abrazos.',
    health: ['Vacunas iniciales', 'Desparasitado', 'Control veterinario mensual', 'Examen completo'],
    needs: ['Hogar temporal', 'Concentrado para cachorro', 'Medicamentos pediátricos', 'Arena o pads de entrenamiento'],
  },
  {
    id: 'princesa-jr',
    name: 'Princesa JR',
    species: 'Perro',
    age: '1.5 años',
    weight: '14 libras',
    size: 'Mediano',
    gender: 'Hembra',
    temperament: 'Sociable, paciente y luchadora.',
    traits: ['Sociable', 'Luchadora', 'Valiente'],
    status: 'Disponible',
    image: princesaJRImg,
    rescueStory:
      'Princesa JR llegó a nosotros desde Villa Nueva, donde sobrevivió en condiciones muy difíciles. Como toda guerrera, superó cada obstáculo con una sonrisa. Es sociable con otros perros y adora la compañía de personas de todas las edades.',
    health: ['Vacunada al día', 'Desparasitada', 'Esterilizada', 'Chequeo dental realizado'],
    needs: ['Concentrado', 'Tratamiento médico', 'Hogar temporal'],
  },
  {
    id: 'rocky-ronaldo',
    name: 'Rocky Ronaldo',
    species: 'Perro',
    age: '4 años',
    weight: '45 libras',
    size: 'Grande',
    gender: 'Macho',
    temperament: 'Protector, calmado en casa y leal.',
    traits: ['Guerrero', 'Leal', 'Protector'],
    status: 'Disponible',
    image: rockyRonaldoImg,
    rescueStory:
      'Rocky Ronaldo es el más grande de nuestra familia, rescatado de la zona 6 donde vivía en las calles desde pequeño. Con la lealtad de un campeón y la fuerza de un luchador, Rocky solo necesita una familia que le dé el hogar que siempre mereció.',
    health: ['Vacunado al día', 'Desparasitado', 'Esterilizado', 'Control articular realizado'],
    needs: ['Medicamentos articulares', 'Concentrado adulto', 'Apadrinamiento de paseos'],
  },
  {
    id: 'luna-michi',
    name: 'Luna',
    species: 'Gato',
    age: '1 año',
    weight: '8 libras',
    size: 'Pequeño',
    gender: 'Hembra',
    temperament: 'Independiente pero muy cariñosa por las noches.',
    traits: ['Curiosa', 'Tranquila', 'Cazadora'],
    status: 'Disponible',
    image: cat1Img,
    rescueStory:
      'Luna fue encontrada en un techo en época de lluvias. Muy asustada al principio, poco a poco fue ganando confianza hasta convertirse en la gata más ronroneadora del refugio.',
    health: ['Vacunada', 'Esterilizada', 'Negativa a leucemia felina'],
    needs: ['Arena sanitaria', 'Concentrado para gato', 'Hogar temporal seguro'],
  },
  {
    id: 'conejo-tambor',
    name: 'Tambor',
    species: 'Otra',
    age: '6 meses',
    weight: '3 libras',
    size: 'Pequeño',
    gender: 'Macho',
    temperament: 'Tímido, curioso y saltarín.',
    traits: ['Silencioso', 'Suave', 'Tragón'],
    status: 'Disponible',
    image: other1Img,
    rescueStory:
      'Tambor fue dejado en una caja cerca de una veterinaria local. Necesita un espacio adecuado para saltar y ser feliz fuera de jaulas convencionales.',
    health: ['Desparasitado', 'Control de dientes sanos', 'Dieta especial iniciada'],
    needs: ['Heno', 'Verduras frescas', 'Tratamiento médico preventivo'],
  }
];

export function getPetById(id: string): Pet | undefined {
  return pets.find(p => p.id === id);
}