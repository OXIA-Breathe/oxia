import { useEffect, useState } from "react";
import { getProducts, PRODUCT_IDS } from "@/lib/purchases";

const FALLBACK = { monthly: "€2.99", yearly: "€26.99" };

/** Store-localized prices (e.g. $2.99, A$4.49); falls back to EUR on web/offline. */
export const useLocalizedPrices = () => {
  const [prices, setPrices] = useState(FALLBACK);

  useEffect(() => {
    let active = true;
    getProducts()
      .then((products) => {
        if (!active || !products.length) return;
        const find = (id: string) => products.find((p) => p.id === id)?.price;
        setPrices({
          monthly: find(PRODUCT_IDS.monthly) || FALLBACK.monthly,
          yearly: find(PRODUCT_IDS.yearly) || FALLBACK.yearly,
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return prices;
};
