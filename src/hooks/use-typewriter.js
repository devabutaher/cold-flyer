"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

const WORDS_EN = ["Search AC service...", "Search for AC parts...", "AC gas charge...", "AC installation..."];
const WORDS_BN = ["এসি সার্ভিসিং খুঁজুন...", "এসি যন্ত্রাংশ খুঁজুন...", "এসি গ্যাস চার্জ...", "এসি ইন্সটলেশন..."];
const TYPING_SPEED = 60;
const DELETING_SPEED = 25;
const PAUSE = 2000;

export function useTypewriter() {
  const locale = useLocale();
  const words = locale === "bn" ? WORDS_BN : WORDS_EN;
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const current = words[wordIndex];
    let timeout;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => {
          setText(
            isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1),
          );
        },
        isDeleting ? DELETING_SPEED : TYPING_SPEED,
      );
    }

    return () => clearTimeout(timeout);
  }, [text, wordIndex, isDeleting, words, mounted]);

  return mounted ? text : words[0];
}
