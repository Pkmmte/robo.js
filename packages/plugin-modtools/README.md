# Enhanced Moderation Plugin

Tailored for Discord server management, this plugin includes a suite of commands essential for moderation. With enhanced features like anonymous warnings, attachment inclusion in reports, and comprehensive mod channel logs, it takes moderation to the next level.

➞ [📚 **Documentation:** Getting started](https://roboplay.dev/docs)

➞ [🚀 **Community:** Join our Discord server](https://roboplay.dev/discord)

## Installation 💻

To add this plugin to your Robo.js project:

```bash
npx robo add @roboplay/plugin-modtools
```

## Slash Commands

Utilize these commands for efficient moderation:

| Command        | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `/mod audit`   | Delve into a member's server interactions and activities.     |
| `/mod ban`     | Effectively ban members who violate server rules.             |
| `/mod forgive` | Clear strikes or infractions, offering members a fresh start. |
| `/mod kick`    | Temporarily remove disruptive members from your server.       |
| `/mod report`  | Facilitate community-driven reporting of issues.              |
| `/mod setup`   | Initiate and configure your moderation setup.                 |
| `/mod timeout` | Impose timeouts on members for cooling-off periods.           |
| `/mod warn`    | Issue warnings to members, adding to their strike count.      |

## Context Commands

Enhance user experience with context-specific commands:

| Command                        | Description                                        |
| ------------------------------ | -------------------------------------------------- |
| `Report Anonymously` (Message) | Enable members to report issues anonymously.       |
| `Audit` (User)                 | Quickly access a user's activity log with a click. |

## Moderation Channels

Moderation channels are dedicated spaces for tracking and managing server activities:

<!-- - **Audit Logs**: Comprehensive records of user interactions and changes. -->
- **Moderator Logs**: Detailed logs of every moderation action taken.
- **Moderator Mail**: Central hub for receiving and managing user reports.

## Seamless Setup

Once you add the plugin, run the `/mod setup` command as a moderator to configure your moderation tools:

- **Moderation Channels**: Set up your moderation channels for logging and reporting.
- **Test Mode**: Safely simulate moderation actions for training purposes.
- **Confirmation Mode**: Require explicit confirmation for each action, avoiding accidental moderation.

## AI Integration

> *"**@SageBot** please ban **@Baguette** for spamming bread"*

Integrate with [`@roboplay/plugin-ai`](https://github.com/Wave-Play/robo.js/tree/main/packages/plugin-ai) to experience the next level of moderation. Use natural language for commands and watch your Robo execute them with AI's understanding.

```bash
npx robo add @roboplay/plugin-ai
```

## Starting Your Robo.js Journey

If you're new to Robo.js:

```bash
npx create-robo <name>
```

Enjoy your enhanced moderation experience! 🚀
