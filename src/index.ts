import axios from 'axios'
import { CronJob } from 'cron'
import dotenv from 'dotenv'
import { getOAuthToken, getWidgetId } from './utils/reddit'
import { getStreams } from './utils/twitch/getStreams'

dotenv.config()

const subreddit = process.env.SUBREDDIT

const updateWidget = async () => {
  const widgetId = await getWidgetId()
  const accessToken = await getOAuthToken()
  const streams = await getStreams()

  let streamdata: string[] = []

  if (streams.length === 0) {
    streamdata.push('**Everyone is offline**')
  } else {
    streamdata = streams.map(stream => {
      const data = `- [**${stream?.username}**](https://twitch.tv/${stream?.username}) - ${stream?.viewers}  `

      return data
    })
  }

  try {
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
  } catch (err) {
    console.dir(err)
  }
}

const main = () => {
  const task = new CronJob('*/30 * * * * *', () => {
    updateWidget()
  })

  task.start()
}

main()
