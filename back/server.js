const express = require('express')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const authConfig = require('../auth_config.json')
const authService = require('./src/authService')

// Create a new Express app
const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(helmet())
app.use(cors({ maxAge: 600 }))

// Define middleware that validates incoming bearer tokens
// using JWKS from YOUR_DOMAIN
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ['RS256'],
})

// Define an endpoint that must be called with an access token
app.get('/api/external', checkJwt, async (req, res) => {
  console.log('GET /api/external')
  const bearer = req.headers.authorization
  res.send({
    msg: 'Your Access Token was successfully validated!',
    user: await authService.getUserFromBearer(bearer),
  })
})

app.get('/api/external2', checkJwt, async (req, res) => {
  console.log('GET /api/external2')
  const user = req.user
  res.send({
    msg: 'Your Access Token was successfully validated!',
    user: await authService.getUserWithoutBearer(user),
  })
})

app.put('/api/user', checkJwt, async (req, res) => {
  console.log('GET /api/user')
  const user = req.user
  const body = req.body
  console.log({ user, body })
  try {
    res.send(await authService.updateUser(user, body))
  } catch (err) {
    res.send(err.message)
  }
})

app.get('/api/test', (req, res) => {
  console.log('GET /api/test')
  res.send({
    msg: 'Test',
  })
})

// Start the app
app.listen(3001, () => console.log('API listening on 3001'))
