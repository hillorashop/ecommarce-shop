const PREFIX = "gtm_event";

export const hasFiredEvent = (key: string) => {
  if (typeof window === "undefined") return true;
  return sessionStorage.getItem(`${PREFIX}:${key}`) === "1";
};

export const markEventFired = (key: string) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PREFIX}:${key}`, "1");
};