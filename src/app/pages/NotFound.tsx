import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';

// Con el fallback del SPA (.htaccess / nginx) cualquier URL carga la app: sin esta ruta
// una dirección mal escrita mostraría una página en blanco.
export function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-white">
        <div className="text-5xl mb-4" aria-hidden="true">🐾</div>
        <h1 className="text-[#222222] text-2xl md:text-3xl font-bold mb-2">Página no encontrada</h1>
        <p className="text-[#222222]/60 text-sm md:text-base max-w-md mb-6">
          La dirección que buscás no existe o cambió. Volvé al inicio para seguir explorando.
        </p>
        <Link to="/home">
          <PrimaryButton variant="primary">Ir al inicio</PrimaryButton>
        </Link>
      </div>
    </Layout>
  );
}
