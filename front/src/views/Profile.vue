<template>
  <div>
    <div v-if="profile">
      <div>
        <div>
          <img :src="profile.picture" />
        </div>
        <div>
          <h2>{{ profile.name }}</h2>
          <p>{{ profile.email }}</p>
        </div>
      </div>

      <div>
        <pre>{{ JSON.stringify(profile, null, 2) }}</pre>
      </div>
    </div>
    <div v-else>No Logged</div>
    <hr />
    <div>
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import authConfig from '../../../auth_config.json'

export default {
  data() {
    return {
      profile: this.$auth.profile,
      response: null,
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    handleLoginEvent(data) {
      this.profile = data.profile
    },
    async getInfo() {
      if (this.profile) {
        const userId = encodeURI(this.profile.sub)
        const accessToken = await this.$auth.getAccessToken()
        const url = `https://${authConfig.domain}/userinfo`
        console.log('getInfo', { userId, accessToken, url })
        try {
          const { data } = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })

          console.log('data', data)
          this.response = data
        } catch (e) {
          this.response = `Error: ${e.message}`
        }
      } else {
        this.response = 'No profile'
      }
    },
  },
}
</script>

 <style scoped>
img {
  max-width: 100px;
}
</style>