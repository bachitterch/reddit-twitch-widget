import dotenv from 'dotenv'
const fetch = require('node-fetch')
import { getOAuth } from './utils/getOAuth'

dotenv.config()

const clientId = process.env.TWITCH_CLIENT_ID || ''

type Response = {
  data: Stream[]
}

type Stream = {
  title: string
  viewer_count: number
  user_name: string
  user_login: string
  game_name: string
}

const TWITCH_STREAMS_ENDPOINT = 'https://api.twitch.tv/helix/streams'

const getStreams = async (names: string) => {
  const token = await getOAuth()

  const url = TWITCH_STREAMS_ENDPOINT + '?first=100' + names

  const response = await fetch(url, {
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`
    }
  })
  const res: Response = await response.json()
  const streams = res.data.map((stream: Stream) => {
    return {
      title: stream.title,
      viewers: stream.viewer_count,
      user_name: stream.user_name,
      user_logins: stream.user_login,
      game_name: stream.game_name
    }
  })
  console.log(streams)
}

const streams = ['swizzmb', 'whitep4nth3r', 'moboking', 'wolfabelle', 'silent']

const nameStreams = streams.map(stream => `&user_login=${stream}`).join('')

getStreams(nameStreams)
