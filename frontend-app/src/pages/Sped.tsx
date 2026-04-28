import { useSpedPage } from '../hooks/useSpedPage';
import { SpedHeader } from '../components/pages/sped/SpedHeader';
import { SpedInfoCard } from '../components/pages/sped/SpedInfoCard';
import { SpedNotice } from '../components/pages/sped/SpedNotice';
import { SpedSections } from '../components/pages/sped/SpedSections';

export const SpedPage = () => {
  const {
    companhia,
    companhiaLabel,
    dataServicoFormatada,
    formData,
    handleChange,
    handleCopySped,
    isLoadingServicoAtual,
    isSubmitting,
    message,
    openSection,
    setCompanhia,
    statusLabel,
    servicoId,
    toggleSection,
  } = useSpedPage();

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
        />
      </main>
    </div>
  );
};
