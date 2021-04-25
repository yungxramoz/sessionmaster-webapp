export function promiseErrorHandler(error: any, callback: Function): Promise<any> {
  callback()
  const message =
    (error.response && error.response?.data) || error.response?.data || error.toString()
  return Promise.reject(message)
}
