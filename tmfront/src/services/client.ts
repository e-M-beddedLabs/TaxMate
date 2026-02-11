const API_BASE = import.meta.env.VITE_API_URL || "https://taxmate-backend-2uv6.onrender.com"

export function getToken() {
  return localStorage.getItem("token")
}

export function setToken(token: string) {
  localStorage.setItem("token", token)
}

export function removeToken() {
  localStorage.removeItem("token")
}

export async function api<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Request failed")
  }

  const contentType = res.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    return {} as T
  }

  return res.json()
}
