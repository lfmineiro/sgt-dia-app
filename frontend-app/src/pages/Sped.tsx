import React, { useState } from 'react';
import { ArrowLeft, Copy, Calendar, Info, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Accordion = ({ title, isOpen, onClick, children }: AccordionProps) => {
  return (
    <div className="border border-gray-200 rounded-lg bg-white mb-4 overflow-hidden">
      <button
        type="button"
        onClick={onClick}
        className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        {isOpen ? <ChevronUp className="text-gray-500" size={20} /> : <ChevronDown className="text-gray-500" size={20} />}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex flex-col gap-6">
          {children}
        </div>
      )}
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField = ({ label, id, placeholder, value, onChange }: TextAreaFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      id={id}
      name={id}
      rows={4}
      value={value}
      onChange={onChange}
      placeholder={placeholder || "S/A"}
      className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
    />
  </div>
);

export const SpedPage = () => {
  const [openSection, setOpenSection] = useState<string | null>('assuncao');

  const [formData, setFormData] = useState({
    recebimento: '',
    passagem: '',
    armamento: '',
    punidos: '',
    visitaMedica: '',
    alunosDispensa: '',
    materialCarga: '',
    refeicoes: '',
    ronda: '',
    revistaRecolher: '',
    ocorrencias: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopySped = () => {
    // Aqui entrará a lógica de requisição GET /texto e navigator.clipboard na Fase 4
    alert("Função de copiar SPED será integrada com a API!");
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* HEADER DA PÁGINA */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Detalhes do SPED</h1>
        </div>
        <button 
          onClick={handleCopySped}
          className="flex items-center gap-2 text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-md transition-colors"
        >
          <Copy size={20} />
          <span>Copiar SPED</span>
        </button>
      </header>

      <main className="p-8 max-w-5xl mx-auto flex flex-col gap-6">
        
        {/* CARD DE CABEÇALHO (INFO DO SERVIÇO) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-start">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
              <Calendar className="text-blue-500" size={20} />
              <span>19 de Fevereiro de 2026</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock size={18} />
              <span>Companhia: 1ª Cia</span>
            </div>
          </div>
          <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
            Em Andamento
          </span>
        </div>

        {/* BANNER INFORMATIVO */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-blue-800">
            O <strong>Item 2 (Guarnição)</strong> e o <strong>Item 11 (Instalações)</strong> são gerados automaticamente pelo sistema com base nas escalas e alterações registradas.
          </p>
        </div>

        {/* FORMULÁRIO / ACCORDIONS */}
        <div className="flex flex-col gap-4 mt-2">
          
          {/* SEÇÃO 1: Assunção e Passagem */}
          <Accordion 
            title="Assunção e Passagem" 
            isOpen={openSection === 'assuncao'} 
            onClick={() => toggleSection('assuncao')}
          >
            <TextAreaField 
              label="1. Recebimento do serviço" 
              id="recebimento" 
              value={formData.recebimento} 
              onChange={handleChange} 
            />
            <TextAreaField 
              label="13. Passagem de serviço" 
              id="passagem" 
              value={formData.passagem} 
              onChange={handleChange} 
            />
          </Accordion>

          {/* SEÇÃO 2: Armamento e Pessoal */}
          <Accordion 
            title="Armamento e Pessoal" 
            isOpen={openSection === 'armamento'} 
            onClick={() => toggleSection('armamento')}
          >
            <TextAreaField label="3. Armamento" id="armamento" value={formData.armamento} onChange={handleChange} />
            <TextAreaField label="4. Punidos 1ª Cia" id="punidos" value={formData.punidos} onChange={handleChange} />
            <TextAreaField label="6. Visita médica fora do horário de expediente" id="visitaMedica" value={formData.visitaMedica} onChange={handleChange} />
            <TextAreaField label="7. Alunos com dispensa" id="alunosDispensa" value={formData.alunosDispensa} onChange={handleChange} />
          </Accordion>

          {/* SEÇÃO 3: Rotina e Instalações */}
          <Accordion 
            title="Rotina e Instalações" 
            isOpen={openSection === 'rotina'} 
            onClick={() => toggleSection('rotina')}
          >
            <TextAreaField label="5. Material carga" id="materialCarga" value={formData.materialCarga} onChange={handleChange} />
            <TextAreaField label="8. Refeições" id="refeicoes" value={formData.refeicoes} onChange={handleChange} />
            <TextAreaField label="9. Ronda" id="ronda" value={formData.ronda} onChange={handleChange} />
            <TextAreaField label="10. Revista do recolher" id="revistaRecolher" value={formData.revistaRecolher} onChange={handleChange} />
            <TextAreaField label="12. Ocorrências" id="ocorrencias" value={formData.ocorrencias} onChange={handleChange} />
          </Accordion>

        </div>
      </main>
    </div>
  );
}