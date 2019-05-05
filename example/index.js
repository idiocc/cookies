/* alanode example/ */
import cookies from '../src'

(async () => {
  const res = await cookies({
    text: 'example',
  })
  console.log(res)
})()