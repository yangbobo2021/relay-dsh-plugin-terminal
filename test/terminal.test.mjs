import assert from "node:assert/strict";
import { Context } from "@deepseek-ai/cordis";
import test from "node:test";
import { TERMINAL_DESCRIPTORS } from "../remote-schema.js";
import { RelayTerminalProviderRegistry } from "../provider-registry.js";
import { readFile } from "node:fs/promises";

test("terminal owns only the interactive terminal Remote contract", () => {
  assert.equal(TERMINAL_DESCRIPTORS.length, 5);
  assert.deepEqual(new Set(TERMINAL_DESCRIPTORS.map(item => item.service)), new Set(["relayWorkbenchTerminal"]));
  assert.ok(TERMINAL_DESCRIPTORS.every(item => item.id.startsWith("relay-dsh-plugin-terminal#")));
});

test("terminal Host resolves the Agent lookup lazily so provider-less startup is order independent", async () => {
  const source = await readFile(new URL("../host-plugin.js", import.meta.url), "utf8");
  assert.match(source, /const resolveAgent = async[\s\S]*lookups\.get\("agent"\)/);
  assert.doesNotMatch(source, /export async function apply\(ctx\) \{\n\s+const lookup/);
});

test("terminal providers register through a versioned Cordis service and expose explicit disposal", () => {
  const ctx = new Context();
  const registry = new RelayTerminalProviderRegistry(ctx);
  const provider = {
    id: "future-backend", title: "Future Backend",
    whenReady: async () => {}, request: async () => ({}), subscribeNotification: () => () => {},
  };
  const dispose = registry.register(provider);
  assert.equal(registry.apiVersion, 1);
  assert.equal(registry.get("future-backend"), provider);
  assert.deepEqual(registry.list(), [provider]);
  const proxy = new Proxy(registry, {});
  assert.equal(proxy.get("future-backend"), provider);
  assert.deepEqual(proxy.list(), [provider]);
  assert.throws(() => registry.register(provider), /already registered/);
  dispose();
  assert.deepEqual(registry.list(), []);
});

test("README keeps the user-facing install contract documented", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  const zhReadme = await readFile(new URL("../README.zh.md", import.meta.url), "utf8");
  const screenshot = await readFile(new URL("../docs/images/dsh-terminal-panel.png", import.meta.url));
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.match(readme, /relay-dsh-plugin-terminal/);
  assert.match(readme, /github:yangbobo2021\/relay-dsh-plugin-terminal#main/);
  assert.match(readme, /github:yangbobo2021\/relay-dsh-plugin-workbench#main/);
  assert.match(readme, /relay-dsh-plugin-codex/);
  assert.match(readme, /relay-dsh-plugin-workbench/);
  assert.match(readme, /docs\/images\/dsh-terminal-panel\.png/);
  for (const document of [readme, zhReadme]) {
    assert.match(document, /dsh-plugin-suite-demo\.gif/);
    assert.match(document, /dsh-plugin-suite-demo\.mp4\?raw=1/);
  }
  assert.match(readme, /\[中文\]\(README\.zh\.md\)/);
  assert.match(zhReadme, /\[English\]\(README\.md\)/);
  assert.deepEqual([...screenshot.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.ok(screenshot.length > 10_000);
  assert.ok(packageJson.files.includes("README.zh.md"));
  assert.ok(packageJson.files.includes("docs/images"));
  assert.equal(packageJson.dependencies?.["relay-dsh-plugin-workbench"], undefined);
  assert.equal(packageJson.devDependencies?.["relay-dsh-plugin-workbench"], "github:yangbobo2021/relay-dsh-plugin-workbench#43a2c501c7d51927dd8e18e7aa6bf32fd0db0bf5");
  assert.equal(packageJson.peerDependencies?.["relay-dsh-plugin-workbench"], packageJson.version);
});

test("build normalization keeps virtual CSS module ids stable across CI paths", async () => {
  const source = await readFile(new URL("../normalize-build.mjs", import.meta.url), "utf8");
  assert.match(source, /relay-\(\?:global-css\|css-module\):\)\\\.\\\/node_modules\\\//);
  assert.match(source, /\$1node_modules\//);
});
