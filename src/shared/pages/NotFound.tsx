import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-brand-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">Página não encontrada</h2>
      <p className="mt-2 text-gray-600">
        Ops! A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-md bg-brand-600 px-6 py-2 font-medium text-white hover:bg-brand-700"
      >
        Voltar para a Home
      </Link>
    </div>
  );
}