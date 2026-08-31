import assert from "node:assert/strict";
import { Context } from "@deepseek-ai/cordis";
import test from "node:test";
import { RelayTerminalGateway } from "../terminal-gateway.js";

function fixture(t, execute) {
  const calls = [];
  const provider = {
    id: "codex-app-server", title: "Codex App Server",
    whenReady: async () => {},
    subscribeNotification: () => () => {},
    async request(method, params, options) {
      calls.push({ method, params, options });
      return execute(method, params, options);
    },
  };
  const gateway = new RelayTerminalGateway(new Context(), {
    providers: { list: () => [provider], get: () => provider },
    resolveAgent: async () => ({ session: { header: { cwd: process.cwd() } } }),
  });
  t.after(() => gateway.dispose());
  return { gateway, calls };
}

test("manual shell gets request-scoped full access without changing shared backend settings", async t => {
  let finish;
  const running = new Promise(resolve => { finish = resolve; });
  const { gateway, calls } = fixture(t, method => {
    if (method === "command/exec") return running;
    if (method === "command/exec/terminate") finish({ exitCode: 0 });
    return {};
  });
  const spawned = await gateway.spawn({ sessionId: "owner" });
  assert.equal(spawned.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, "command/exec");
  assert.deepEqual(calls[0].params.sandboxPolicy, { type: "dangerFullAccess" });
  assert.equal(calls[0].params.tty, true);
  assert.equal(calls[0].params.cwd, process.cwd());
  assert.equal(calls[0].params.streamStdin, true);
  assert.equal(calls[0].options.timeoutMs, null);

  const target = { sessionId: "owner", terminalId: spawned.value.sessionId };
  assert.equal((await gateway.input({ ...target, data: "echo test\r" })).ok, true);
  assert.equal((await gateway.resize({ ...target, cols: 120, rows: 40 })).ok, true);
  assert.deepEqual(calls.map(call => call.method), [
    "command/exec", "command/exec/write", "command/exec/resize",
  ]);
  assert.equal(calls[1].params.processId, calls[0].params.processId);
  assert.equal(calls[2].params.processId, calls[0].params.processId);
  assert.ok(calls.slice(1).every(call => !("sandboxPolicy" in call.params)));

  const foreign = { sessionId: "another-session", terminalId: target.terminalId };
  assert.equal((await gateway.input({ ...foreign, data: "whoami\r" })).error.code, "terminal-not-found");
  assert.equal((await gateway.resize({ ...foreign, cols: 80, rows: 24 })).error.code, "terminal-not-found");
  assert.equal((await gateway.readRaw(foreign)).error.code, "terminal-not-found");
  assert.equal(calls.length, 3);
});

test("provider policy rejection exits the terminal without fallback or global configuration writes", async t => {
  const { gateway, calls } = fixture(t, () => {
    throw new Error("requested sandbox policy is not allowed");
  });
  const spawned = await gateway.spawn({ sessionId: "owner" });
  assert.equal(spawned.ok, true);
  const target = { sessionId: "owner", terminalId: spawned.value.sessionId };
  const listed = await gateway.list({ sessionId: "owner" });
  assert.equal(listed.value[0].status.kind, "exited");
  assert.match((await gateway.readRaw(target)).value.text, /requested sandbox policy is not allowed/);
  assert.equal((await gateway.input({ ...target, data: "\r" })).error.code, "terminal-exited");
  assert.deepEqual(calls.map(call => call.method), ["command/exec"]);
});
