import { useQuery } from '@tanstack/react-query'
import { buscarSgtDeDia } from '../services/servicos.service'

export const SARGENTO_DIA_ATUAL_QUERY_KEY = ['sargentoDiaAtual']

export const useSargentoDiaAtual = () => {
  return useQuery({
    queryKey: SARGENTO_DIA_ATUAL_QUERY_KEY,
    queryFn: buscarSgtDeDia,
  })
}
