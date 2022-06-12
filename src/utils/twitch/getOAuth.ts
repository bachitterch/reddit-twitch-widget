import dotenv from 'dotenv'
const fetch = require('node-fetch')

dotenv.config()

const clientId = process.env.TWITCH_CLIENT_ID
const clientSecret = process.env.TWITCH_CLIENT_SECRET

// Get OAuth token for Twitch API
export const getOAuth = async () => {
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    {
      method: 'POST'
    }
  )

  const result: Response = await response.json()
  const { access_token } = result

  return access_token
}

type Response = {
  access_token: string
  expires_in: number
  token_type: string
}