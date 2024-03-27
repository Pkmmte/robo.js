// @ts-expect-error - This is valid once command file is parsed
import { color, getState, setState } from '@roboplay/robo.js'
// @ts-expect-error - This is valid once command file is parsed
import { STATE_KEYS, discordLogger } from '@roboplay/robo.js/dist/core/constants.js'
import { ChannelType, Client } from 'discord.js'

export default async (client: Client) => {
	discordLogger.ready(`On standby as ${color.bold(client.user.tag)} (${new Date().toLocaleString()})`)

	// Send update message if this Robo was just restarted
	const restartData = getState(STATE_KEYS.restart)
	if (restartData) {
		const { channelId, startTime } = restartData
		const channel = client.channels.cache.get(channelId)

		if (!channel || channel.type !== ChannelType.GuildText) {
			return
		}

		channel.send('```\n' + `Successfully restarted in ${Date.now() - startTime}ms` + '\n```')
		setState(STATE_KEYS.restart, undefined)
	}
}
