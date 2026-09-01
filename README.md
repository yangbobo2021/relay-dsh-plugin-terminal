# Relay DSH Terminal Plugin

> **Now supports the latest DSH `0.1.2-alpha.3`.** Plugin `0.2.1` is verified on DSH `0.1.2-alpha.3`, `0.1.2-alpha.2`, and `0.1.1-rc.2`. [Install it and try the latest DSH](https://www.npmjs.com/package/relay-dsh-plugin-terminal) · [Compatibility details](docs/dsh-0.1.2-alpha.3.md).

> **Release channels:** `latest` → `0.2.1`; `next` → `0.2.1-rc.1`.

```bash
npx @deepseek-ai/dsh@0.1.2-alpha.3 plugin --profile web add relay-dsh-plugin-workbench@0.2.1 relay-dsh-plugin-terminal@0.2.1 relay-dsh-plugin-codex@0.2.1
npx @deepseek-ai/dsh@0.1.2-alpha.3 web
```

[![npm version](https://img.shields.io/npm/v/relay-dsh-plugin-terminal?label=npm)](https://www.npmjs.com/package/relay-dsh-plugin-terminal)
[![CI](https://github.com/yangbobo2021/relay-dsh-plugin-terminal/actions/workflows/ci.yml/badge.svg)](https://github.com/yangbobo2021/relay-dsh-plugin-terminal/actions/workflows/ci.yml)
[![npm downloads](https://img.shields.io/npm/dm/relay-dsh-plugin-terminal?label=downloads)](https://www.npmjs.com/package/relay-dsh-plugin-terminal)
[![GitHub stars](https://img.shields.io/github/stars/yangbobo2021/relay-dsh-plugin-terminal?style=flat)](https://github.com/yangbobo2021/relay-dsh-plugin-terminal/stargazers)
[![MIT license](https://img.shields.io/github/license/yangbobo2021/relay-dsh-plugin-terminal)](LICENSE)
[![DSH compatibility](https://img.shields.io/badge/DSH-0.1.1--rc.2%20%7C%200.1.2--alpha.2%20%7C%200.1.2--alpha.3-2f7d68)](https://github.com/deepseek-ai/deepseek-harness)
[![Trusted Publishing](https://img.shields.io/badge/npm_trusted_publishing-next_release-2f9e44)](.github/workflows/release.yml)

English | [中文](README.zh.md)

**npm package:** [`relay-dsh-plugin-terminal`](https://www.npmjs.com/package/relay-dsh-plugin-terminal)
· [All Relay DSH plugins](https://github.com/yangbobo2021/Relay/blob/codex/relay-foundation/docs/dsh-plugins.md)

[![Live npm-installed Relay plugins in official DSH](https://raw.githubusercontent.com/yangbobo2021/Relay/codex/relay-foundation/docs/media/dsh-plugin-suite-demo.gif)](https://github.com/yangbobo2021/Relay/blob/codex/relay-foundation/docs/dsh-plugins.md)

*Real npm-installed demo on official DSH: Terminal starts a live workspace
shell and executes a command below the conversation. [Watch the H.264
MP4](https://github.com/yangbobo2021/Relay/blob/codex/relay-foundation/docs/media/dsh-plugin-suite-demo.mp4?raw=1).*

`relay-dsh-plugin-terminal` adds an xterm-based bottom terminal panel to the
official [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
(DSH) Web UI. It provides the browser terminal surface, bounded scrollback, and a
public provider registry for execution backends.

The plugin uses `relay-dsh-plugin-workbench` as its panel host. Install
Workbench in the same DSH Profile.

![Relay Terminal bottom panel in DSH Web](docs/images/dsh-terminal-panel.png)

The screenshot was captured from official DSH `0.1.1-rc.2` with Workbench,
Files, and Terminal installed. Terminal can load without a provider and shows a
clear provider-unavailable state; install a compatible backend when you want a
live shell.

## Do I Need This Plugin?

Install this plugin when you want to:

- add a terminal panel to official DSH Web through the plugin system;
- use a compatible execution backend, such as `relay-dsh-plugin-codex`, as the
  terminal transport;
- develop another backend that contributes terminal sessions through the public
  `ctx.relayTerminalProviders` registry.

Terminal is provider-neutral. If you install only this package, DSH can load the
panel but cannot start a live shell until another plugin registers a terminal
provider.

## Quick Start With Official DSH

The current development build has been validated with:

- DeepSeek Harness `0.1.1-rc.2`, commit
  [`b150a551`](https://github.com/deepseek-ai/deepseek-harness/commit/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e)
- Node.js 22.13 or newer
- `pnpm` available on `PATH`

DSH is a developer preview and may introduce compatibility-breaking changes.

### 1. Install

Stop a running DSH Web process before changing Profile plugins.

#### GitHub development build

Use this when you want the latest unreleased development build:

```bash
pnpm dlx @deepseek-ai/dsh@0.1.2-alpha.3 plugin --profile web add github:yangbobo2021/relay-dsh-plugin-workbench#main github:yangbobo2021/relay-dsh-plugin-terminal#main
```

For an interactive terminal through Codex, install both development plugins:

```bash
pnpm dlx @deepseek-ai/dsh@0.1.2-alpha.3 plugin --profile web add github:yangbobo2021/relay-dsh-plugin-workbench#main github:yangbobo2021/relay-dsh-plugin-terminal#main github:yangbobo2021/relay-dsh-plugin-codex#main
```

For a reproducible install, replace each `#main` with a tag or full commit SHA.
The Workbench package is listed explicitly because DSH's pnpm profile blocks
GitHub packages as transitive dependencies.

#### npm release

Install the published packages with:

```bash
pnpm dlx @deepseek-ai/dsh@0.1.2-alpha.3 plugin --profile web add relay-dsh-plugin-workbench@latest relay-dsh-plugin-terminal@latest
```

For an interactive terminal through a published Codex plugin:

```bash
pnpm dlx @deepseek-ai/dsh@0.1.2-alpha.3 plugin --profile web add relay-dsh-plugin-workbench@latest relay-dsh-plugin-terminal@latest relay-dsh-plugin-codex@next
```

### 2. Start or restart DSH Web

```bash
pnpm dlx @deepseek-ai/dsh@0.1.2-alpha.3 web
```

If you already have a `dsh` command installed, `dsh web` is equivalent. Restart
DSH Web after installing, updating, or removing plugins.

### 3. Open the terminal panel

In DSH Web:

1. Open the DSH URL printed by the terminal.
2. Complete the first-launch screen if DSH shows one.
3. Create or select a conversation that has a workspace directory.
4. Open the Workbench bottom panel and choose `Terminal`.
5. Start a terminal session.

If no compatible terminal provider is installed, the panel reports that no
interactive terminal provider is available.

## What It Provides

- A `Terminal` view in the Workbench bottom panel
- An xterm-based browser terminal surface
- Bounded scrollback on the Host side
- A versioned `ctx.relayTerminalProviders` registry
- Provider-neutral spawn, input, resize, output, and termination wiring
- Composition with the shared Workbench shell

This package does not spawn shells by itself. Shell execution is supplied by a
provider plugin, currently including the Relay Codex DSH plugin.

### Manual terminal permissions

With the Codex provider, each user-operated terminal explicitly requests
`sandboxPolicy: { type: "dangerFullAccess" }` for its shell. This allows ordinary
SSH connections and user-file writes without changing the shared Codex server
configuration or any Agent conversation's sandbox or approval policy. It does
not grant administrator privileges or bypass operating-system permissions.

Terminal access is equivalent to command execution as the DSH host user. Expose
it only through trusted, authenticated access; a session ID is not an
authentication credential. Do not expose this manual-terminal capability as an
Agent tool. If the provider rejects the requested policy, startup fails without
retrying with a different policy.

## Plugin Boundary and Relay

This plugin owns only terminal presentation and provider registration. It does
not depend on Claude, Relay Events, or any private Relay runtime. Codex is an
optional provider plugin, not a hard dependency of Terminal.

The repository is maintained as part of
[Relay](https://github.com/yangbobo2021/Relay), an open-source project for
long-running agent work, external-event delivery, reusable DSH workbench views,
and multiple conversation backends.

## Update, Inspect, or Remove

Stop DSH Web before changing plugins, then restart it afterward.

```bash
dsh plugin --profile web why relay-dsh-plugin-terminal
dsh plugin --profile web update relay-dsh-plugin-terminal
dsh plugin --profile web remove relay-dsh-plugin-terminal
```

For GitHub installs, `pnpm` records the package source inside the DSH Profile.
Run `dsh plugin --profile web why relay-dsh-plugin-terminal` to inspect it.

## Troubleshooting

### The Terminal panel does not appear

Restart DSH Web after installing the plugin. Then inspect the Profile:

```bash
dsh plugin --profile web why relay-dsh-plugin-terminal
```

If the package came from GitHub `main`, try pinning a known commit SHA.

### The panel says no interactive terminal provider is installed

This means Terminal loaded correctly, but no backend plugin registered a PTY
provider. Install a compatible provider such as `relay-dsh-plugin-codex`.

### A terminal cannot start because no workspace is available

Create or select a DSH conversation that has a workspace directory. Terminal
sessions start inside the active workspace.

### SSH reports "Operation not permitted" although a system terminal connects

Older plugin builds omitted the shell's sandbox policy and inherited the Codex
server's default restrictions. Update the plugin, restart DSH Web, and create a
new terminal. Existing shell processes retain the permissions they started with.
If the error remains, check the host application's operating-system network
permissions and any administrator-managed restrictions.

### Installation says pnpm is missing

Install pnpm using the official guide: <https://pnpm.io/installation>.

## Development

```bash
git clone https://github.com/yangbobo2021/relay-dsh-plugin-terminal.git
cd relay-dsh-plugin-terminal
npm install
DSH_ROOT=/path/to/deepseek-harness npm run verify
npm pack
```

`npm run verify` runs type checking, tests, and the production build against an
official DSH checkout.

## Feedback

Report bugs and feature requests in this repository's issue tracker:
<https://github.com/yangbobo2021/relay-dsh-plugin-terminal/issues>
