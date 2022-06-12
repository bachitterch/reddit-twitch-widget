import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { getStreams } from './twitch/getStreams'

dotenv.config()

const subreddit = 'bachitters_playground'
const clientId = process.env.REDDIT_CLIENT_ID || ''
const clientSecret = process.env.REDDIT_CLIENT_SECRET
const username = process.env.REDDIT_USERNAME
const password = process.env.REDDIT_PASSWORD

const getOAuthToken = async () => {
  const response = await fetch(`https://www.reddit.com/api/v1/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Client-ID': clientId,
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`,
      'User-Agent': 'bachitters-playground-bot'
    },
    body: `grant_type=password&username=${username}&password=${password}&scope=modwiki%20wikiedit%20wikiread%20structuredstyles`
  })

  const { access_token } = (await response.json()) as { access_token: string }

  return access_token
}

const getWidgets = async () => {
  const accessToken = await getOAuthToken()

  const response = await fetch(
    `https://www.reddit.com/r/${subreddit}/wiki/pages`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `bearer ${accessToken}`,
        'User-Agent': 'bachitters-playground-bot'
      }
    }
  ).then(res => {
    console.log(res)
  })
}

getWidgets()
