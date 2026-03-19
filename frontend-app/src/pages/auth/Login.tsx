import { Eye, Lock, LogIn, User } from 'lucide-react'

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-12 shadow-2xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-full bg-blue-500">
            <User className="h-16 w-16 text-white" />
          </div>
          <h1 className="mb-4 text-5xl font-extrabold text-slate-950">Bem-vindo ao Sistema</h1>
          <p className="text-2xl text-slate-600">Acesse sua conta para continuar</p>
        </div>

        <form className="space-y-9">
          <div>
            <label htmlFor="email" className="mb-3 block text-xl font-medium text-slate-900">Email</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 h-8 w-8 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="seu.email@exemplo.com"
                className="w-full rounded-2xl border-2 border-slate-300 py-6 pl-16 pr-6 text-xl placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 focus:ring-offset-0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-3 block text-xl font-medium text-slate-900">Senha</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 h-8 w-8 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Digite sua senha"
                className="w-full rounded-2xl border-2 border-slate-300 py-6 pl-16 pr-16 text-xl placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 focus:ring-offset-0"
              />
              <button
                type="button"
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Mostrar ou ocultar senha"
              >
                <Eye className="h-8 w-8" />
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <a href="#" className="text-xl text-blue-600 hover:text-blue-800 hover:underline">Esqueceu sua senha?</a>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-6 text-2xl font-semibold text-white transition duration-150 hover:bg-blue-700"
          >
            Entrar
            <LogIn className="h-8 w-8" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-12 border-b border-slate-200"></div>

        {/* Footer Text */}
        <div className="text-center text-xl text-slate-600">
          Ainda não tem conta? <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">Solicitar acesso</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage