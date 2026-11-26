import api from './axios.config'

import type { AuditFacture } from '../types/AuditFacture'
import type { Facture, FacturePayload } from '../types/Facture'

export const getFactures = async (): Promise<Facture[]> => {
  const { data } = await api.get<Facture[]>('/factures')
  return data
}

export const createFacture = async (payload: FacturePayload): Promise<Facture> => {
  const { data } = await api.post<Facture>('/factures', payload)
  return data
}

export const updateFacture = async (
  factureId: number,
  payload: FacturePayload,
): Promise<Facture> => {
  const { data } = await api.put<Facture>(`/factures/${factureId}`, payload)
  return data
}

export const deleteFacture = async (factureId: number): Promise<void> => {
  await api.delete(`/factures/${factureId}`)
}

export const getAuditTrail = async (): Promise<AuditFacture[]> => {
  const { data } = await api.get<AuditFacture[]>('/audit')
  return data
}
