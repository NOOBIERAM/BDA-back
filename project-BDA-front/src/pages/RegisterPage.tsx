import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginUser, registerUser } from '../api/auth.api'
import { setAuthSession, isAuthenticated } from '../utils/auth.utils'
import { getApiErrorMessage } from '../utils/http.utils'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/manage', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.')
      return
    }

    setIsSubmitting(true)

    try {
      await registerUser({ username, password })
      const token = await loginUser({ username, password })
      setAuthSession({ token: token.access_token, username })
      navigate('/manage', { replace: true })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Impossible de créer le compte."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="register"
      className="min-h-screen min-w-screen flex flex-col items-center justify-center"
    >
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="p-13 rounded-3xl shadow-2xl flex flex-col space-y-12 min-w-[420px]"
      >
        <h1 className="text-3xl font-bold text-center">Créer votre propre compte</h1>
        <div className="space-y-5">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 flex items-center space-x-2">
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              className="p-3 h-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700 flex items-center space-x-2">
              Mot de passe
            </label>
            <input
              type="password"
              className="p-3 h-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 flex items-center space-x-2">
              Confirmation du mot de passe
            </label>
            <input
              type="password"
              className="p-3 h-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>

        <div className="flex flex-col">
          <button
            type="submit"
            className="border-2 border-black font-medium rounded-xl py-3 hover:bg-black hover:text-white disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Inscription...' : "S'inscrire"}
          </button>

          <button
            type="button"
            className="text-center text-sm mt-3 underline underline-offset-4 cursor-pointer hover:font-medium"
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            Vous avez déjà un compte ? Se connecter
          </button>
        </div>
      </form>
    </section>
  )
}

export default RegisterPage
