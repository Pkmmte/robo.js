import { ApplicationCommandType, ContextMenuCommandBuilder, REST, Routes, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js'
import { logger as globalLogger, Logger } from '../../core/logger.js'
import { performance } from 'node:perf_hooks'
import chalk from 'chalk'
import { loadConfig } from '../../core/config.js'
import { DEFAULT_CONFIG } from '../../core/constants.js'
import { env } from '../../core/env.js'
import { timeout } from './utils.js'
import type { ApplicationCommandOptionBase } from 'discord.js'
import type { CommandEntry, CommandOption, ContextEntry } from '../../types/index.js'

// @ts-expect-error - Global logger is overriden by dev mode
let logger: Logger = globalLogger

export function buildContextCommands(dev: boolean, contextCommands: Record<string, ContextEntry>, type: 'message' | 'user'): ContextMenuCommandBuilder[] {
	if (dev) {
		logger = new Logger({
			enabled: true,
			level: 'info'
		})
	}

	return Object.entries(contextCommands).map(([key, entry]): ContextMenuCommandBuilder => {
		logger.debug(`Building context command: ${key}`)
		const commandBuilder = new ContextMenuCommandBuilder()
			.setName(key)
			.setNameLocalizations(entry.nameLocalizations || {})
			.setType(type === 'message' ? ApplicationCommandType.Message : ApplicationCommandType.User)

		return commandBuilder
	})
}

export function buildSlashCommands(dev: boolean, commands: Record<string, CommandEntry>): SlashCommandBuilder[] {
	if (dev) {
		logger = new Logger({
			enabled: true,
			level: 'info'
		})
	}

	return Object.entries(commands).map(([key, entry]): SlashCommandBuilder => {
		logger.debug(`Building slash command: ${key}`)
		const commandBuilder = new SlashCommandBuilder()
			.setName(key)
			.setNameLocalizations(entry.nameLocalizations || {})
			.setDescription(entry.description || 'No description provided')
			.setDescriptionLocalizations(entry.descriptionLocalizations || {})

		// Add subcommands
		if (entry.subcommands) {
			for (const [subcommandName, subcommandEntry] of Object.entries(entry.subcommands)) {
				// Add subcommands for this subcommand group
				if (subcommandEntry.subcommands) {
					commandBuilder.addSubcommandGroup((subcommandGroup) => {
						subcommandGroup
							.setName(subcommandName)
							.setNameLocalizations(subcommandEntry.nameLocalizations || {})
							.setDescription(subcommandEntry.description || 'No description provided')
							.setDescriptionLocalizations(subcommandEntry.descriptionLocalizations || {})
						for (const [subcommandGroupName, subcommandGroupEntry] of Object.entries(subcommandEntry.subcommands)) {
							// Add subcommands for this subcommand group
							subcommandGroup.addSubcommand((subcommand) => {
								subcommand
									.setName(subcommandGroupName)
									.setNameLocalizations(subcommandGroupEntry.nameLocalizations || {})
									.setDescription(subcommandGroupEntry.description || 'No description provided')
									.setDescriptionLocalizations(subcommandGroupEntry.descriptionLocalizations || {})

								subcommandGroupEntry.options?.forEach((option) => {
									addOptionToCommandBuilder(subcommand, option.type, option)
								})

								return subcommand
							})
						}
						return subcommandGroup
					})
					continue
				}

				// Just add a normal subcommand
				commandBuilder.addSubcommand((subcommand) => {
					subcommand
						.setName(subcommandName)
						.setNameLocalizations(subcommandEntry.nameLocalizations || {})
						.setDescription(subcommandEntry.description || 'No description provided')
						.setDescriptionLocalizations(subcommandEntry.descriptionLocalizations || {})

					subcommandEntry.options?.forEach((option) => {
						addOptionToCommandBuilder(subcommand, option.type, option)
					})

					return subcommand
				})
			}
		} else {
			entry.options?.forEach((option) => {
				addOptionToCommandBuilder(commandBuilder, option.type, option)
			})
		}

		return commandBuilder
	})
}

export function addOptionToCommandBuilder(
	commandBuilder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
	type: string,
	option: CommandOption
) {
	const optionPredicate = <T extends ApplicationCommandOptionBase>(optionBuilder: T) =>
		optionBuilder
			.setName(option.name)
			.setNameLocalizations(option.nameLocalizations ?? {})
			.setDescription(option.description || 'No description provided')
			.setDescriptionLocalizations(option.descriptionLocalizations ?? {})
			.setRequired(option.required || false)

	switch (type) {
		case undefined:
		case null:
		case 'string':
			commandBuilder.addStringOption(optionPredicate)
			break
		case 'integer':
			commandBuilder.addIntegerOption(optionPredicate)
			break
		case 'boolean':
			commandBuilder.addBooleanOption(optionPredicate)
			break
		case 'attachment':
			commandBuilder.addAttachmentOption(optionPredicate)
			break
		case 'channel':
			commandBuilder.addChannelOption(optionPredicate)
			break
		case 'mention':
			commandBuilder.addMentionableOption(optionPredicate)
			break
		case 'role':
			commandBuilder.addRoleOption(optionPredicate)
			break
		case 'user':
			commandBuilder.addUserOption(optionPredicate)
			break
		default:
			logger.warn(`Invalid option type: ${type}`)
	}
}

export function findCommandDifferences(
	oldCommands: Record<string, CommandEntry>,
	newCommands: Record<string, CommandEntry>,
	differenceType: 'added' | 'removed' | 'changed',
	prefix = ''
): string[] {
	let differenceKeys: string[] = []
	const oldKeys = Object.keys(oldCommands)
	const newKeys = Object.keys(newCommands)

	if (differenceType === 'added') {
		differenceKeys = newKeys.filter((key) => !oldKeys.includes(key))
	} else if (differenceType === 'removed') {
		differenceKeys = oldKeys.filter((key) => !newKeys.includes(key))
	} else if (differenceType === 'changed') {
		differenceKeys = oldKeys.filter(
			(key) => newKeys.includes(key) && hasChangedFields(oldCommands[key], newCommands[key])
		)
	}
	differenceKeys = differenceKeys.map((key) => (prefix ? `${prefix} ${key}` : key))

	const allKeys = Array.from(new Set([...oldKeys, ...newKeys]))
	for (const key of allKeys) {
		if (oldCommands[key]?.subcommands || newCommands[key]?.subcommands) {
			const subDifferenceKeys = findCommandDifferences(
				oldCommands[key]?.subcommands ?? {},
				newCommands[key]?.subcommands ?? {},
				differenceType,
				prefix ? `${prefix} ${key}` : key
			)
			differenceKeys = differenceKeys.concat(subDifferenceKeys)

			if (
				(differenceType === 'removed' && oldKeys.includes(key) && !newKeys.includes(key)) ||
				(differenceType === 'added' && newKeys.includes(key) && !oldKeys.includes(key))
			) {
				differenceKeys = differenceKeys.filter((k) => k !== (prefix ? `${prefix} ${key}` : key))
			}
		}
	}

	return differenceKeys
}

function hasChangedFields(obj1: CommandEntry, obj2: CommandEntry): boolean {
	const fieldsToCompare: (keyof CommandEntry)[] = ['description', 'options']

	for (const field of fieldsToCompare) {
		if (field === 'options') {
			if (JSON.stringify(obj1[field]) !== JSON.stringify(obj2[field])) {
				return true
			}
		} else if (obj1[field] !== obj2[field]) {
			return true
		}
	}
	return false
}

export async function registerCommands(
	dev: boolean,
	newCommands: Record<string, CommandEntry>,
	newMessageContextCommands: Record<string, ContextEntry>,
	newUserContextCommands: Record<string, ContextEntry>,
	changedCommands: string[],
	addedCommands: string[],
	removedCommands: string[],
	changedContextCommands: string[],
	addedContextCommands: string[],
	removedContextCommands: string[]
) {
	const config = await loadConfig()
	const { clientId, guildId, token } = env.discord

	if (!token || !clientId) {
		logger.error(
			`${chalk.bold('DISCORD_TOKEN')} or ${chalk.bold('DISCORD_CLIENT_ID')} not found in environment variables`
		)
		return
	}

	const startTime = performance.now()
	const rest = new REST({ version: '9' }).setToken(token)

	try {
		const slashCommands = buildSlashCommands(dev, newCommands)
		const contextMessageCommands = buildContextCommands(dev, newMessageContextCommands, 'message')
		const contextUserCommands = buildContextCommands(dev, newUserContextCommands, 'user')
		const addedChanges = addedCommands.map((cmd) => chalk.green(`/${chalk.bold(cmd)} (new)`))
		const removedChanges = removedCommands.map((cmd) => chalk.red(`/${chalk.bold(cmd)} (deleted)`))
		const updatedChanges = changedCommands.map((cmd) => chalk.blue(`/${chalk.bold(cmd)} (updated)`))
		const addedContextChanges = addedContextCommands.map((cmd) => chalk.green(`${chalk.bold(cmd)} (new)`))
		const removedContextChanges = removedContextCommands.map((cmd) => chalk.red(`${chalk.bold(cmd)} (deleted)`))
		const updatedContextChanges = changedContextCommands.map((cmd) => chalk.blue(`${chalk.bold(cmd)} (updated)`))

		const allChanges = [
			...addedChanges,
			...removedChanges,
			...updatedChanges
		]
		const allContextChanges = [
			...addedContextChanges,
			...removedContextChanges,
			...updatedContextChanges
		]
		if (allChanges.length > 0) {
			logger.info('Command changes: ' + allChanges.join(', '))
		}
		if (allContextChanges.length > 0) {
			logger.info('Context menu changes: ' + allContextChanges.join(', '))
		}

		const commandData = [
			...slashCommands.map((command) => command.toJSON()),
			...contextMessageCommands.map((command) => command.toJSON()),
			...contextUserCommands.map((command) => command.toJSON())
		]
		const registerCommandsPromise = (
			guildId
				? rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandData })
				: rest.put(Routes.applicationCommands(clientId), { body: commandData })
		).then(() => ({ type: 'registerCommands' }))
		const timeoutPromise = timeout(
			() => ({ type: 'timeout' }),
			config.timeouts?.commandRegistration || DEFAULT_CONFIG.timeouts.commandRegistration
		)

		const result = await Promise.race([registerCommandsPromise, timeoutPromise])
		if (result.type === 'timeout') {
			logger.warn(`Command registration timed out. Run ${chalk.bold('robo build --force')} later to try again.`)
			return
		}

		const endTime = Math.round(performance.now() - startTime)
		const commandType = guildId ? 'guild' : 'global'
		logger.info(`Successfully updated ${chalk.bold(commandType + ' commands')} in ${endTime}ms`)
	} catch (error) {
		logger.error('Could not register commands!', error)
		logger.warn(`Run ${chalk.bold('robo build --force')} to try again.`)
	}
}
