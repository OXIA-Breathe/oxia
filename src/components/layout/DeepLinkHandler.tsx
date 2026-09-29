import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { APP_SCHEME } from "@/lib/authRedirect";

/** Opens in-app pages from oxia:// links (e.g. the email confirmation link). */
const DeepLinkHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let remove: (() => void) | undefined;

    import("@capacitor/app").then(({ App }) => {
      App.addListener("appUrlOpen", ({ url }) => {
        if (!url?.startsWith(`${APP_SCHEME}://`)) return;
        // oxia://verify-email?code=...#access_token=...
        const u = new URL(url.replace(`${APP_SCHEME}://`, "https://app/"));
        navigate({ pathname: u.pathname, search: u.search, hash: u.hash });
      }).then((h) => {
        remove = () => h.remove();
      });
    });

    return () => remove?.();
  }, [navigate]);

  return null;
};

export default DeepLinkHandler;
