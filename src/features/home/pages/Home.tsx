import { Link } from 'react-router';
import { Button } from '@/shared/components/ui/Button';

export function Home() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-10 text-white shadow">
      <h1 className="text-3xl font-bold sm:text-4xl">Bem-vindo à Loja</h1>
      <p className="mt-3 max-w-2xl text-brand-50">
        Descubra produtos selecionados, pague com Pix ou cartão e receba em casa.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/products">
          <Button variant="secondary">Ver produtos</Button>
        </Link>
      </div>
    </section>
  );
}
