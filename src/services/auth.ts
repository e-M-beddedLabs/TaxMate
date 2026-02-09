// src/services/auth.ts

const API_BASE = "http://127.0.0.1:8000"

export async function login(email: string, password: string): Promise<string> {
  const form = new URLSearchParams()
  form.append("username", email) // MUST be username
  form.append("password", password)

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || "Login failed")
  }

  const data = await res.json()
  return data.access_token
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || "Registration failed")
  }

  return res.json()
}
