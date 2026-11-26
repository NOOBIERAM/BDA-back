import { Check, Circle } from "lucide-react"

interface ValidationModalProps {
    onValidate: () => void
    onCancel: () => void
}

const ValidationModal = ({ onValidate, onCancel }: ValidationModalProps) => {
    return (
        <div className="absolute inset-0  flex items-center justify-center">
            <div onClick={onCancel} className="absolute bg-black/10 bg-opacity-50 backdrop-blur-[2px] w-full h-full"></div>
            <div className="bg-white p-6 rounded-xl border-2 shadow-lg w-150 z-2">
                <h2 className="text-xl font-bold mb-4">Confirmation</h2>
                <p className="mb-10">Êtes-vous sûr de vouloir effectuer cette action ?</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onValidate} className=" flex items-center justify-center space-x-3 px-4 py-2 bg-white  rounded-xl border-2 border-red-400 hover:bg-red-400 hover:text-white text-red-400"><Check /> <span>Valider</span></button>
                    <button onClick={onCancel} className=" flex items-center justify-center space-x-3 px-4 py-2 border-2 rounded-xl hover:bg-black hover:text-white"><Circle /> <span>Annuler</span></button>
                </div>
            </div>
        </div>
    )
}

export default ValidationModal