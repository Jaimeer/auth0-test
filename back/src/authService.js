var request = require('request')
const authConfig = require('../../auth_config.json')

const getUserFromBearer = bearer => {
  console.log('getUserFromBearer', { bearer })
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: `https://${authConfig.domain}/userinfo`,
      headers: { authorization: bearer },
    }
    request(options, function(error, response, body) {
      if (error) return reject(error)
      console.log('BODY', body)
      resolve(body)
    })
  })
}
const getToken = () => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `https://${authConfig.domain}/oauth/token`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      form: {
        grant_type: 'client_credentials',
        client_id: authConfig.back.clientId,
        client_secret: authConfig.back.clientSecret,
        audience: authConfig.audience,
      },
    }
    request(options, function(error, response, body) {
      if (error) return reject(error)
      resolve(body)
    })
  })
}
const getUserFromUserId = (bearer, userId) => {
  console.log('getUserFromUserId', { bearer, userId })
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: `https://${authConfig.domain}/api/v2/users/${userId}`,
      headers: { authorization: bearer },
    }
    request(options, function(error, response, body) {
      if (error) return reject(error)
      console.log('BODY', body)
      resolve(body)
    })
  })
}

const getUserWithoutBearer = async user => {
  let token = await getToken()
  console.log('getUserWithoutBearer', { token })
  if (token) {
    token = JSON.parse(token)
    const userId = user.sub
    const bearer = `${token.token_type} ${token.access_token}`
    return getUserFromUserId(bearer, userId)
  }
  return { status: 'No Token' }
}

module.exports = {
  getUserWithoutBearer,
  getUserFromBearer,
}
