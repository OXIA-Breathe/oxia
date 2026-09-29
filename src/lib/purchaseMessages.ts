/** Human-friendly copy for store purchase outcomes. */

export const isPurchaseCancellation = (error: any) => {
  const raw = `${error?.code ?? ""} ${error?.message ?? ""}`.toLowerCase();
  return raw.includes("cancel") || raw.includes("aborted") || error?.code === 6500;
};

export const CANCEL_TOAST = {
  title: "No worries",
  description: "You weren't charged. Premium is here whenever you're ready.",
};

export const purchaseErrorToast = (error: any) => {
  if (isPurchaseCancellation(error)) return CANCEL_TOAST;
  const msg: string | undefined = error?.message;
  const friendly =
    msg && !/failed|error|not initialised/i.test(msg)
      ? msg
      : "We couldn't reach Google Play. Please check your connection and try again.";
  return {
    title: "Something went wrong",
    description: friendly,
    variant: "destructive" as const,
  };
};
