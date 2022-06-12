import dotenv from 'dotenv'
import axios from 'axios'
import { CronJob } from 'cron'
import { getStreams } from './utils/twitch/getStreams'
import { getOAuthToken, getWidgetId } from './utils/reddit'

dotenv.config()

const subreddit = process.env.SUBREDDIT

const updateWidget = async () => {
  const widgetId = await getWidgetId()
  const accessToken = await getOAuthToken()
  const streams = await getStreams()

  const streamdata = streams.map(stream => {
    return `### [${stream.username}](https://twitch.tv/${stream.username}) - ${stream.viewers}  `
  })

  const response = await axios.put(
    `https://oauth.reddit.com/r/${subreddit}/api/widget/${widgetId}`,
    {
      kind: 'textarea',
      shortName: 'Members Currently Live',
      text: `${streamdata.join('\n')}`
    },
    {
      method: 'PUT',
      headers: {
        Authorization: `bearer ${accessToken}`,
        'User-Agent': 'bachitters-playground-bot'
      }
    }
  )

  return response
}

const main = async () => {
  const task = new CronJob('*/15 * * * * *', async () => {
    await updateWidget().catch(err => console.error('error', err))
  })

  task.start()
}

main()
