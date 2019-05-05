import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import cookies from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof cookies, 'function')
  },
  async 'calls package without error'() {
    await cookies()
  },
  async 'gets a link to the fixture'({ fixture }) {
    const text = fixture`text.txt`
    const res = await cookies({
      text,
    })
    ok(res, text)
  },
}

export default T