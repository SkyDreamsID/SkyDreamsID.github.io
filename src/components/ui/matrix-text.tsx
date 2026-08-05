"use client";

import { useEffect, useRef, useState } from "react";

// Karakter Matrix: katakana + simbol teknik
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`";

function getRandomChar() {
  return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
}

interface MatrixTextProps {
  /** Teks asli yang ingin ditampilkan. Kalau null/undefined → karakter terus random selamanya */
  text?: string | null;
  /** Kelas CSS tambahan */
  className?: string;
  /** Delay sebelum mulai decode (ms). Default 0 */
  decodeDelay?: number;
  /** Kecepatan scramble (ms per frame). Default 40 */
  scrambleSpeed?: number;
  /** Kalau true, teks terus di-scramble (mode loading infinite) */
  infinite?: boolean;
  /** Panjang karakter placeholder saat mode infinite (default 20) */
  placeholderLength?: number;
  /**
   * Kalau true (default false): decode hanya dimainkan SEKALI saat pertama mount.
   * Setelah selesai decode, teks langsung tampil statis tanpa animasi ulang.
   * Saat data null/undefined → tetap scramble terus.
   */
  once?: boolean;
}

export function MatrixText({
  text,
  className = "",
  decodeDelay = 0,
  scrambleSpeed = 40,
  infinite = false,
  placeholderLength = 20,
  once = false,
}: MatrixTextProps) {
  const [displayed, setDisplayed] = useState("");
  const frameRef = useRef<NodeJS.Timeout | null>(null);
  const iterationRef = useRef(0);
  // Track apakah sudah pernah decode ke teks asli (untuk mode `once`)
  const hasDecodedRef = useRef(false);

  useEffect(() => {
    if (frameRef.current) clearInterval(frameRef.current);

    // Mode `once`: kalau sudah pernah decode dan teks masih sama → tampil statis langsung
    if (once && hasDecodedRef.current && text) {
      setDisplayed(text);
      return;
    }

    // Mode infinite atau data tidak tersedia: scramble terus selamanya
    if (infinite || !text) {
      const length = text?.length || placeholderLength;
      const tick = () => {
        setDisplayed(
          Array.from({ length }).map(() => getRandomChar()).join("")
        );
      };
      tick();
      frameRef.current = setInterval(tick, scrambleSpeed);
      return () => {
        if (frameRef.current) clearInterval(frameRef.current);
      };
    }

    // Mode decode: scramble dulu, lalu reveal karakter satu per satu
    iterationRef.current = 0;
    const target = text;

    const start = () => {
      frameRef.current = setInterval(() => {
        const iter = iterationRef.current;
        const decoded = target
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (char === "\n") return "\n";
            if (i < iter) return char; // Sudah ter-decode
            return getRandomChar(); // Masih random
          })
          .join("");

        setDisplayed(decoded);
        iterationRef.current += 0.4;

        if (iter >= target.length) {
          if (frameRef.current) clearInterval(frameRef.current);
          setDisplayed(target); // Pastikan teks akhir bersih
          hasDecodedRef.current = true; // Tandai sudah decode
        }
      }, scrambleSpeed);
    };

    if (decodeDelay > 0) {
      const timeout = setTimeout(start, decodeDelay);
      return () => {
        clearTimeout(timeout);
        if (frameRef.current) clearInterval(frameRef.current);
      };
    }

    start();
    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Intentionally exclude `once` & `hasDecodedRef` — mereka adalah nilai statis
  }, [text, infinite, placeholderLength, scrambleSpeed, decodeDelay]);

  return (
    <span
      className={`font-mono whitespace-nowrap ${className}`}
      aria-label={text ?? "Loading..."}
    >
      {displayed}
    </span>
  );
}

// ─── MatrixBlock: untuk teks multi-paragraf (bio, deskripsi panjang) ──────────

interface MatrixBlockProps {
  text?: string | null;
  isLoading?: boolean;
  className?: string;
  paragraphClassName?: string;
  placeholderLines?: number;
  scrambleSpeed?: number;
}

export function MatrixBlock({
  text,
  isLoading = false,
  className = "",
  paragraphClassName = "",
  placeholderLines = 3,
  scrambleSpeed = 35,
}: MatrixBlockProps) {
  if (isLoading || !text) {
    // Tampilkan placeholder lines dengan panjang bervariasi (infinite scramble)
    const lengths = [60, 52, 42, 55, 38, 48];
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: placeholderLines }).map((_, i) => (
          <div key={i} className={`text-emerald-500/40 ${paragraphClassName}`}>
            <MatrixText
              infinite
              placeholderLength={lengths[i % lengths.length]}
              scrambleSpeed={scrambleSpeed + i * 5}
              className="text-sm leading-relaxed"
            />
          </div>
        ))}
      </div>
    );
  }

  // Render paragraf normal: decode sekali saja (once=true), tidak animasi ulang saat re-render
  const paragraphs = text.split("\n").filter((p) => p.trim());
  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((paragraph, idx) => (
        <p key={idx} className={paragraphClassName}>
          <MatrixText
            text={paragraph}
            decodeDelay={idx * 200}
            scrambleSpeed={scrambleSpeed}
            once
          />
        </p>
      ))}
    </div>
  );
}
