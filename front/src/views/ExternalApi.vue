<template>
  <div>
    <div>
      <h1>BackEnd API</h1>

      <button @click="callApi1">Get user with front Bearer</button>
      <button @click="callApi2">Get user with userId</button>
    </div>

    <div v-if="apiMessage">
      <h2>Result</h2>
      <p>{{ apiMessage }}</p>
      <p>{{ user }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Api',
  data() {
    return {
      apiMessage: null,
      user: null,
    }
  },
  methods: {
    async callApi(url) {
      const accessToken = await this.$auth.getAccessToken()

      try {
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        this.apiMessage = data.msg
        this.user = data.user
      } catch (e) {
        this.apiMessage = `Error: the server responded with '${e.response.status}: ${e.response.statusText}'`
        this.user = {}
      }
    },
    async callApi1() {
      return this.callApi('http://localhost:3001/api/external')
    },
    async callApi2() {
      return this.callApi('http://localhost:3001/api/external2')
    },
  },
}
</script>