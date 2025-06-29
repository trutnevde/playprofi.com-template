const BASE = import.meta.env.VITE_PREVGEN_API || "/prevgen-api";

async function safeJson(resp) {
  if (!resp.ok) {
    // для текстовой ошибки
    const txt = await resp.text();
    throw new Error(txt || resp.statusText);
  }
  // Если нет тела (204 No Content), возвращаем null
  const ct = resp.headers.get("content-type") || "";
  if (resp.status === 204 || !ct.includes("application/json")) {
    return null;
  }
  return resp.json();
}

export async function listGenerated() {
  return safeJson(await fetch(`${BASE}/generated`));
}

export async function generateGroup({
  prompt,
  reference,
  format,
  mode,
  count = 3,
}) {
  const resp = await fetch(`${BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, reference, format, mode, count }),
  });
  return safeJson(resp);
}

export async function regenerateGroup(groupId) {
  const resp = await fetch(`${BASE}/regenerate/${groupId}`, { method: "POST" });
  return safeJson(resp);
}

export async function deleteGroup(groupId) {
  const resp = await fetch(`${BASE}/generated/${groupId}`, {
    method: "DELETE",
  });
  return safeJson(resp);
}

export async function listTemplates() {
  return safeJson(await fetch(`${BASE}/templates`));
}

export async function listExamples() {
  return safeJson(await fetch(`${BASE}/examples`));
}

export async function listMyTemplates() {
  return safeJson(await fetch(`${BASE}/my-templates`));
}

export async function saveLayers(groupId, imageId, layers) {
  const resp = await fetch(
    `${BASE}/generated/${groupId}/image/${imageId}/layers`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(layers),
    },
  );
  return safeJson(resp);
}
