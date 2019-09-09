<template>
  <nav>
    <div>
      <a href="#">Auth0 - Vue</a>
    </div>

    <ul>
      <li>
        <router-link to="home">Home</router-link>
      </li>
      <li v-if="!isAuthenticated">
        <a href="#" @click.prevent="login">Login</a>
      </li>
      <li v-if="isAuthenticated">
        <router-link to="/profile">Profile</router-link>
      </li>
      <li v-if="isAuthenticated">
        <router-link to="/external-api">External API</router-link>
      </li>
      <li v-if="isAuthenticated">
        <a class="logout" href="#" @click.prevent="logout">Log out</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import authService from '../auth/authService'

export default {
  name: 'Login',
  props: {},
  data() {
    return {
      isAuthenticated: false,
    }
  },
  async created() {
    try {
      await this.$auth.renewTokens()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    login() {
      this.$auth.login()
    },
    logout() {
      this.$auth.logOut()
    },
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn
      this.profile = data.profile
    },
  },
}
</script>

<style scoped lang="scss">
nav {
  background-color: #0778b5;
  padding: 10px;
  text-align: center;
  width: 100vw;
  ul {
    li {
      display: inline;
      padding: 0px 10px;
    }
  }
  a {
    color: #1ad8cc;
    text-decoration: none;
    font-weight: bold;
  }
  a:hover {
    color: #e8b32a;
  }
  .logout {
    color: #ed3e38;
    text-decoration: none;
  }
  .logout:hover {
    color: #e8b32a;
  }
}
</style>
