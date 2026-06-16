import { useEffect, useRef } from 'react';
import { useSpedPage } from '../hooks/useSpedPage';
import { SpedHeader } from '../components/pages/sped/SpedHeader';
import { SpedInfoCard } from '../components/pages/sped/SpedInfoCard';
import { SpedNotice } from '../components/pages/sped/SpedNotice';
import { SpedSections } from '../components/pages/sped/SpedSections';

export const SpedPage = () => {
  const generatedTextoRef = useRef<HTMLDivElement | null>(null);
  const {
    companhia,
    companhiaLabel,
    dataServicoFormatada,
    formData,
    handleChange,
    handleCopySped,
    handleSave,
    handleGenerate,
    isLoadingServicoAtual,
    isSubmitting,
    message,
    openSection,
    setCompanhia,
    statusLabel,
    servicoId,
    toggleSection,
    generatedTexto,
    aplicarTemplate,
  } = useSpedPage();

  useEffect(() => {
    if (!generatedTexto) return;

    generatedTextoRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [generatedTexto]);

  return (
    <div className="min-h-screen flex-1 bg-gray-50">
      <SpedHeader
        companhia={companhia}
        companhiaLabel={companhiaLabel}
        isLoading={isSubmitting}
        isLoadingServicoAtual={isLoadingServicoAtual}
        servicoId={servicoId}
        onCompanhiaChange={setCompanhia}
        onCopy={handleCopySped}
        onSave={handleSave}
        onGenerate={handleGenerate}
      />

      {message && (
        <div
          className={`mx-auto mt-4 max-w-5xl rounded-md border px-4 py-3 ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <main className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
        <SpedInfoCard
          dataServicoFormatada={dataServicoFormatada}
          companhiaLabel={companhiaLabel}
          statusLabel={statusLabel}
        />

        <SpedNotice />

        <SpedSections
          formData={formData}
          openSection={openSection}
          onToggleSection={toggleSection}
          onChange={handleChange}
          onQuickFill={aplicarTemplate}
        />
        {generatedTexto && (
          <div ref={generatedTextoRef} className="rounded-md border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold">Texto gerado</h2>
            <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">{generatedTexto}</pre>
          </div>
        )}
      </main>
    </div>
  );
};
