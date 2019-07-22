import { createHmac } from 'crypto'

export function sign(data, algorithm, key, encoding) {
  return createHmac(algorithm, key)
    .update(data).digest(encoding)
    .replace(/\/|\+|=/g, (x) => {
      return ({ '/': '_', '+': '-', '=': '' })[x]
    })
}