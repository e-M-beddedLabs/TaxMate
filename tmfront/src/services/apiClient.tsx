const BASE_URL = import.meta.env.VITE_API_URL || "https://taxmate-backend-2uv6.onrender.com"

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    let message = "Request failed"
    try {
      const data = await res.json()
      message = data.detail || message
    } catch { }
    throw new Error(message)
  }

  return res.json()
}
