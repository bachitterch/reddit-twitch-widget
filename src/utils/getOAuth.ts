import dotenv from 'dotenv'
const fetch = require('node-fetch')

dotenv.config()

const clientId = process.env.TWITCH_CLIENT_ID || ''
const clientSecret = process.env.TWITCH_CLIENT_SECRET || ''

export const getOAuth = async () => {
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    {
      method: 'POST'
    }
  )

  const json = await response.json()
  const token: string = json.access_token || ''

  return token
}
