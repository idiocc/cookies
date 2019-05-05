import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import cookies from '../../src'

// export default
makeTestSuite('test/result', {
  async getResults() {
    const res = await cookies({
      text: this.input,
    })
    return res
  },
  context: Context,
})