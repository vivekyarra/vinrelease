import type { CallTask, TitleCase } from "@/domain/model";
import { createDemoCase } from "@/fixtures/demo";

type Store = { cases: Map<string, TitleCase>; processedWebhookIds: Set<string> };

declare global {
  var __vinreleaseStore: Store | undefined;
}

function store(): Store {
  if (!globalThis.__vinreleaseStore) {
    const seeded = createDemoCase();
    globalThis.__vinreleaseStore = {
      cases: new Map([[seeded.id, seeded]]),
      processedWebhookIds: new Set(),
    };
  }
  return globalThis.__vinreleaseStore;
}

export function listCases() {
  return [...store().cases.values()].map(clone);
}

export function getCase(id: string) {
  const found = store().cases.get(id);
  return found ? clone(found) : null;
}

export function saveCase(value: TitleCase) {
  value.updatedAt = new Date().toISOString();
  store().cases.set(value.id, clone(value));
  return clone(value);
}

export function resetCase(id: string) {
  if (id !== "case-4821") return null;
  const seeded = createDemoCase();
  store().cases.set(id, seeded);
  return clone(seeded);
}

export function findTaskByProviderId(providerCallId: string): { titleCase: TitleCase; task: CallTask } | null {
  for (const titleCase of store().cases.values()) {
    const task = titleCase.calls.find((item) => item.providerCallId === providerCallId);
    if (task) return { titleCase: clone(titleCase), task: clone(task) };
  }
  return null;
}

export function claimWebhook(id: string) {
  if (store().processedWebhookIds.has(id)) return false;
  store().processedWebhookIds.add(id);
  return true;
}

export function resetStoreForTests() {
  globalThis.__vinreleaseStore = undefined;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}
