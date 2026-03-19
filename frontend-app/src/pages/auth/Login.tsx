import React from 'react';

// Using common inline SVGs for icons. Replace with an icon library (e.g., lucide-react) for a real app.
const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const LockIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const EyeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const ShieldCheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 12 14 16 10"/></svg>
);

const LoginIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
);
const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-12 shadow-2xl">
        <div className="mb-12 text-center">
          {/* Top Shield Icon */}
          <div className="mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-full bg-blue-500">
            <ShieldCheckIcon className="h-16 w-16 text-white" />
          </div>
          <h1 className="mb-4 text-5xl font-extrabold text-slate-950">Bem-vindo ao Sistema</h1>
          <p className="text-2xl text-slate-600">Acesse sua conta para continuar</p>
        </div>

        <form className="space-y-9">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="mb-3 block text-xl font-medium text-slate-900">Email</label>
            <div className="relative">
              <UserIcon className="absolute left-6 top-1/2 h-8 w-8 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="seu.email@exemplo.com"
                className="w-full rounded-2xl border-2 border-slate-300 py-6 pl-16 pr-6 text-xl placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 focus:ring-offset-0"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="mb-3 block text-xl font-medium text-slate-900">Senha</label>
            <div className="relative">
              <LockIcon className="absolute left-6 top-1/2 h-8 w-8 -translate-y-1/2 text-slate-400" />
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
                <EyeIcon className="h-8 w-8" />
              </button>
            </div>
          </div>
          
          {/* Forgot Password Link */}
          <div className="text-center">
            <a href="#" className="text-xl text-blue-600 hover:text-blue-800 hover:underline">Esqueceu sua senha?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-6 text-2xl font-semibold text-white transition duration-150 hover:bg-blue-700"
          >
            Entrar
            <LoginIcon className="h-8 w-8" />
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