export default function authHeader() {
  const storedAccessToken = localStorage.getItem('accessToken')
  let accessToken = JSON.parse(storedAccessToken ? storedAccessToken : '') as string

  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` }
  } else {
    return {}
  }
}
