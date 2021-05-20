export default function authHeader() {
  const storedAccessToken = localStorage.getItem('accessToken')

  if (!storedAccessToken) {
    return {}
  }

  let accessToken = JSON.parse(storedAccessToken ? storedAccessToken : '') as string

  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` }
  } else {
    return {}
  }
}
