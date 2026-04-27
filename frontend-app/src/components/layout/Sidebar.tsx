import React from 'react';
import { LayoutGrid, FileSearch2, CalendarDays, FileSignature, ShieldCheck, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSargentoDiaAtual } from '../../features/dashboard/hooks/useSargentoDiaAtual';

// Tipagem simples para os itens de menu
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string
  active?: boolean;
}

// Componente auxiliar para um item de navegação
const NavItem: React.FC<NavItemProps> = ({ icon, label, active, to }) => (
  <Link
    to={to}
    className={`
      flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium transition-colors duration-150
      ${active 
        ? 'bg-blue-600 text-white shadow-md' // Item Ativo
        : 'text-slate-300 hover:bg-slate-800 hover:text-white' // Estilo normal
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export const Sidebar = () => {
  const location = useLocation()
  const { data: sgtDia } = useSargentoDiaAtual()
  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-950 p-6 text-white fixed left-0 top-0 z-40">
      {/* 1. Logo/Nome do Sistema (Topo) */}
      <div className="mb-10 flex items-center gap-3 border-b border-slate-800 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-inner">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Sistema</h1>
          <p className="text-sm text-slate-400">Administrativo</p>
        </div>
      </div>

      {/* 2. Navegação Principal */}
      <nav className="flex flex-col gap-3">
        <NavItem to='/dashboard' icon={<LayoutGrid className="h-6 w-6" />} label="Dashboard" active={location.pathname === '/dashboard'} />
        <NavItem to='/alteracoes' icon={<FileSearch2 className="h-6 w-6" />} label="Alterações" active={location.pathname === '/alteracoes'}/>
        <NavItem to='/escala' icon={<CalendarDays className="h-6 w-6" />} label="Escala" active={location.pathname === '/escala'}/>
        <NavItem to='/sped' icon={<FileSignature className="h-6 w-6" />} label="SPED" active={location.pathname === '/sped'}/>
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xl font-bold">
            {sgtDia?.nomeGuerra?.[0] ?? "?"}
          </div>
          <div>
            <p className="font-semibold text-white">{sgtDia?.nomeGuerra}</p>
            <p className="text-sm text-slate-400">{sgtDia?.curso}</p>
          </div>
        </div>
        <NavItem to= "/login" icon={<LogOut className="h-6 w-6" />} label="Sair do Sistema" />
      </div>
    </aside>
  );
};