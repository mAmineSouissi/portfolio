"use client";

/** While the pointer is over an embedded live demo, the page itself must not scroll. */
export const lockPageScroll = () => document.documentElement.classList.add("lock-scroll");
export const unlockPageScroll = () => document.documentElement.classList.remove("lock-scroll");
export const liveFrameHover = {
  onPointerEnter: lockPageScroll,
  onPointerLeave: unlockPageScroll,
};
