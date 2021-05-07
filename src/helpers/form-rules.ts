export function requiredRule(message = 'This field is required'): (value: any) => boolean | string {
  return value => !!value || value === 0 || message
}

export function passwordRule(message = 'Password to weak'): (value: any) => boolean | string {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
  return value => passwordRegex.test(value) || message
}

export function minCharRule(
  minCount: number,
  message = `Enter at least ${minCount} characters`
): (value: any) => boolean | string {
  return value => value.length >= minCount || message
}

export function maxCharRule(
  maxCount: number,
  message = `Only ${maxCount} characters allowed`
): (value: any) => boolean | string {
  return value => value.length <= maxCount || message
}

export function regexRule(
  regex: RegExp,
  message = 'This field is required'
): (value: any) => boolean | string {
  return value => value.match(regex) || message
}
