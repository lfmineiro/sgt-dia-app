interface EscalaHeaderProps {
  dataExtenso: string;
}

export const EscalaHeader = ({ dataExtenso }: EscalaHeaderProps) => {
  return (
    <header className="border-b border-slate-100 px-8 py-6">
      <h2 className="text-4xl font-bold text-slate-900">Gestao de Escala</h2>
      <p className="mt-1 text-lg capitalize text-slate-500">{dataExtenso}</p>
    </header>
  );
};