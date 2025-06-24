import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

/* ---------- утилиты ---------- */
const formatTime = (s) =>
  !Number.isFinite(s)
    ? "00:00"
    : `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* ---------- хук «видна ли карточка» ---------- */
function useVisible(ref, rootMargin = "200px") {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [rootMargin]);
  return visible;
}

/* ---------- плейсхолдер-волна ---------- */
function LoadingWave({ bars = 300 }) {
  const [peaks, setPeaks] = useState(() =>
    Array.from({ length: bars }, () => Math.random()),
  );

  /* обновляем пики каждые 150 мс */
  useEffect(() => {
    setPeaks((prev) => prev.map(() => Math.random()));
  }, []);

  return (
    <div className="absolute inset-0 flex items-center gap-[2px] overflow-hidden">
      {peaks.map((v, i) => (
        <div
          /* от 20 % до 100 % высоты */
          key={i}
          style={{ height: `${20 + v * 80}%` }}
          className="w-[2px] shrink-0 rounded bg-zinc-600"
        />
      ))}
    </div>
  );
}

/* ---------- основной компонент ---------- */
export default function Waveform({
  audioUrl,
  peaks, // Array<number> | undefined
  isActive,
  isCurrent,
  onPlay,
  onPause,
  onFinish,
}) {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);

  const playRef = useRef(onPlay);
  const pauseRef = useRef(onPause);
  useEffect(() => {
    playRef.current = onPlay;
  }, [onPlay]);
  useEffect(() => {
    pauseRef.current = onPause;
  }, [onPause]);

  const [time, setTime] = useState(0);
  const [duration, setDur] = useState(0);
  const [ready, setReady] = useState(false);

  const isVisible = useVisible(containerRef);
  const shouldInit = (isVisible || isActive || isCurrent) && audioUrl;

  /* -------- WaveSurfer init -------- */
  useEffect(() => {
    if (!shouldInit || !containerRef.current || waveSurferRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      backend: "MediaElement",
      partialRender: true,
      responsive: false,
      waveColor: "#91959B",
      progressColor: "#2BE4DE",
      cursorColor: "transparent",
      cursorWidth: 2,
      height: 40,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      dragToSeek: true,
    });

    waveSurferRef.current = ws;

    ws.on("ready", () => {
      setDur(ws.getDuration());
      setReady(true); // скрываем плейсхолдер
    });
    ws.on("audioprocess", () => ws.isPlaying() && setTime(ws.getCurrentTime()));
    ws.on("seek", () => setTime(ws.getCurrentTime()));
    ws.on("play", () => playRef.current?.());
    ws.on("pause", () => pauseRef.current?.());
    ws.on("finish", () => {
      pauseRef.current?.(); // вызываешь onPause (если хочешь)
      onFinish?.();         // вызываешь новый колбэк для сброса isActive снаружи
    });

    ws.load(audioUrl, peaks, null);

    return () => {
      ws.destroy();
      waveSurferRef.current = null;
      setReady(false);
    };
  }, [shouldInit, audioUrl, peaks]);

  /* смена трека без пересоздания */
  useEffect(() => {
    const ws = waveSurferRef.current;
    if (ws && ws.getSrc() !== audioUrl) {
      setReady(false);
      ws.load(audioUrl, peaks, null);
    }
  }, [audioUrl, peaks]);

  /* play/pause + курсор */
  useEffect(() => {
    const ws = waveSurferRef.current;
    if (!ws) return;
    ws.setOptions({ cursorColor: isActive ? "#2BE4DE" : "transparent" });
    if (isActive && !ws.isPlaying()) ws.play();
    if (!isActive && ws.isPlaying()) ws.pause();
  }, [isActive]);

  /* сброс, если карточка перестала быть current */
  const prevCurrent = useRef(isCurrent);
  useEffect(() => {
    const ws = waveSurferRef.current;
    if (ws && prevCurrent.current && !isCurrent) {
      ws.stop();
      setTime(0);
    }
    prevCurrent.current = isCurrent;
  }, [isCurrent]);

  /* ---------- render ---------- */
  return (
    <div className="relative flex w-full items-center justify-between gap-2">
      <div
        ref={containerRef}
        className="relative h-10 w-full overflow-hidden rounded"
      >
        {!ready && <LoadingWave />} {/* мигающие псевдопики */}
      </div>
      <div
        className={`w-24 text-right text-xs font-bold tabular-nums ${isActive ? "text-main-accent" : "text-main-white"}`}
      >
        {formatTime(time)} / {formatTime(duration)}
      </div>
    </div>
  );
}
