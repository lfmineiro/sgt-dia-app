import { Eye, Lock, LogIn, User } from 'lucide-react'
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  const navigate = useNavigate()

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

        <form className="space-y-9">

              <Input
                label='Email'
                type="email"
                name="email"
                placeholder="seu.email@exemplo.com"
                iconLeft = {<User />}
              />

              <Input
                label="password"
                type="password"
                name="password"
                placeholder="Digite sua senha"
                iconLeft = {<Lock />}
                iconRight = {
                  <button
                type="button"
                aria-label="Mostrar ou ocultar senha"
              >
                <Eye className="h-8 w-8" />
              </button>
                }
              />  
          
          <div className="text-center">
            <a href="#" className="text-xl text-blue-600 hover:text-blue-800 hover:underline">Esqueceu sua senha?</a>
          </div>

          <Button
            type="submit"
            size='lg'
            className='w-full'
            rightIcon={<LogIn className='h-6 w-6' />}
            onClick={() => navigate('/dashboard')}
          >
            Entrar
          </Button>
        </form>

        <div className="my-12 border-b border-slate-200"></div>

        <div className="text-center text-xl text-slate-600">
          Ainda não tem conta? <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">Solicitar acesso</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage