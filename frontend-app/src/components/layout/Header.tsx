export const Header = () => {
  // Mais tarde isso virá da API, por enquanto é estático igual seu esboço
  const nomeSgtDia = "Al 4º Ano Fulano";
  const dataHoje = "Segunda-Feira, 23 De Fevereiro De 2026";

  return (
    <header className="bg-white border-b border-slate-100 p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950">
            Sgt Dia: <span className="text-blue-700">{nomeSgtDia}</span>
          </h1>
          <p className="mt-1 text-xl text-slate-600">
            {dataHoje}
          </      p>
        </div>
        
        {/* Espaço opcional para notificações ou busca, se quiser adicionar depois */}
      </div>
    </header>
  );
};