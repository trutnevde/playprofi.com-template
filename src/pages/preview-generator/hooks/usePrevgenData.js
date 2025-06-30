// hooks/usePrevgenData.js
import { useEffect, useState } from "react";
import {
  listGenerated,
  listTemplates,
  listExamples,
  listMyTemplates,
} from "../api/prevgen";

export function usePrevgenData() {
  const [generated, setGenerated] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [examples, setExamples] = useState([]);
  const [myTemplates, setMyTemplates] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    listGenerated()
      .then(setGenerated)
      .catch(() => setGenerated([]));
    listTemplates()
      .then(setTemplates)
      .catch(() => setTemplates([]));
    listExamples()
      .then(setExamples)
      .catch(() => setExamples([]));
    listMyTemplates()
      .then((list) => {
        setMyTemplates([
          {
            title: "Избранные",
            items: list.map((src) => ({ src, alt: "", aspect: "16:9" })),
          },
        ]);
      })
      .catch(() => setMyTemplates([]));
  }, []);

  return {
    generated,
    templates,
    examples,
    myTemplates,
    tasks,
    setGenerated,
    setMyTemplates,
    setTasks,
  };
}
