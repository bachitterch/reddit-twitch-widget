import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const clientId = process.env.TWITCH_CLIENT_ID
const clientSecret = process.env.TWITCH_CLIENT_SECRET

// Get OAuth token for Twitch API
export const getOAuth = async () => {
  const response = await axios({
    method: 'POST',
    url: `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
  })

  const result: Response = await response.data
  const { access_token } = result

  return access_token
}

type Response = {
  access_token: string
  expires_in: number
  token_type: string
}
