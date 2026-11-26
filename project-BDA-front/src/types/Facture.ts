export interface Facture {
  id: number
  numero_facture: string
  nom_client: string
  date_facture: string
  montant: number
}

export interface FacturePayload {
  numero_facture: string
  nom_client: string
  date_facture: string
  montant: number
}
