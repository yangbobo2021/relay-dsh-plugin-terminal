# Relay DSH Terminal Plugin

`@relay/dsh-plugin-terminal` adds an xterm-based bottom terminal view to official
DeepSeek Harness Web. It installs the Relay Workbench shell automatically and owns
the browser Remote, bounded Host scrollback, and versioned
`ctx.relayTerminalProviders` registry. Execution backends contribute PTY
transports through that Cordis service.

Use this plugin when you want an official DSH installation to expose an interactive
terminal panel. Install a backend that contributes a terminal provider, such as
`relay-dsh-plugin-codex`, when you want a live PTY transport.

Install from npm:

```bash
dsh plugin --profile web add @relay/dsh-plugin-terminal relay-dsh-plugin-codex
```

Install the current GitHub development versions:

```bash
dsh plugin --profile web add github:yangbobo2021/relay-dsh-plugin-terminal github:yangbobo2021/relay-dsh-plugin-codex
```

Without a provider the plugin still loads and reports terminal unavailability when
a user tries to spawn a session.

The plugin owns only terminal presentation and provider registration. It depends
on Workbench's public view contract, but does not depend on Codex, Claude, or
Events. It is maintained as part of Relay's DSH plugin family, where Relay
provides the broader event-driven Agent direction.
