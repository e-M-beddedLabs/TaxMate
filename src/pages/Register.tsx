import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Lock } from "lucide-react"
import { Button, Input } from "../components/ui"
import { register as apiRegister } from "../services/auth"

export const Register: React.FC = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await apiRegister(email, password)
      navigate("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
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
          <h1 className="text-2xl font-bold mb-6 text-center">
            Create account
          </h1>

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
              Create Account
            </Button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
