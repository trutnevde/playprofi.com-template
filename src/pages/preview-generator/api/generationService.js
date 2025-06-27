export async function fetchGroups() {
  const resp = await fetch("/api/groups"); // эндпоинт для получения всех групп
  return resp.json(); // [{ id, title, items: [{ src, loading, ... }] }, ...]
}

export async function createGroup({ prompt, reference, format, mode }) {
  const resp = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, reference, format, mode }),
  });
  return resp.json(); // { group_id, images }
}

export async function regenerateGroup(groupId) {
  const resp = await fetch(`/api/regenerate/${groupId}`, { method: "POST" });
  return resp.json(); // { group_id, images }
}

const GenCtx = createContext(null);

export function GenerationsProvider({ children }) {
  const gen = useGenerationsCtx();
  return <GenCtx.Provider value={gen}>{children}</GenCtx.Provider>;
}

export function useGenerationsCtx() {
  const ctx = useContext(GenCtx);
  if (!ctx) throw new Error("Use inside GenerationsProvider");
  return ctx;
}
