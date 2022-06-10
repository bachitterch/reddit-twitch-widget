import dotenv from 'dotenv'
const fetch = require('node-fetch')
import Streamers from '../../Streamers'
import { getOAuth } from './getOAuth'

dotenv.config()

const clientId = process.env.TWITCH_CLIENT_ID || ''

const nameStrings = Streamers.map(stream => `&user_login=${stream}`).join('')

const TWITCH_STREAMS_ENDPOINT = 'https://api.twitch.tv/helix/streams'

const getStreams = async () => {
  const token = await getOAuth()
  const endpoint = TWITCH_STREAMS_ENDPOINT + '?first=100' + nameStrings

  const response = await fetch(endpoint, {
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`
    }
  })
  const result: Response = await response.json()

  const streams = result.data.map((stream: Stream) => {
    return {
      title: stream.title,
      username: stream.user_name,
      game_name: stream.game_name,
      viewers: stream.viewer_count
    }
  })

  return streams
}

getStreams().then(streams => {
  console.log(streams)
})

type Stream = {
  title: string
  viewer_count: number
  user_name: string
  game_name: string
}

interface Response {
  data: Stream[]
}
