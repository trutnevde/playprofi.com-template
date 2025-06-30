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
