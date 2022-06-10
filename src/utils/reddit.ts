import dotenv from 'dotenv'
import Snoowrap from 'snoowrap'
import { getStreams } from './twitch/getStreams'

dotenv.config()

const subredditid = 'bachitters_playground'

const client = new Snoowrap({
  userAgent: 'streamers-list-bot',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
})

const updateSidebar = async () => {
  const streams = await getStreams()
  const streamers = streams
    .map(
      stream =>
        `[${stream.username}](https://twitch.tv/${stream.username}) - ${stream.viewers}`
    )
    .join('\n')
  const sidebar = `${streamers}`

  client.getSubreddit(subredditid).getWikiPage('index').edit({
    text: sidebar
  })
}

updateSidebar()
