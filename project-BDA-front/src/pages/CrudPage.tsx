import { ArrowLeft, Edit, Power, Trash2, User2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import ActionPopup from '../components/ActionPopup'
import ValidationModal from '../components/ValidationModal'
import { createFacture, deleteFacture, getFactures, updateFacture } from '../api/facture.api'
import type { Action } from '../types/Action'
import type { Facture, FacturePayload } from '../types/Facture'
import { clearAuthSession, getAuthUsername } from '../utils/auth.utils'
import { extractDate } from '../utils/date.utils'
import { getApiErrorMessage } from '../utils/http.utils'

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

const CrudPage = () => {
  const navigate = useNavigate()
  const [factures, setFactures] = useState<Facture[]>([])
  const [showPopup, setShowPopup] = useState<Action | null>(null)
  const [factureToDelete, setFactureToDelete] = useState<Facture | null>(null)
  const [selectedFactureId, setSelectedFactureId] = useState<number | null>(null)
  const [numero, setNumero] = useState('')
  const [nom, setNom] = useState('')
  const [date, setDate] = useState('')
  const [montant, setMontant] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = selectedFactureId !== null
  const username = getAuthUsername() ?? 'Utilisateur'

  const clearFields = () => {
    setSelectedFactureId(null)
    setNumero('')
    setNom('')
    setDate('')
    setMontant('')
  }

  const loadFactures = async () => {
    setIsLoading(true)

    try {
      const data = await getFactures()
      setFactures(data)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Impossible de charger les factures.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadFactures()
  }, [])

  const fillEdit = (facture: Facture) => {
    setSelectedFactureId(facture.id)
    setNumero(facture.numero_facture)
    setNom(facture.nom_client)
    setDate(facture.date_facture)
    setMontant(facture.montant.toString())
  }

  const buildPayload = (): FacturePayload | null => {
    if (!numero.trim() || !nom.trim() || !date || !montant.trim()) {
      setErrorMessage('Tous les champs sont obligatoires.')
      return null
    }

    const parsedAmount = Number(montant)

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Le montant doit être un nombre positif.')
      return null
    }

    return {
      numero_facture: numero.trim(),
      nom_client: nom.trim(),
      date_facture: date,
      montant: parsedAmount,
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    const payload = buildPayload()

    if (!payload) {
      return
    }

    setIsSubmitting(true)

    try {
      if (selectedFactureId === null) {
        await createFacture(payload)
        setShowPopup('AJOUT')
      } else {
        await updateFacture(selectedFactureId, payload)
        setShowPopup('MODIFICATION')
      }

      clearFields()
      await loadFactures()
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Impossible d'enregistrer la facture."))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!factureToDelete) {
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await deleteFacture(factureToDelete.id)
      setShowPopup('SUPPRESSION')

      if (selectedFactureId === factureToDelete.id) {
        clearFields()
      }

      setFactureToDelete(null)
      await loadFactures()
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Impossible de supprimer la facture.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    clearAuthSession()
    navigate('/', { replace: true })
  }

  return (
    <div className="relative p-8 min-h-screen text-gray-700">
      {factureToDelete && (
        <ValidationModal
          onCancel={() => setFactureToDelete(null)}
          onValidate={() => void handleDelete()}
        />
      )}
      <ActionPopup show={showPopup} onClose={() => setShowPopup(null)} />
      <nav className="flex items-center justify-between font-bold p-3 px-5 border-2 rounded-2xl">
        <h3 className='flex items-center space-x-3'><User2 size={20}/><span>{username}</span></h3>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="cursor-pointer hover:text-cyan-500"
            onClick={() => navigate('/monitor')}
          >
            CRUD Facture
          </button>
          <button
            type="button"
            className="flex items-center justify-center space-x-3 cursor-pointer hover:text-red-400"
            onClick={handleLogout}
          >
            <Power />
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>
      <div className="flex items-start justify-between mt-10 space-x-10">
        <aside className="border-2 w-150 rounded-2xl">
          <form onSubmit={(event) => void handleSubmit(event)} className="p-13 flex flex-col space-y-12">
            <div className="space-y-5">
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 flex items-center space-x-2">Numéro</label>
                <input
                  type="text"
                  className="p-3 h-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  value={numero}
                  onChange={(event) => setNumero(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 flex items-center space-x-2">Nom</label>
                <input
                  type="text"
                  className="p-3 h-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  value={nom}
                  onChange={(event) => setNom(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 flex items-center space-x-2">Date</label>
                <input
                  type="date"
                  className="p-3 h-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 flex items-center space-x-2">Montant</label>
                <input
                  type="number"
                  step="0.01"
                  className="p-3 h-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  value={montant}
                  onChange={(event) => setMontant(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
            </div>

            <div className="flex flex-col">
              {!isEdit && (
                <button
                  type="submit"
                  className="border-2 border-black font-medium rounded-xl py-3 hover:bg-black hover:text-white disabled:opacity-60"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Ajout...' : 'Ajouter'}
                </button>
              )}
              {isEdit && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    className="border-2 border-black font-medium rounded-xl py-3 hover:bg-black hover:text-white w-30"
                    onClick={clearFields}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft />
                  </button>
                  <button
                    type="submit"
                    className="border-2 border-black font-medium rounded-xl py-3 hover:bg-black hover:text-white w-full disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Modification...' : 'Modifier'}
                  </button>
                </div>
              )}
            </div>
          </form>
        </aside>
        <section className="w-full flex flex-col space-y-5">
          <div className="grid grid-cols-5 border-2 rounded-2xl font-bold">
            <span className="py-4 px-4 text-left"># Numéro</span>
            <span className="py-4 px-4 text-left">Nom</span>
            <span className="py-4 px-4 text-left">Date</span>
            <span className="py-4 px-4 text-left">Montant</span>
            <span className="py-4 px-4 text-center">Actions</span>
          </div>
          {isLoading && <p className="px-2">Chargement des factures...</p>}
          {!isLoading && factures.length === 0 && <p className="px-2">Aucune facture disponible.</p>}
          {!isLoading &&
            factures.map((facture) => (
              <div key={facture.id} className="grid grid-cols-5 border-2 rounded-2xl">
                <span className="py-4 px-4 text-left">{facture.numero_facture}</span>
                <span className="py-4 px-4 text-left">{facture.nom_client}</span>
                <span className="py-4 px-4 text-left">{extractDate(facture.date_facture)}</span>
                <span className="py-4 px-4 text-left">{formatAmount(facture.montant)}</span>
                <div className="flex items-center justify-center space-x-10">
                  <button
                    type="button"
                    className="cursor-pointer text-cyan-400 hover:text-cyan-600"
                    onClick={() => fillEdit(facture)}
                  >
                    <Edit />
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer text-red-400 hover:text-red-600"
                    onClick={() => setFactureToDelete(facture)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
        </section>
      </div>
    </div>
  )
}

export default CrudPage
