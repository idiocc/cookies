import connect from 'connect'
import aqt from '@rqt/aqt'
import { express as cookies } from '../src'

const app = connect()

app.use(cookies(['keyboard cat']))
app.use('/', (req, res) => {
  // Get a cookie
  const lastVisit = req.cookies.get('LastVisit', { signed: true })

  // Set the cookie to a value
  res.cookies.set('LastVisit', new Date().toISOString(), { signed: true })

  if (!lastVisit) {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Welcome, first time visitor!')
  } else {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Welcome back! Nothing much changed since your last visit at ' + lastVisit + '.')
  }
})

const server = app.listen(0, async () => {
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