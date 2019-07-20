import Cookies from '../src'
import aqt from '@rqt/aqt'
import { createServer } from 'http'

// Optionally define keys to sign cookie values
// to prevent client tampering

const server = createServer((req, res) => {
  // Create a cookies object

  /* start example */
  const cookies = new Cookies(req, res)
  cookies.set('LastVisit', new Date().toISOString(), {
    signed: true,

























  })
















  /* end example */


  // Get a cookie
  // const lastVisit = cookies.get('LastVisit', { signed: true })

  // Set the cookie to a value

  // if (!lastVisit) {
  //   res.setHeader('Content-Type', 'text/plain')
  //   res.end('Welcome, first time visitor!')
  // } else {
  //   res.setHeader('Content-Type', 'text/plain')
  //   res.end('Welcome back! Nothing much changed since your last visit at ' + lastVisit + '.')
  // }
})

server.listen(async () => {
  const url = `http://localhost:${server.address().port}`
  console.log(url)
  let { body, headers } = await aqt(url)
  console.log(body, headers['set-cookie'].join('\n'))
  ;({ body } = await aqt(url, {
    headers: { Cookie: headers['set-cookie'] },
  }))
  console.log(body)
  server.close()
})

