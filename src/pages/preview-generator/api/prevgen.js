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

export async function startGeneration(req) {
  const resp = await fetch(`${BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  return safeJson(resp); // { job_id, status }
}

export async function fetchGenerationStatus(jobId) {
  const resp = await fetch(`${BASE}/generate/${jobId}/status`);
  return safeJson(resp); // { job_id, status, result?, error? }
}

export async function regenerateJob(jobId) {
  const resp = await fetch(`${BASE}/regenerate/${jobId}`, { method: "POST" });
  return safeJson(resp); // { job_id, status }
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
