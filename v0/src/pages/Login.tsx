import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Lock } from "lucide-react"
import { Button, Input } from "../components/ui"
import { login as apiLogin } from "../services/auth"
import { useAuth } from "../context/AuthContext"

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const token = await apiLogin(email, password)
      login(token)
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="card p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
              required
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>

          <p className="text-sm text-center mt-4">
            No account?{" "}
            <Link to="/register" className="text-primary-600">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
