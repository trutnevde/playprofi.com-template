import { useState, useEffect, useCallback } from "react";
import {
  fetchGroups,
  createGroup,
  regenerateGroup,
} from "../services/generationService";

export function useGenerations() {
  const [groups, setGroups] = useState([]); // все вкладки
  const [activeFolder, setActiveFolder] = useState("default");

  // Загрузка при старте
  useEffect(() => {
    fetchGroups().then((data) => setGroups(data));
  }, []);

  const generate = useCallback(async ({ prompt, reference, format, mode }) => {
    // оптимистично ставим skeleton
    setGroups((g) => [
      { id: null, title: prompt, items: Array(3).fill({ loading: true }) },
      ...g,
    ]);
    const { group_id, images } = await createGroup({
      prompt,
      reference,
      format,
      mode,
    });
    setGroups((g) =>
      g.map((grp, i) =>
        i === 0
          ? { ...grp, id: group_id, items: images.map((src) => ({ src })) }
          : grp,
      ),
    );
    setActiveFolder("ai");
  }, []);

  const regenerate = useCallback(async (groupId) => {
    setGroups((g) =>
      g.map((grp) =>
        grp.id === groupId
          ? { ...grp, items: Array(3).fill({ loading: true }) }
          : grp,
      ),
    );
    const { images } = await regenerateGroup(groupId);
    setGroups((g) =>
      g.map((grp) =>
        grp.id === groupId
          ? { ...grp, items: images.map((src) => ({ src })) }
          : grp,
      ),
    );
  }, []);

  return {
    groups,
    activeFolder,
    setActiveFolder,
    generate,
    regenerate,
  };
}
