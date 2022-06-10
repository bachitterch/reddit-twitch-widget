import { Streamer } from './types'

export const renderSreams = (streams: Streamer[]) => {
  if (streams.length === 0) {
    return 'No members online'
  }

  const streamList = streams
    .map((streamer: Streamer) => {
      return `${streamer.user_name} - ${streamer.viewer_count}`
    })
    .join('\n')

  return streamList + '\n'
}
