import { Check, Clock3, AlertTriangle, PlusCircle } from "lucide-react";
import { Button } from "../components/ui/Button"; 
import { useState } from "react";
import { ModalServico } from "../components/pages/Dashboard/ModalServico";

export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className="space-y-10">
      {/*  Quadro de Avisos */}
      <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
        {/* Header do bloco */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-950">Quadro de Avisos e Rotinas</h2>
          <Button variant="outline" size="md" leftIcon={<PlusCircle className="h-5 w-5" />} >
            Adicionar Aviso
          </Button>
        </div>
        
        {/* Alerta de Atenção - Isso vai virar uma componente talvez */}
        <div className="flex items-start gap-4 rounded-2xl bg-amber-50 p-6 border border-amber-200 mb-6">
            <AlertTriangle className="h-7 w-7 text-amber-600 mt-1 flex-shrink-0" />
            <div>
                <p className="text-lg font-semibold text-amber-900 leading-tight">Atenção</p>
                <p className="text-base text-amber-800">Todos os horários estão sujeitos a alterações. Verifique regularmente este quadro para atualizações.</p>
            </div>
        </div>

        <div className="space-y-4">
          <p className="text-xl p-5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-medium">
            Ceia 20:00 - 20:30
          </p>
        </div>
      </section>

      {/* Tabelas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        
        {/* Atividades Recentes */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-950 mb-8 border-b border-slate-100 pb-6">Atividades Recentes</h3>
          
          <div className="space-y-6">
            {/* CardAtividade - Check */}
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                <Check className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-950">Alteração Resolvida</p>
                <p className="text-base text-slate-500 flex items-center gap-2"><Clock3 className="h-4 w-4"/> Há 15 minutos</p>
              </div>
            </div>

            {/* CardAtividade - Alert*/}
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 opacity-80">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-inner">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-950">Nova alteração registrada</p>
                <p className="text-base text-slate-500 flex items-center gap-2"><Clock3 className="h-4 w-4"/> Há 1 hora</p>
              </div>
            </div>
          </div>
        </section>

        {/* Estatísticas */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-950 mb-8 border-b border-slate-100 pb-6">Estatísticas</h3>

          <div className="space-y-6 text-xl">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-700">Alterações Totais</p>
              <p className="font-extrabold text-slate-950 text-3xl">156</p>
            </div>
            
            {/* Essa Progress Bar talvez vire uma componente */}
            {/* <div className="w-full bg-slate-100 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{width: '94%'}}></div>
            </div> */}

              {/* Essas Cards vão virar componentes */}
            <div className="flex items-center justify-between mt-8">
              <p className="font-medium text-slate-700">Alterações 5º Piso</p>
              <p className="font-extrabold text-slate-950 text-3xl text-emerald-600">94</p>
            </div>
            
            <div className="flex items-center justify-between mt-8">
              <p className="font-medium text-slate-700">Alterações 4º Piso</p>
              <p className="font-extrabold text-slate-950 text-3xl text-red-600">12</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};