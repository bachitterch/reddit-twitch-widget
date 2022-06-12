import dotenv from 'dotenv'
import axios from 'axios'

import { Streamer } from '../types'
import { getOAuth } from './getOAuth'

import Streamers from '../../Streamers'

dotenv.config()

const TWITCH_STREAMS_ENDPOINT = 'https://api.twitch.tv/helix/streams'
const clientId = process.env.TWITCH_CLIENT_ID || ''

// Convert Streamers array to string
const nameStrings = Streamers.map(stream => `&user_login=${stream}`).join('')

export const getStreams = async () => {
  const token = await getOAuth()

  const endpoint = TWITCH_STREAMS_ENDPOINT + '?first=100' + nameStrings

  const response = await axios.get(endpoint, {
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`
    }
  })
  const { data }: Response = await response.data

  const streams = await data.map((stream: Streamer) => {
    return {
      title: stream.title,
      username: stream.user_name,
      game_name: stream.game_name,
      viewers: stream.viewer_count
    }
  })

  return streams
}

interface Response {
  data: Streamer[]
}
