import { ArrowRight, Power, TerminalSquareIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAuditTrail } from '../api/facture.api'
import type { Action } from '../types/Action'
import type { AuditFacture } from '../types/AuditFacture'
import { clearAuthSession } from '../utils/auth.utils'
import { getColors } from '../utils/classname.utils'
import { getStableBackgroundColor } from '../utils/color.utils'
import { extractDate, extractDatetime } from '../utils/date.utils'
import { getApiErrorMessage } from '../utils/http.utils'

const formatAmount = (amount: number | null) => {
  if (amount === null) {
    return '-'
  }

  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const normalizeAction = (typeAction: string): Action => {
  switch (typeAction) {
    case 'INSERT':
      return 'AJOUT'
    case 'DELETE':
      return 'SUPPRESSION'
    default:
      return 'MODIFICATION'
  }
}

const countAuditsByAction = (audits: AuditFacture[]): Record<Action, number> => {
  return audits.reduce<Record<Action, number>>(
    (counts, audit) => {
      counts[normalizeAction(audit.type_action)] += 1
      return counts
    },
    {
      AJOUT: 0,
      MODIFICATION: 0,
      SUPPRESSION: 0,
    },
  )
}

const MonitoringPage = () => {
  const navigate = useNavigate()
  const [audits, setAudits] = useState<AuditFacture[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const auditTotals = countAuditsByAction(audits)

  useEffect(() => {
    const loadAuditTrail = async () => {
      setIsLoading(true)

      try {
        const data = await getAuditTrail()
        setAudits(data)
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, "Impossible de charger l'audit."))
      } finally {
        setIsLoading(false)
      }
    }

    loadAuditTrail()

    const interval = setInterval(() => {
      loadAuditTrail()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    clearAuthSession()
    navigate('/', { replace: true })
  }

  return (
    <div className="p-8 min-h-screen text-gray-700">
      <nav className="flex items-center justify-between font-bold p-3 px-5 border-2 rounded-2xl mb-8">
        <h3 className="flex items-center justify-center space-x-2">
          <span>Admin</span>
          <span className="w-2 h-2 translate-y-[1px] animate-ping bg-green-300 rounded-full" />
        </h3>
        <div className="flex items-center gap-4">
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
      <section className="w-full min-h-[750px] border-2 rounded-xl mb-8 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b-2">
            <tr>
              <th className="p-4 text-left w-1 rounded-tl-xl">#</th>
              <th className="p-4 text-left">Mise à jour</th>
              <th className="p-4 text-left">Hôte</th>
              <th className="p-4 text-left">Action</th>
              <th className="p-4 text-left">Utilisateur</th>
              <th className="p-4 text-left">Numéro</th>
              <th className="p-4 text-left">Nom</th>
              <th className="p-4 flex items-center justify-center space-x-3">
                <span>Montant ancien</span>
                <ArrowRight />
                <span>Nouveau</span>
              </th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="p-4 text-left" colSpan={9}>
                  Chargement de l&apos;audit...
                </td>
              </tr>
            )}
            {!isLoading && errorMessage && (
              <tr>
                <td className="p-4 text-left text-red-500" colSpan={9}>
                  {errorMessage}
                </td>
              </tr>
            )}
            {!isLoading && !errorMessage && audits.length === 0 && (
              <tr>
                <td className="p-4 text-left" colSpan={9}>
                  Aucune trace d&apos;audit disponible.
                </td>
              </tr>
            )}
            {!isLoading &&
              !errorMessage &&
              audits.map((audit, index) => {
                const action = normalizeAction(audit.type_action)
                const invoiceColor = getStableBackgroundColor(audit.numero_facture)

                return (
                  <tr key={audit.id} className="text-sm">
                    <td className="p-4 text-left" style={{ backgroundColor: invoiceColor }} >{index + 1}</td>
                    <td className="p-4 text-left">{extractDatetime(audit.date_modification)}</td>
                    <td className="p-4 text-left">{audit.machine_hote ?? '-'}</td>
                    <td className="p-4 text-left font-medium">
                      <span
                        className={`border-2 rounded-full py-1 px-2 ${getColors(action).border_bg}`}
                      >
                        {action}
                      </span>
                    </td>
                    <td className="p-4 text-left">{audit.utilisateur ?? '-'}</td>
                    <td className="p-4 text-left">
                      <span
                        className="rounded-lg px-3 py-1 font-medium text-gray-800"
                        style={{ backgroundColor: invoiceColor }}
                      >
                        {audit.numero_facture}
                      </span>
                    </td>
                    <td className="p-4 text-left">{audit.nom_client}</td>
                    <td className="p-4 flex space-x-3 items-center justify-center">
                      <span>{formatAmount((audit.montant_ancien ==null ? audit.montant_nouveau : audit.montant_ancien))}</span>
                      <ArrowRight />
                      <span>{formatAmount(((audit.montant_ancien == null || audit.montant_ancien == audit.montant_nouveau ) ? null : audit.montant_nouveau))}</span>
                    </td>
                    <td className="p-4 text-left">{extractDate(audit.date_facture)}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </section>
      <footer className="flex items-center justify-start font-bold p-3 px-5 border-2 rounded-2xl space-x-10">
        <div className="border-b-2 border-green-400">
          <span>Insertion: {auditTotals.AJOUT}</span>
        </div>
        <div className="border-b-2 border-cyan-400">
          <span>Modification: {auditTotals.MODIFICATION}</span>
        </div>
        <div className="border-b-2 border-red-400">
          <span>Suppression: {auditTotals.SUPPRESSION}</span>
        </div>
        <div className="flex items-center justify-center space-x-3 ml-auto text-gray-700">
          <TerminalSquareIcon size={18} />
          <span>Audit facture</span>
        </div>
      </footer>
    </div>
  )
}

export default MonitoringPage
