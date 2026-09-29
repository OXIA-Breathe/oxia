import { Capacitor } from "@capacitor/core";

const KEY = "oxia.keepScreenOn";

export const getKeepScreenOn = () => localStorage.getItem(KEY) !== "false";
export const setKeepScreenOn = (on: boolean) => localStorage.setItem(KEY, String(on));

/** Keep the screen awake (native only, if the user setting allows it). */
export const keepScreenAwake = async () => {
  if (!Capacitor.isNativePlatform() || !getKeepScreenOn()) return;
  try {
    const { KeepAwake } = await import("@capacitor-community/keep-awake");
    await KeepAwake.keepAwake();
  } catch (e) {
    console.warn("keepAwake failed", e);
  }
};

/** Let the screen dim again. */
export const allowScreenSleep = async () => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { KeepAwake } = await import("@capacitor-community/keep-awake");
    await KeepAwake.allowSleep();
  } catch {
    /* ignore */
  }
};
