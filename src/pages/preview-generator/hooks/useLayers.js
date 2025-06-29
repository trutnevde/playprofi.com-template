import { useState, useCallback } from "react";
import { saveLayers } from "../api/prevgen";

export function useLayers(groupId, imageId) {
  const [layers, setLayers] = useState([]);

  // Инициализация начальных слоёв
  const init = useCallback((initial) => {
    setLayers(initial);
  }, []);

  // Обновляем локально и в БД
  const updateAll = useCallback(
    async (newLayers) => {
      setLayers(newLayers);
      try {
        await saveLayers(groupId, imageId, newLayers);
      } catch (err) {
        console.error("Не удалось сохранить слои", err);
      }
    },
    [groupId, imageId],
  );

  const addLayer = useCallback(
    (layer) => {
      updateAll([...layers, layer]);
    },
    [layers, updateAll],
  );

  const removeLayer = useCallback(
    (id) => {
      updateAll(layers.filter((l) => l.id !== id));
    },
    [layers, updateAll],
  );

  const updateLayer = useCallback(
    (id, props) => {
      updateAll(layers.map((l) => (l.id === id ? { ...l, ...props } : l)));
    },
    [layers, updateAll],
  );

  return { layers, init, addLayer, removeLayer, updateLayer };
}
