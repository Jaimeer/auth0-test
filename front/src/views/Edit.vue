<template>
  <div>
    <div>
      <h2>Current User</h2>
      <pre>{{this.profile}}</pre>
      <hr />
    </div>
    <div v-if="profile">
      <h2>Edit form</h2>
      <span>adress:</span>
      <input type="text" v-model="form.address" />
      <button @click="submit">Submit</button>
    </div>
    <div v-if="response">
      <hr />
      <h2>Updated User</h2>
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash'
import axios from 'axios'

export default {
  data() {
    return {
      profile: this.$auth.profile,
      form: {
        address: '',
      },
      response: null,
    }
  },
  created() {
    console.log('PROFILE', this.profile)
    this.form.address = get(this.profile, 'user_metadata.address') || ''
  },
  methods: {
    handleLoginEvent(data) {
      this.profile = data.profile
    },
    async submit() {
      this.response = null
      const accessToken = await this.$auth.getAccessToken()
      const url = 'http://localhost:3001/api/user'
      try {
        const body = this.form
        const { data } = await axios.put(url, body, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        console.log(data)
        this.response = data
      } catch (e) {
        console.log('error', e)
        this.response = `Error: the server responded with '${e.response.status}: ${e.response.statusText}'`
      }
    },
  },
}
</script>
<style scoped>
pre {
  text-align: left;
}
</style>