import { hasPermission, logAction } from '../../core/utils.js'
import { getSettings } from '../../core/settings.js'
import { Flashcore, color, logger } from '@roboplay/robo.js'
import { Colors, PermissionFlagsBits } from 'discord.js'
import type { CommandConfig, CommandResult } from '@roboplay/robo.js'
import type { CommandInteraction, GuildMember, MessageCreateOptions } from 'discord.js'

export const config: CommandConfig = {
	defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
	description: `Forgive a member and clear their strikes`,
	dmPermission: false,
	options: [
		{
			name: 'member',
			description: 'The @member to forgive',
			type: 'user',
			required: true
		},
		{
			name: 'reason',
			description: 'The reason for forgiving the member'
		},
		{
			name: 'anonymous',
			description: 'Whether to send the warning anonymously',
			type: 'boolean'
		}
	]
}

export default async (interaction: CommandInteraction): Promise<CommandResult> => {
	const anonymous = (interaction.options.get('anonymous')?.value as boolean) ?? true
	const member = interaction.options.get('member')?.member as GuildMember
	const reason = interaction.options.get('reason')?.value as string

	// Validate permissions
	if (!hasPermission(interaction, 'ModerateMembers')) {
		logger.debug(`User @${interaction.user.username} does not have permission to run ${color.bold('/mod warn')}`)
		return {
			content: `You don't have permission to use this.`,
			ephemeral: true
		}
	}

	// Update infractions
	await Flashcore.set('infractions', 0, {
		namespace: interaction.guildId + '-' + member.id
	})

	// Prepare message payload
	const messagePayload: CommandResult = {
		content: member.toString(),
		embeds: [
			{
				title: `You have been forgiven`,
				thumbnail: {
					url: member.displayAvatarURL()
				},
				description: reason ?? '',
				color: Colors.Green,
				footer: {
					text: '✅ You now have 0 infractions.'
				}
			}
		]
	}

	// Log action to modlogs channel if this is not it
	const { logsChannelId } = await getSettings(interaction.guildId)
	if (interaction.channelId !== logsChannelId) {
		logAction(interaction.guildId, {
			embeds: [
				{
					title: `Member forgiven`,
					thumbnail: {
						url: member.displayAvatarURL()
					},
					description: `${member} has been forgiven by ${interaction.user}`,
					color: Colors.Green,
					timestamp: new Date().toISOString(),
					footer: {
						icon_url: interaction.user.displayAvatarURL(),
						text: 'by @' + interaction.user.username
					}
				}
			]
		})
	}

	if (anonymous) {
		await interaction.channel?.send(messagePayload as MessageCreateOptions)

		return {
			content: 'Strikes have been cleared for ' + member.user.username,
			ephemeral: true
		}
	}

	return messagePayload
}
