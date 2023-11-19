// @ts-expect-error - no types
import { packageJson } from '@roboplay/robo.js/dist/cli/utils/utils.js'
import { Command } from 'commander'
import { logger } from '../core/logger.js'
import { checkSageUpdates, checkUpdates, cmd, exec, getPackageManager } from '../core/utils.js'
import { loadConfig } from '@roboplay/robo.js/dist/core/config.js'
import { prepareFlashcore } from '@roboplay/robo.js/dist/core/flashcore.js'
import { color, composeColors } from '../core/color.js'
import fs from 'node:fs'
import path from 'node:path'
import inquirer from 'inquirer'

const command = new Command('upgrade')
	.description('Upgrades your Robo to the latest version')
	.option('-f --force', 'forcefully install')
	.option('-ns --no-self-check', 'do not check for updates to Sage CLI')
	.option('-s --silent', 'do not print anything')
	.option('-v --verbose', 'print more information for debugging')
	.action(upgradeAction)
export default command

interface UpgradeOptions {
	force?: boolean
	selfCheck?: boolean
	silent?: boolean
	verbose?: boolean
}

// TODO:
// - Auto accept option for ci
async function upgradeAction(options: UpgradeOptions) {
	// Create a logger
	logger({
		enabled: !options.silent,
		level: options.verbose ? 'debug' : 'info'
	}).info(`Checking for updates...`)
	logger.debug(`CLI Options:`, options)
	logger.debug(`Package manager:`, getPackageManager())
	logger.debug(`Current working directory:`, process.cwd())
	if (options.selfCheck) {
		await checkSageUpdates()
	}

	const config = await loadConfig()
	await prepareFlashcore()

	// Check NPM registry for updates
	const update = await checkUpdates(packageJson, config, true)
	logger.debug(`Update payload:`, update)

	// Exit if there are no updates
	if (!update.hasUpdate) {
		logger.ready(`Your Robo is up to date! 🎉`)
		return
	}

	// Let user choose whether to upgrade or show changelog
	const upgradeOptions = [
		{ name: 'Yes, upgrade!', value: 'upgrade' },
		{ name: 'Cancel', value: 'cancel' }
	]
	if (update.changelogUrl) {
		upgradeOptions.splice(1, 0, { name: 'Read changelog', value: 'changelog' })
	}

	logger.info(
		composeColors(color.green, color.bold)(`A new version of Robo.js is available!`),
		color.dim(`(v${packageJson.version} -> v${update.latestVersion})`)
	)
	logger.log('')
	const { upgradeChoice } = await inquirer.prompt([
		{
			type: 'list',
			name: 'upgradeChoice',
			message: 'Would you like to upgrade?',
			choices: upgradeOptions
		}
	])
	logger.log('')
	logger.debug(`Upgrade choice:`, upgradeChoice)

	// Exit if user cancels
	if (upgradeChoice === 'cancel') {
		logger.info(`Cancelled upgrade.`)
		return
	}

	// Show changelog
	if (upgradeChoice === 'changelog') {
		const changelog = await getChangelog(update.changelogUrl)
		printChangelog(changelog)

		// Let user choose whether to upgrade or not
		const { upgrade } = await inquirer.prompt([
			{
				type: 'list',
				name: 'upgrade',
				message: 'So, would you like to upgrade?',
				choices: [
					{ name: 'Yes, upgrade!', value: true },
					{ name: 'Cancel', value: false }
				]
			}
		])
		logger.log('')

		// Exit if user cancels
		if (!upgrade) {
			logger.info(`Cancelled upgrade.`)
			return
		}
	}

	// Update with the same package manager
	const packageManager = getPackageManager()
	const command = packageManager === 'npm' ? 'install' : 'add'
	logger.debug(`Package manager:`, packageManager)

	await exec(`${cmd(packageManager)} ${command} ${packageJson.name}@${update.latestVersion}`)

	// Check what needs to be changed
	const data = await check(update.latestVersion)
	logger.debug(`Check data:`, data)

	if (data.breaking.length === 0 && data.suggestions.length === 0) {
		logger.info(`No changes to apply.`)
	} else {
		// Let user choose which changes to apply
		const { changes } = await inquirer.prompt([
			{
				type: 'checkbox',
				name: 'changes',
				message: 'Which changes would you like to apply?',
				choices: [
					...data.breaking.map((change) => ({ name: change.name, value: change })),
					new inquirer.Separator(),
					...data.suggestions.map((change) => ({ name: change.name, value: change }))
				]
			}
		])
		logger.log('')
		await execute(changes)
	}

	logger.ready(`Successfully upgraded to v${update.latestVersion}! 🎉`)
}

interface Changelog {
	version: string
	patch: string[]
	major: string[]
	minor: string[]
}

async function getChangelog(url: string): Promise<Changelog | null> {
	try {
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}

		const data = await response.text()
		let currentChangelog: Changelog | null = null
		let currentChangeType: 'patch' | 'minor' | 'major' | null = null

		for (const line of data.split('\n')) {
			const versionMatch = line.match(/^## (\d+\.\d+\.\d+)/)
			if (versionMatch) {
				if (currentChangelog) break
				currentChangelog = { version: versionMatch[1], patch: [], major: [], minor: [] }
				continue
			}

			const changeTypeMatch = line.match(/^### (Patch|Minor|Major) Changes/)
			if (changeTypeMatch) {
				currentChangeType = changeTypeMatch[1].toLowerCase() as 'patch' | 'minor' | 'major'
				continue
			}

			if (currentChangelog && currentChangeType) {
				const changeMatch = line.match(/^- [a-f0-9]+: (.+)/)
				if (changeMatch) {
					currentChangelog[currentChangeType].push(changeMatch[1])
				}
			}
		}

		return currentChangelog
	} catch (error) {
		logger.error('Failed to fetch and process the changelog', error)
		return null
	}
}

function printChangelog(changelog: Changelog) {
	logger.log(composeColors(color.bold, color.blue, color.underline)(`Version: ${changelog.version}`))

	if (changelog.major.length > 0) {
		logger.log(composeColors(color.red, color.bold)('Major Changes:'))
		changelog.major.forEach((change) => logger.log(`- ${change}`))
	}

	if (changelog.minor.length > 0) {
		logger.log(composeColors(color.bold, color.yellow)('Minor Changes:'))
		changelog.minor.forEach((change) => logger.log(`- ${change}`))
	}

	if (changelog.patch.length > 0) {
		logger.log(composeColors(color.bold, color.green)('Patch Changes:'))
		changelog.patch.forEach((change) => logger.log(`- ${change}`))
	}

	logger.log('\n')
}

export interface Change {
	id: number
	name: string
	description: string
}

export interface CheckResult {
	breaking: Change[]
	suggestions: Change[]
}

let _id = 0

const CHANGES: Record<string, Change> = {
	configDirectory: {
		id: ++_id,
		name: 'Config directory',
		description: 'The config directory has been renamed from `.config` to `config`.'
	}
}

/**
 * Checks for any changes between current and target version.
 *
 * This is to be called after the upgrade has been installed, but before
 * executing this upgrade script. This is to ensure that the user is able
 * to select which changes they want to apply and why.
 *
 * @param version The target version being upgraded to
 * @param config The current Robo config
 * @param manifest The current Robo manifest
 */
async function check(version: string): Promise<CheckResult> {
	logger.info(`Checking version ${version}...`)
	const breaking: Change[] = []
	const suggestions: Change[] = []

	// Check for breaking changes
	if (fs.existsSync(path.join(process.cwd(), '.config'))) {
		breaking.push(CHANGES.configDirectory)
	}

	return { breaking, suggestions }
}

/**
 * Executes the changes selected by the user.
 *
 * @param changes The changes selected by the user
 * @param config The current Robo config
 * @param manifest The current Robo manifest
 */
async function execute(changes: Change[]) {
	logger.info(`Applying changes:`, changes.map((change) => change.name).join(', '))

	for (const change of changes) {
		if (change.id === CHANGES.configDirectory.id) {
			logger.debug(`Renaming config directory...`)
			fs.renameSync(path.join(process.cwd(), '.config'), path.join(process.cwd(), 'config'))
		}
	}

	logger.info(`Successfully applied changes!`)
}
