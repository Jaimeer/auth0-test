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
const getUserFromUserIdPromise = (bearer, userId) => {
  console.log('getUserFromUserId')
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: `https://${authConfig.domain}/api/v2/users/${userId}`,
      headers: { authorization: bearer },
    }
    console.log('getUserFromUserIdPromise', options)
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
    return getUserFromUserIdPromise(bearer, userId)
  }
  return { status: 'No Token' }
}

const updateUserPromise = async (bearer, userId, body) => {
  console.log('updateUserPromise')
  const data = { user_metadata: body }
  return new Promise((resolve, reject) => {
    var options = {
      method: 'PATCH',
      url: `https://${authConfig.domain}/api/v2/users/${userId}`,
      headers: { authorization: bearer },
      json: data,
    }
    console.log('updateUserPromise', options)
    request(options, function(error, response, body) {
      if (error) return reject(error)
      console.log('BODY', body)
      resolve(body)
    })
  })
}

const updateUser = async (user, body) => {
  let token = await getToken()
  console.log('updateUser', { token })
  if (token) {
    token = JSON.parse(token)
    const userId = user.sub
    const bearer = `${token.token_type} ${token.access_token}`
    return updateUserPromise(bearer, userId, body)
  }
  return { status: 'No Token' }
}

module.exports = {
  getUserWithoutBearer,
  getUserFromBearer,
  updateUser,
}
