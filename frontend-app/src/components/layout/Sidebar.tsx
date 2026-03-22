import React from 'react';
import { LayoutGrid, FileSearch2, CalendarDays, FileSignature, ShieldCheck, LogOut } from 'lucide-react';

// Tipagem simples para os itens de menu
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

// Componente auxiliar para um item de navegação
const NavItem: React.FC<NavItemProps> = ({ icon, label, active }) => (
  <a
    href="#"
    className={`
      flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium transition-colors duration-150
      ${active 
        ? 'bg-blue-600 text-white shadow-md' // Estilo item ativo (igual imagem 1)
        : 'text-slate-300 hover:bg-slate-800 hover:text-white' // Estilo normal/hover
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </a>
);

export const Sidebar = () => {
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

      {/* 2. Navegação Principal (Meio) */}
      <nav className="flex flex-col gap-3">
        <NavItem icon={<LayoutGrid className="h-6 w-6" />} label="Dashboard" active />
        <NavItem icon={<FileSearch2 className="h-6 w-6" />} label="Alterações" />
        <NavItem icon={<CalendarDays className="h-6 w-6" />} label="Escala" />
        <NavItem icon={<FileSignature className="h-6 w-6" />} label="SPED" />
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xl font-bold">
            SF
          </div>
          <div>
            <p className="font-semibold text-white">Sgt Fulano</p>
            <p className="text-sm text-slate-400">Administrador</p>
          </div>
        </div>
        <NavItem icon={<LogOut className="h-6 w-6" />} label="Sair do Sistema" />
      </div>
    </aside>
  );
};