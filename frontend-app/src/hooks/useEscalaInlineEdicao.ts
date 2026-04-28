import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atualizarEscalaService } from '../services/escalas.service';
import type { CampoEditavel, EscalaLinha, InlineDraft } from '../types/escala.types';
import { criarInlineDrafts } from '../utils/escala.helpers';

export const useEscalaInlineEdicao = (linhasEscala: EscalaLinha[], postoAtivo: string) => {
  const queryClient = useQueryClient();
  const [inlineDrafts, setInlineDrafts] = useState<Record<string, InlineDraft>>({});

  useEffect(() => {
    setInlineDrafts(criarInlineDrafts(linhasEscala));
  }, [linhasEscala]);

  const atualizarEscalaMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { quarto?: string | null; cama?: string | null } }) =>
      atualizarEscalaService(id, payload),
    onSuccess: (linhaAtualizada) => {
      queryClient.setQueryData<EscalaLinha[]>(['escalas', postoAtivo], (atual) => {
        if (!atual) return atual;
        return atual.map((linha) => (linha.id === linhaAtualizada.id ? linhaAtualizada : linha));
      });
    },
  });

  const atualizarInline = (id: string, campo: CampoEditavel, valor: string) => {
    setInlineDrafts((atual) => {
      const existente = atual[id] ?? { quarto: '', cama: '' };
      return {
        ...atual,
        [id]: {
          ...existente,
          [campo]: valor,
        },
      };
    });
  };

  const salvarInlineNoBlur = (linha: EscalaLinha, campo: CampoEditavel) => {
    const draft = inlineDrafts[linha.id];
    if (!draft) return;

    const valorOriginal = (linha[campo] ?? '').trim();
    const valorDraft = draft[campo].trim();

    if (valorOriginal === valorDraft) return;

    const payload: { quarto?: string | null; cama?: string | null } = {};
    payload[campo] = valorDraft.length > 0 ? valorDraft : null;

    atualizarEscalaMutation.mutate({ id: linha.id, payload });
  };

  return {
    inlineDrafts,
    atualizarInline,
    salvarInlineNoBlur,
  };
};
