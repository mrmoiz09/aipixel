"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Highlight } from "./button";
import { KeyboardIllustration } from "./illustrations/keyboard";

const shortcuts = [
  { text: "BlockChain Development", keys: "⌘k" },
  { text: "Android Development", keys: "i" },
  { text: "IOS Development", keys: "a" },
  { text: "WEB Development", keys: "s" },
  { text: "UI Exprience", keys: "p" },
  { text: "UX Exprience", keys: "l" },
 
  // { text: "Set parent issue", keys: "⇧⌘p" },
  // { text: "Add sub-issue", keys: "⇧⌘o" },
  // { text: "Create new issue", keys: "c" },
  // { text: "Create new issue from template", keys: "⌥c" },
  // { text: "Move to project", keys: "⇧p" },
];

export const KeyboardShortcuts = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const illustrationWrapperRef = useRef<HTMLDivElement>(null);
  const activeShortcutIndex = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const scheduleTimeout = () => {
    timeoutRef.current = setTimeout(goToNextShortcut, 2500);
  };

  useEffect(() => {
    scheduleTimeout();
    return () => clearTimeout(timeoutRef.current);
  }, [scheduleTimeout]);

  const goToShortcut = (index: number) => {
    clearTimeout(timeoutRef.current);

    if (!wrapperRef.current) return;

    const shortcut = wrapperRef.current.querySelector<HTMLButtonElement>(
      `button:nth-child(${index + 1})`
    );
    if (!shortcut) return;

    wrapperRef.current.scrollTo({
      left: shortcut.offsetLeft - wrapperRef.current.clientWidth / 2,
      behavior: "smooth",
    });

    if (!illustrationWrapperRef.current) return;

    illustrationWrapperRef.current
      .querySelectorAll(".active")
      .forEach((el) => el.classList.remove("active"));

    const keys = shortcut.dataset.keys || "";
    const keyArray = keys.split("");
    const keyElements = keyArray.map((key) =>
      illustrationWrapperRef.current?.querySelector(`[data-key="${key}"]`)
    );

    keyElements.forEach((element) => element?.classList.add("active"));

    activeShortcutIndex.current = index;
    scheduleTimeout();
  };

  const goToNextShortcut = () =>
    goToShortcut((activeShortcutIndex.current + 1) % shortcuts.length);

  const onShortcutButtonClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    goToShortcut(Number(ev.currentTarget.dataset.index));
  };

  return (
    <>
      <div
        ref={illustrationWrapperRef}
        className="mask-keyboard absolute top-0 -left-12 h-full max-h-[30rem] w-[200%] md:relative md:left-auto md:w-full"
      >
        <KeyboardIllustration />
      </div>
      <div className="my-7 hidden h-[4rem] min-h-[4rem] w-full overflow-hidden md:block">
        <div
          ref={wrapperRef}
          className="mask-shortcutkeys flex h-[6rem] max-w-full snap-x snap-mandatory gap-2 overflow-auto pb-8"
        >
          {shortcuts.map((shortcut, index) => (
            <Button
              className="shrink-0 snap-center first:ml-[50vw] last:mr-[50vw]"
              key={shortcut.text}
              data-index={index}
              data-keys={shortcut.keys}
              onClick={onShortcutButtonClick}
              variant="secondary"
            >
              <Highlight className="uppercase">{shortcut.keys}</Highlight>
              <span>{shortcut.text}</span>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};
