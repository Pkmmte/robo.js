// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
	// By default, Docusaurus generates a sidebar from the docs folder structure
	// tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

	// But you can create a sidebar manually
	tutorialSidebar: [
		{
			type: 'html',
			value: 'Start Here',
			className: 'sidebar-title'
		},
		{
			id: 'getting-started',
			label: '✨ Getting Started',
			type: 'doc'
		},
		{
			type: 'html',
			value: 'Core Concepts',
			className: 'sidebar-title'
		},
		{
			type: 'category',
			label: 'Command Line',
			link: {
				id: 'cli/overview',
				type: 'doc'
			},
			items: [
				{
					id: 'cli/overview',
					label: '✨ Overview',
					type: 'doc'
				},
				'cli/create-robo',
				'cli/robo'
			]
		},
		{
			type: 'category',
			label: 'Core Package',
			link: {
				id: 'robojs/overview',
				type: 'doc'
			},
			items: [
				{
					id: 'robojs/overview',
					label: '✨ Overview',
					type: 'doc'
				},
				'robojs/config',
				'robojs/environment-variables',
				'robojs/flashcore',
				{
					id: 'robojs/internals',
					label: '👀 Internals',
					type: 'doc'
				},
				'robojs/linting',
				'robojs/logger',
				'robojs/mode',
				'robojs/modules',
				'robojs/portal',
				'robojs/files',
				'robojs/state',
				'robojs/typescript'
			]
		},
		{
			type: 'category',
			label: 'Hosting',
			link: {
				id: 'hosting/overview',
				type: 'doc'
			},
			items: [
				{
					id: 'hosting/overview',
					label: '✨ Overview',
					type: 'doc'
				},
				'hosting/roboplay',
				'hosting/self-host'
			]
		},
		{
			type: 'category',
			label: 'Plugins',
			link: {
				id: 'plugins/overview',
				type: 'doc'
			},
			items: [
				{
					id: 'plugins/overview',
					label: '✨ Overview',
					type: 'doc'
				},
				'plugins/create',
				'plugins/install',
				'plugins/seed'
			]
		},
		{
			type: 'html',
			value: 'Building Apps',
			className: 'sidebar-title'
		},
		{
			type: 'category',
			label: 'Discord Activities',
			link: {
				id: 'discord-activities/getting-started',
				type: 'doc'
			},
			items: [
				{
					id: 'discord-activities/getting-started',
					label: '✨ Getting Started',
					type: 'doc'
				},
				'discord-activities/authentication',
				{
					id: 'discord-activities/credentials',
					label: '🔑 Credentials',
					type: 'doc'
				},
				'discord-activities/proxy',
				'discord-activities/multiplayer'
			]
		},
		{
			type: 'category',
			label: 'Discord Bots',
			link: {
				id: 'discord-bots/getting-started',
				type: 'doc'
			},
			items: [
				{
					id: 'discord-bots/getting-started',
					label: '✨ Getting Started',
					type: 'doc'
				},
				'discord-bots/beginner-guide',
				'discord-bots/commands',
				'discord-bots/context-menu',
				{
					id: 'discord-bots/credentials',
					label: '🔑 Credentials',
					type: 'doc'
				},
				'discord-bots/debug',
				'discord-bots/events',
				'discord-bots/file-structure',
				'discord-bots/invite',
				'discord-bots/middleware',
				{
					id: 'discord-bots/migrate',
					label: '🚚 Migration',
					type: 'doc'
				},
				'discord-bots/sage'
			]
		},
		{
			type: 'html',
			value: 'Ecosystem',
			className: 'sidebar-title'
		},
		{
			type: 'link',
			label: 'Contributing',
			href: 'https://github.com/Wave-Play/robo.js/blob/main/CONTRIBUTING.md'
		},
		{
			type: 'link',
			label: 'Discord Community',
			href: '/discord'
		},
		{
			type: 'link',
			label: 'Plugins',
			href: '/plugins/directory'
		},
		{
			type: 'link',
			label: 'Templates',
			href: '/templates'
		}
	],
	pluginsSidebar: [
		{
			type: 'html',
			value: 'Directory',
			className: 'sidebar-title'
		},
		{
			id: 'plugins/directory',
			label: '✨ Overview',
			type: 'doc'
		},
		{
			type: 'html',
			value: 'Plugins',
			className: 'sidebar-title'
		},
		'plugins/ai',
		'plugins/ai-voice',
		'plugins/analytics',
		'plugins/better-stack',
		'plugins/cron',
		'plugins/dev',
		'plugins/maintenance',
		'plugins/moderation',
		'plugins/patch',
		'plugins/server',
		'plugins/sync',
		'plugins/trpc'
	],
	templateSidebar: [
		{
			type: 'html',
			value: 'Directory',
			className: 'sidebar-title'
		},
		{
			type: 'link',
			label: '✨ Overview',
			href: '/templates'
		},
		{
			type: 'html',
			value: 'Templates',
			className: 'sidebar-title'
		},
		{
			type: 'category',
			label: 'Discord Activities',
			items: [
				'templates/discord-activities/2d-game',
				'templates/discord-activities/godot',
				'templates/discord-activities/react-colyseus-ts',
				'templates/discord-activities/react-firebase-ts',
				'templates/discord-activities/react-js',
				'templates/discord-activities/react-multiplayer-video-ts',
				'templates/discord-activities/react-music-proxy-ts',
				'templates/discord-activities/react-tailwind-shadcn-ts',
				'templates/discord-activities/react-tailwind-ts',
				'templates/discord-activities/react-trpc-ts',
				'templates/discord-activities/react-ts',
				'templates/discord-activities/unity',
				'templates/discord-activities/vanilla-js',
				'templates/discord-activities/vanilla-ts'
			]
		},
		{
			type: 'category',
			label: 'Discord Bots',
			items: [
				'templates/discord-bots/ai-chatbot-ts',
				'templates/discord-bots/analytics-ts',
				'templates/discord-bots/bake-n-take-js',
				'templates/discord-bots/bake-n-take-ts',
				'templates/discord-bots/docker-ts',
				'templates/discord-bots/economy-ts',
				'templates/discord-bots/mongodb-ts',
				'templates/discord-bots/mrjawesome-dev-toolkit-js',
				'templates/discord-bots/mrjawesome-dev-toolkit-ts',
				'templates/discord-bots/mrjawesome-slash-commands-js',
				'templates/discord-bots/mrjawesome-slash-commands-ts',
				'templates/discord-bots/postgres-ts',
				'templates/discord-bots/prisma-ts',
				'templates/discord-bots/purrth-vader-ts',
				'templates/discord-bots/starter-js',
				'templates/discord-bots/starter-ts',
				'templates/discord-bots/tagbot'
			]
		},
		{
			type: 'category',
			label: 'Plugins',
			items: ['templates/plugins/starter-js']
		},
		{
			type: 'category',
			label: 'Web Apps',
			items: [
				'templates/web-apps/react-js',
				'templates/web-apps/react-ts',
				'templates/web-apps/svelte-js',
				'templates/web-apps/svelte-ts'
			]
		}
	],
	typedocSidebar: [
		{
			type: 'html',
			value: 'Framework',
			className: 'sidebar-title'
		},
		{
			id: 'ref/framework',
			label: '✨ Overview',
			type: 'doc'
		},
		{
			type: 'category',
			label: 'Core APIs',
			items: [
				{
					id: 'ref/framework/Class.Env',
					label: 'Env',
					type: 'doc'
				},
				{
					id: 'ref/framework/Variable.Flashcore',
					label: 'Flashcore',
					type: 'doc'
				},
				{
					id: 'ref/framework/Class.Logger',
					label: 'Logger',
					type: 'doc'
				},
				{
					id: 'ref/framework/Variable.Mode',
					label: 'Mode',
					type: 'doc'
				},
				{
					id: 'ref/framework/Variable.Robo',
					label: 'Robo',
					type: 'doc'
				},
				{
					id: 'ref/framework/Class.State',
					label: 'State',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: 'Types',
			items: [
				{
					id: 'ref/framework/Interface.CommandConfig',
					label: 'CommandConfig',
					type: 'doc'
				},
				{
					id: 'ref/framework/TypeAlias.CommandContext',
					label: 'CommandContext',
					type: 'doc'
				},
				{
					id: 'ref/framework/TypeAlias.CommandIntegrationType',
					label: 'CommandIntegrationType',
					type: 'doc'
				},
				{
					id: 'ref/framework/Interface.CommandOption',
					label: 'CommandOption',
					type: 'doc'
				},
				{
					id: 'ref/framework/TypeAlias.CommandOptionTypes',
					label: 'CommandOptionTypes',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: 'Utilities',
			items: [
				{
					id: 'ref/framework/Variable.color',
					label: 'color',
					type: 'doc'
				},
				{
					id: 'ref/framework/Function.composeColors',
					label: 'composeColors',
					type: 'doc'
				},
				{
					id: 'ref/framework/Function.createCommandConfig',
					label: 'createCommandConfig',
					type: 'doc'
				},
				{
					id: 'ref/framework/Function.getConfig',
					label: 'getConfig',
					type: 'doc'
				},
				{
					id: 'ref/framework/Function.getPluginOptions',
					label: 'getPluginOptions',
					type: 'doc'
				}
			]
		},
		{
			type: 'html',
			value: 'Plugins',
			className: 'sidebar-title'
		},
		{
			type: 'category',
			label: '@robojs/ai',
			items: [
				{
					id: 'ref/@robojs/ai/Variable.AI',
					label: 'AI',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/ai/Function.selectOne',
					label: 'selectOne',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: '@robojs/ai-voice',
			items: [
				{
					id: 'ref/@robojs/ai-voice/Function.textToSpeech',
					label: 'textToSpeech',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: '@robojs/analytics',
			items: [
				{
					id: 'ref/@robojs/analytics/Variable.Analytics',
					label: 'Analytics',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/analytics/Class.GoogleAnalytics',
					label: 'GoogleAnalytics',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/analytics/Class.ManyEngines',
					label: 'ManyEngines',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/analytics/Class.PlausibleAnalytics',
					label: 'PlausibleAnalytics',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: '@robojs/better-stack',
			items: [
				{
					id: 'ref/@robojs/better-stack/Function.createLogtailDrain',
					label: 'createLogtailDrain',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: '@robojs/cron',
			items: [
				{
					id: 'ref/@robojs/cron/Function.Cron',
					label: 'Cron',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/cron/Variable.Patterns',
					label: 'Patterns',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: '@robojs/moderation',
			items: [
				{
					id: 'ref/@robojs/moderation/Function.getLockdown',
					label: 'getLockdown',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: '@robojs/patch',
			items: [
				{
					id: 'ref/@robojs/patch/Variable.DiscordProxy',
					label: 'DiscordProxy',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: '@robojs/server',
			items: [
				{
					id: 'ref/@robojs/server/Function.getServerEngine',
					label: 'getServerEngine',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/server/Function.ready',
					label: 'ready',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/server/Interface.RoboReply',
					label: 'RoboReply',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/server/Class.RoboRequest',
					label: 'RoboRequest',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/server/Class.RoboResponse',
					label: 'RoboResponse',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/server/Variable.Server',
					label: 'Server',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: '@robojs/sync',
			items: [
				{
					id: 'ref/@robojs/sync/Interface.MessagePayload',
					label: 'MessagePayload',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/sync/Function.SyncContextProvider',
					label: 'SyncContextProvider',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/sync/Function.useSyncState',
					label: 'useSyncState',
					type: 'doc'
				}
			]
		},
		{
			type: 'category',
			label: '@robojs/trpc',
			items: [
				{
					id: 'ref/@robojs/trpc/Interface.Context',
					label: 'Context',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/trpc/Function.createTRPCClient',
					label: 'createTRPCClient',
					type: 'doc'
				},
				{
					id: 'ref/@robojs/trpc/Function.createTRPCReact',
					label: 'createTRPCReact',
					type: 'doc'
				},
				/*{
					id: 'ref/@robojs/trpc/Function.httpBatchLink',
					label: 'httpBatchLink',
					type: 'doc'
				},*/
				{
					id: 'ref/@robojs/trpc/Function.TRPCProvider',
					label: 'TRPCProvider',
					type: 'doc'
				}
			]
		}
	]
}

module.exports = sidebars
