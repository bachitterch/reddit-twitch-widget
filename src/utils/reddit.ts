import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const subreddit = process.env.SUBREDDIT
const clientId = process.env.REDDIT_CLIENT_ID || ''
const clientSecret = process.env.REDDIT_CLIENT_SECRET
const username = process.env.REDDIT_USERNAME
const password = process.env.REDDIT_PASSWORD

export const getOAuthToken = async () => {
  const { data } = await axios({
    method: 'POST',
    url: 'https://www.reddit.com/api/v1/access_token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Client-ID': clientId,
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`,
      'User-Agent': 'bachitters-playground-bot'
    },
    data: `grant_type=password&username=${username}&password=${password}&scope=modwiki%20wikiedit%20wikiread%20structuredstyles%20read`
  })

  const { access_token } = data

  return access_token
}

export const getWidgetId = async () => {
  const accessToken = await getOAuthToken()

  const response = await axios
    .get(`https://oauth.reddit.com/r/${subreddit}/api/widgets`, {
      headers: {
        Authorization: `bearer ${accessToken}`,
        'User-Agent': 'bachitters-playground-bot'
      }
    })
    .then(res => {
      return res.data.items.widget_19540u970qjc6.id
    })

  return response
}
