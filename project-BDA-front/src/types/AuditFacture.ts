export interface AuditFacture {
  id: number
  type_action: string
  date_modification: string
  numero_facture: string
  nom_client: string
  date_facture: string
  montant_ancien: number | null
  montant_nouveau: number | null
  utilisateur: string | null
  machine_hote: string | null
}
