import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSargentoDiaAtual } from './useSargentoDiaAtual';
import { atualizarSped, obterSped, obterTextoSped } from '../services/sped.service';
import { INITIAL_SPED_FORM_STATE } from '../constants/sped';
import type { SpedCompany, SpedFormState, SpedMessage } from '../types/sped.types';

const SPED_QUERY_KEY = ['sped'];

const toOptionalText = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const cloneInitialFormState = (): SpedFormState => ({ ...INITIAL_SPED_FORM_STATE });

const mapSpedToFormState = (sped: {
  recebimento?: string | null;
  passagem?: string | null;
  armamento?: string | null;
  punidos?: string | null;
  visitaMedica?: string | null;
  alunosDispensa?: string | null;
  materialCarga?: string | null;
  refeicoes?: string | null;
  ronda?: string | null;
  revistaRecolher?: string | null;
  ocorrencias?: string | null;
}): SpedFormState => ({
  recebimento: sped.recebimento ?? '',
  passagem: sped.passagem ?? '',
  armamento: sped.armamento ?? '',
  punidos: sped.punidos ?? '',
  visitaMedica: sped.visitaMedica ?? '',
  alunosDispensa: sped.alunosDispensa ?? '',
  materialCarga: sped.materialCarga ?? '',
  refeicoes: sped.refeicoes ?? '',
  ronda: sped.ronda ?? '',
  revistaRecolher: sped.revistaRecolher ?? '',
  ocorrencias: sped.ocorrencias ?? '',
});

export const useSpedPage = () => {
  const [openSection, setOpenSection] = useState<string | null>('assuncao');
  const [companhia, setCompanhia] = useState<SpedCompany>(1);
  const [formData, setFormData] = useState<SpedFormState>(cloneInitialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<SpedMessage | null>(null);
  const messageTimeoutRef = useRef<number | null>(null);

  const { data: sgtDia, isLoading: isLoadingServicoAtual } = useSargentoDiaAtual();
  const servicoId = sgtDia?.servicoId ?? '';

  const spedQuery = useQuery({
    queryKey: [...SPED_QUERY_KEY, servicoId, companhia],
    queryFn: () => obterSped(servicoId, companhia),
    enabled: Boolean(servicoId),
  });

  useEffect(() => {
    const sped = spedQuery.data;
    if (!sped) {
      setFormData(cloneInitialFormState());
      return;
    }

    setFormData(mapSpedToFormState(sped));
  }, [spedQuery.data]);

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        window.clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const dataServicoFormatada = useMemo(() => {
    if (!sgtDia?.dataServico) return 'S/A';

    const data = new Date(sgtDia.dataServico);
    if (Number.isNaN(data.getTime())) return 'S/A';

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(data);
  }, [sgtDia?.dataServico]);

  const companhiaLabel = companhia === 1 ? '1ª Cia' : '2ª Cia';
  const statusLabel = sgtDia?.statusServico === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Fechado';

  const showMessage = (type: 'success' | 'error', text: string) => {
    if (messageTimeoutRef.current) {
      window.clearTimeout(messageTimeoutRef.current);
    }

    setMessage({ type, text });
    messageTimeoutRef.current = window.setTimeout(() => {
      setMessage(null);
      messageTimeoutRef.current = null;
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopySped = async () => {
    if (!servicoId) {
      showMessage('error', 'Serviço não identificado');
      return;
    }

    setIsSubmitting(true);

    try {
      await atualizarSped(servicoId, companhia, {
        recebimento: toOptionalText(formData.recebimento),
        passagem: toOptionalText(formData.passagem),
        armamento: toOptionalText(formData.armamento),
        punidos: toOptionalText(formData.punidos),
        visitaMedica: toOptionalText(formData.visitaMedica),
        alunosDispensa: toOptionalText(formData.alunosDispensa),
        materialCarga: toOptionalText(formData.materialCarga),
        refeicoes: toOptionalText(formData.refeicoes),
        ronda: toOptionalText(formData.ronda),
        revistaRecolher: toOptionalText(formData.revistaRecolher),
        ocorrencias: toOptionalText(formData.ocorrencias),
      });

      const texto = await obterTextoSped(servicoId, companhia);

      if (!texto) {
        showMessage('error', 'Erro ao gerar texto do SPED');
        return;
      }

      await navigator.clipboard.writeText(texto);
      showMessage('success', 'SPED copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar SPED:', error);
      showMessage('error', 'Erro ao processar SPED');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  return {
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
  };
};
