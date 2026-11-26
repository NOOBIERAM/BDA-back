import { Check, Edit, Trash2 } from "lucide-react"
import type { Action } from "../types/Action"
import { getColors } from "../utils/classname.utils"
import { useEffect, useState } from "react"

interface ActionPopupProps {
    show: Action | null
    onClose: () => void
}
const ActionPopup = ({ show, onClose }: ActionPopupProps) => {
    const [lettreShow, setLetterShow] = useState(false)
    useEffect(() => {
        if (!show) return

        const t1 = setTimeout(() => setLetterShow(true), 500)
        const t2 = setTimeout(() => {
            setLetterShow(false)
            onClose()
        }, 2200)

        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
        }
    }, [show])
    return (
        <div className={`absolute inset-0 h-20  bg-transparent flex justify-center items-start ${show != null ? "opacity-100" : "-top-19 opacity-0"} transition-all duration-500  `}>
            <div className={`bg-white p-5 rounded-b-xl shadow-2xl border-b-2 border-x-2  ${show && getColors(show)?.shadow} `}>
                <h3 className={`text-lg flex items-center justify-center font-medium ${lettreShow && "space-x-4"}  ${show && getColors(show)?.text}`}>
                    {show === "AJOUT" && <Check />}
                    {show === "MODIFICATION" && <Edit />}
                    {show === "SUPPRESSION" && <Trash2 />}
                    <span className={`${lettreShow ? "max-w-50" : "max-w-0"} overflow-hidden whitespace-nowrap transition-all duration-500`}>
                        {show === "AJOUT" && "Ajouté avec succès"}
                        {show === "MODIFICATION" && "Modifié avec succès"}
                        {show === "SUPPRESSION" && "Supprimé avec succès"}
                    </span>
                </h3>
            </div>
        </div>
    )
}

export default ActionPopup