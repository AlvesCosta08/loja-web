import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/api';
import { useAuthStore } from '@/features/auth/store';
import { Button } from '@/shared/components/ui/Button';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Informe a senha'),
});
type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    try {
      const { access_token } = await authApi.login(values);
      localStorage.setItem('loja_token', access_token);
      
      const user = await authApi.me();
      setAuth(access_token, user);
      
      toast.success('Bem-vindo de volta!');
      navigate(from, { replace: true });
    } catch {
      setError('root', { message: 'Email ou senha inválidos.' });
    }
  };

  return (
    <div className="mx-auto max-w-md mt-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl bg-white p-6 shadow-sm border border-gray-200">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            {...register('password')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        
        {errors.root && (
          <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{errors.root.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
        
        <p className="text-center text-sm text-gray-600">
          Não tem conta?{' '}
          <Link to="/register" className="text-brand-600 hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}