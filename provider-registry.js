import { Service } from "@deepseek-ai/cordis";

export class RelayTerminalProviderRegistry extends Service {
  apiVersion = 1;
  _providers = new Map();

  constructor(ctx) {
    super(ctx, "relayTerminalProviders");
  }

  register(provider) {
    validateProvider(provider);
    if (this._providers.has(provider.id)) throw new Error(`terminal provider ${provider.id} is already registered`);
    const dispose = this.ctx.effect(() => {
      this._providers.set(provider.id, provider);
      return () => {
        if (this._providers.get(provider.id) === provider) this._providers.delete(provider.id);
      };
    }, "relayTerminalProviders.register()");
    return () => void dispose();
  }

  list() {
    return [...this._providers.values()];
  }

  get(providerId) {
    return this._providers.get(providerId);
  }
}

function validateProvider(provider) {
  if (!provider || typeof provider !== "object") throw new Error("terminal provider is required");
  if (!provider.id || !/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(provider.id)) throw new Error("terminal provider id must be lowercase and stable");
  if (!provider.title?.trim()) throw new Error("terminal provider title must be non-empty");
  for (const method of ["whenReady", "request", "subscribeNotification"]) {
    if (typeof provider[method] !== "function") throw new Error(`terminal provider ${provider.id} must implement ${method}()`);
  }
}
