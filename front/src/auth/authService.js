import auth0 from 'auth0-js'
import EventEmitter from 'events'
import authConfig from '../../../auth_config.json'

const localStorageKey = 'loggedIn'
const loginEvent = 'loginEvent'

const webAuth = new auth0.WebAuth({
  domain: authConfig.domain,
  redirectUri: `${window.location.origin}/callback`,
  clientID: authConfig.front.clientId,
  audience: authConfig.audience,
  responseType: 'token id_token',
  scope: 'openid profile email user_metadata',
})

class AuthService extends EventEmitter {
  idToken = null
  profile = null
  tokenExpiry = null
  accessToken = null
  accessTokenExpiry = null

  // Starts the user login flow
  login(customState) {
    webAuth.authorize({
      appState: customState,
    })
  }

  // Handles the callback request from Auth0
  handleAuthentication() {
    return new Promise((resolve, reject) => {
      webAuth.parseHash((err, authResult) => {
        console.log('handleAuthentication', { err, authResult })
        if (err) {
          reject(err)
        } else {
          if (authResult) {
            this.localLogin(authResult)
            resolve(authResult.idToken)
          }
        }
      })
    })
  }
  localLogin(authResult) {
    console.log('localLogin', { authResult })
    this.idToken = authResult.idToken
    this.profile = authResult.idTokenPayload
    this.accessToken = authResult.accessToken

    // Convert the JWT expiry time from seconds to milliseconds
    this.tokenExpiry = new Date(this.profile.exp * 1000)
    this.accessTokenExpiry = new Date(Date.now() + authResult.expiresIn * 1000)

    localStorage.setItem(localStorageKey, 'true')

    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.appState || {},
    })
  }

  renewTokens() {
    console.log('renewTokens')
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(localStorageKey) !== 'true') {
        return reject('Not logged in')
      }

      webAuth.checkSession({}, (err, authResult) => {
        console.log('renewTokens', { err, authResult })
        if (err) {
          reject(err)
        } else {
          if (authResult) {
            this.localLogin(authResult)
            resolve(authResult)
          }
        }
      })
    })
  }

  logOut() {
    localStorage.removeItem(localStorageKey)

    this.idToken = null
    this.tokenExpiry = null
    this.profile = null

    webAuth.logout({
      returnTo: window.location.origin,
    })

    this.emit(loginEvent, { loggedIn: false })
  }

  isAuthenticated() {
    return Date.now() < this.tokenExpiry && localStorage.getItem(localStorageKey) === 'true'
  }

  isAccessTokenValid() {
    return this.accessToken && this.accessTokenExpiry && Date.now() < this.accessTokenExpiry
  }

  getAccessToken() {
    return new Promise((resolve, reject) => {
      if (this.isAccessTokenValid()) {
        resolve(this.accessToken)
      } else {
        this.renewTokens().then(authResult => {
          resolve(authResult.accessToken)
        }, reject)
      }
    })
  }
}

export default new AuthService()
