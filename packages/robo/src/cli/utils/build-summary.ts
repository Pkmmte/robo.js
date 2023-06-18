import fs from 'node:fs/promises'
import path from 'node:path'
import { logger } from '../../core/logger.js'
import { CommandEntry, Manifest } from '../../types/index.js'
import { packageJson } from './utils.js'
import { color, composeColors, hex } from '../../core/color.js'

export async function getProjectSize(directory: string): Promise<number> {
	let entries = await fs.readdir(directory, { withFileTypes: true })
	let size = 0

	// devDependencies don't count towards the project size
	if (directory.endsWith('node_modules')) {
		entries = entries.filter(
			(entry) =>
				!Object.prototype.hasOwnProperty.call(packageJson.devDependencies ?? {}, entry.name) && entry.name !== '.bin'
		)
	}

	for (const entry of entries) {
		const entryPath = path.join(directory, entry.name)

		if (entry.isDirectory()) {
			size += await getProjectSize(entryPath)
		} else if (entry.isFile() && entry.name !== '.DS_Store') {
			const stats = await fs.stat(entryPath)
			size += stats.size
		}
	}

	return size
}

export function printBuildSummary(manifest: Manifest, totalSize: number, startTime: number, plugin: boolean) {
	const maxLength = Math.min(Math.max(...Object.keys(manifest.commands).map((cmd) => cmd.length), 15), 30)
	const maxTypeNameLength = Math.max(
		...['Command', 'Subcommand', 'Subcommand Group', 'Event'].map((type) => type.length)
	)

	const headerType = 'Type'
	const headerName = 'Name'
	const headerDescription = 'Description'

	// +4 to account for autoSymbol spacing, +1 for a space between type and name
	const headerTypeSpacing = ' '.repeat(maxTypeNameLength - headerType.length + 4)
	const headerNameSpacing = ' '.repeat(maxLength - headerName.length + 1)

	logger.log(color.bold(`\n${headerType}${headerTypeSpacing}${headerName}${headerNameSpacing}${headerDescription}`))
	logger.log(`─`.repeat(maxLength + maxTypeNameLength + headerDescription.length + 5))

	let autoGeneratedExists = false

	function logCommands(commands: Record<string, CommandEntry>, prefix = '', depth = 0) {
		for (const [command, commandData] of Object.entries(commands)) {
			if (commandData.subcommands) {
				logCommands(commandData.subcommands, prefix ? `${prefix} ${command}` : command, depth + 1)
				continue
			}

			const autoSymbol = commandData.__auto ? '  Δ ' : '    '
			if (commandData.__auto) {
				autoGeneratedExists = true
			}
			const fullPath = prefix ? `${prefix} ${command}` : command
			let type = 'Command'
			if (depth === 1) type = 'Subcommand'
			if (depth >= 2) type = 'Subcommand Group'

			const typeSpacing = ' '.repeat(maxTypeNameLength - type.length + 1)

			logger.log(
				color.bold(color.blue(type + typeSpacing + autoSymbol)) +
					`${color.bold(('/' + fullPath).padEnd(maxLength + 1))} ${commandData.description ?? ''}`
			)
		}
	}
	logCommands(manifest.commands)

	for (const [contextType, contextCommands] of Object.entries(manifest.context)) {
		const type = `Context (${contextType.charAt(0).toUpperCase() + contextType.slice(1)})`

		for (const [context, contextData] of Object.entries(contextCommands)) {
			const autoSymbol = contextData.__auto ? '  Δ ' : '    '
			if (contextData.__auto) {
				autoGeneratedExists = true
			}

			const typeSpacing = ' '.repeat(maxTypeNameLength - type.length + 1)
			logger.log(color.bold(hex('#536DFE')(type + typeSpacing + autoSymbol)) + color.bold(context.padEnd(maxLength + 1)))
		}
	}

	for (const event of Object.keys(manifest.events)) {
		const eventData = manifest.events[event]
		const isAuto = eventData.every((e) => e.__auto)
		const autoSymbol = isAuto ? '  Δ ' : '    '
		if (isAuto) {
			autoGeneratedExists = true
		}

		const type = 'Event'
		const typeSpacing = ' '.repeat(maxTypeNameLength - type.length + 1)
		logger.log(color.bold(color.magenta(type + typeSpacing + autoSymbol)) + `${color.bold(event).padEnd(maxLength + 1)}`)
	}

	// Format sizing information
	let sizeText = ''
	if (totalSize < 1024 * 1024) {
		sizeText = `${(totalSize / 1024).toFixed(2)} kB`
	} else if (totalSize < 1024 * 1024 * 1024) {
		sizeText = `${(totalSize / (1024 * 1024)).toFixed(2)} MB`
	} else {
		sizeText = `${(totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB`
	}

	let sizeColor = color.green
	if (totalSize >= 1024 * 1024 * 1024) {
		sizeColor = composeColors(color.red, color.bgBlack, color.underline)
	} else if (totalSize >= 500 * 1024 * 1024) {
		sizeColor = color.red
	} else if (totalSize >= 100 * 1024 * 1024) {
		sizeColor = color.yellow
	}

	const buildTime = Date.now() - startTime
	let buildColor = color.green
	if (buildTime < 5000) {
		buildColor = color.green
	} else {
		buildColor = color.yellow
	}

	if (autoGeneratedExists) {
		logger.log(color.cyan(`\n${color.bold('Δ')} = Automatically generated`))
	}

	logger.log(color.bold(`\n${plugin ? 'Plugin' : 'Robo'} size: `) + sizeColor(sizeText))
	if (buildTime < 1000) {
		logger.log(buildColor(`Built in ${buildTime}ms\n`))
	} else {
		logger.log(buildColor(`Built in ${(buildTime / 1000).toFixed(2)}s\n`))
	}
}
