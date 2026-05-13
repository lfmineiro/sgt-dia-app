import { useState } from 'react';
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react'
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {

  const navigate = useNavigate()
  const { login, loading, error } = useAuth();
  const { isAuthenticated } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login({ usuario, senha });
      navigate('/dashboard');
    } catch {
      // O contexto já expõe uma mensagem em `error`.
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center bg-slate-100 h-screen">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-12 shadow-2xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-full bg-blue-500">
            <User className="h-16 w-16 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold text-slate-950">Bem-vindo ao Sistema</h1>
          <p className="text-2xl text-slate-600">Acesse sua conta para continuar</p>
        </div>

        <form className="space-y-9" onSubmit={handleSubmit}>

              <Input
                label='Usuário'
                type="text"
                name="usuario"
                placeholder="Digite seu usuário"
                iconLeft = {<User />}
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
              />

              <Input
                label="Senha"
                type={mostrarSenha ? 'text' : 'password'}
                name="password"
                placeholder="Digite sua senha"
                iconLeft = {<Lock />}
                iconRight = {
                  <button
                type="button"
                aria-label="Mostrar ou ocultar senha"
                onClick={() => setMostrarSenha((current) => !current)}
              >
                {mostrarSenha ? <EyeOff className="h-8 w-8" /> : <Eye className="h-8 w-8" />}
              </button>
                }
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
              />  

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <div className="text-center">
            <a href="#" className="text-xl text-blue-600 hover:text-blue-800 hover:underline">Esqueceu sua senha?</a>
          </div>

          <Button
            type="submit"
            size='lg'
            className='w-full'
            rightIcon={<LogIn className='h-6 w-6' />}
            isLoading={loading}
          >
            Entrar
          </Button>
        </form>

        <div className="my-12 border-b border-slate-200"></div>
      </div>
    </div>
  );
}

export default LoginPage