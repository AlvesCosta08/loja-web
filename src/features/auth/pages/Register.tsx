import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/api';
import { useAuthStore } from '@/features/auth/store';
import { Button } from '@/shared/components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo de 8 caracteres'),
});
type FormData = z.infer<typeof schema>;

export function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    try {
      await authApi.register(values);
      const { access_token } = await authApi.login({
        email: values.email,
        password: values.password,
      });
      localStorage.setItem('loja_token', access_token);
      
      const user = await authApi.me();
      setAuth(access_token, user);
      
      toast.success('Conta criada com sucesso!');
      navigate('/', { replace: true });
    } catch {
      setError('root', { message: 'Não foi possível concluir o cadastro. Verifique os dados.' });
    }
  };

  return (
    <div className="mx-auto max-w-md mt-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Criar conta</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl bg-white p-6 shadow-sm border border-gray-200">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
          <input
            {...register('name')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
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
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
        
        <p className="text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link to="/login" className="text-brand-600 hover:underline">Entrar</Link>
        </p>
      </form>
    </div>
  );
}