// @ts-check

/**
 * @type {import('@roboplay/robo.js').Config}
 **/
export default {
	clientOptions: {
		intents: [
			'AutoModerationConfiguration',
			'AutoModerationExecution',
			'DirectMessages',
			'Guilds',
			'GuildBans',
			'GuildMessages',
			'GuildModeration',
			'MessageContent'
		]
	},
	invite: {
		autoPermissions: false,
		permissions: [
			'BanMembers',
			'KickMembers',
			'ManageChannels',
			'ManageMessages',
			'ModerateMembers',
			'ReadMessageHistory',
			'ViewChannel',
			'ViewAuditLog'
		]
	},
	plugins: [],
	type: 'plugin'
}
