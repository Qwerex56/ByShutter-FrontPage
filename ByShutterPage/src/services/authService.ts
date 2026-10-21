import api from '@/api/client'

let authenticated = false
let checked = false

export async function login(username: string, password: string) {
  await api.post('auth/login', { username, password })
  authenticated = true
  checked = true
}

export async function logout() {
  await api.post('auth/logout')
  authenticated = false
  checked = true
}

export async function isAuthenticated() {
  if (checked) {
    return authenticated
  }

  try {
    await api.get('auth/me')
    authenticated = true
  } catch {
    authenticated = false
  }

  checked = true
  return authenticated
}
