import { useEffect, useState } from "react";

declare global {
  interface Window {
    workbox: {
      messageSkipWaiting(): void;
      register(): void;
      addEventListener(name: string, callback: () => unknown): void;
    };
  }
}

let readyToInstallPWA: Event | undefined;
window.addEventListener("beforeinstallprompt", (e) => {
  localStorage.removeItem("pwa.isInstalled");

  readyToInstallPWA = e;
});

let pwaInstalled = false;
window.addEventListener("appinstalled", () => {
  localStorage.setItem("pwa.isInstalled", "true");

  readyToInstallPWA = undefined;

  pwaInstalled = true;
});

export const usePWAInstaller = (
  onUpdateAvailable: () => void,
  afterInstall: () => void
) => {
  const [pwaInstallEvent, setPWAInstallEvent] = useState<Event | undefined>(
    undefined
  );

  useEffect(() => {
    const installHandler = (e: Event) => setPWAInstallEvent(() => e);
    window.addEventListener("beforeinstallprompt", installHandler);
    if (readyToInstallPWA) {
      installHandler(readyToInstallPWA);
    }

    const afterInstallHandler = () => afterInstall();
    window.addEventListener("appinstalled", afterInstallHandler);
    if (pwaInstalled || localStorage.getItem("pwa.isInstalled") === "true") {
      afterInstallHandler();
    }

    window.workbox?.addEventListener("waiting", () => onUpdateAvailable());

    window.workbox?.register();

    return () => {
      window.removeEventListener("appinstalled", afterInstallHandler);
      window.removeEventListener("beforeinstallprompt", installHandler);
    };
  }, [afterInstall, onUpdateAvailable]);

  const [installPWA, setInstallPWA] = useState<Function | undefined>(undefined);
  useEffect(() => {
    if (pwaInstallEvent)
      setInstallPWA(() => () => (pwaInstallEvent as any)?.prompt?.());
  }, [pwaInstallEvent]);

  return {
    installPWA,
    updatePWA: () => {
      window.workbox?.addEventListener("controlling", () =>
        window.location.reload()
      );

      window.workbox?.messageSkipWaiting();
    },
  };
};
