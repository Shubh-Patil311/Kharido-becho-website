import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectSellerId, setSellerId } from "../store/authSlice";
import { fetchSellerInfo } from "../store/services/authServices";

/**
 * Resolves the seller id for the currently authenticated user.
 * Tries Redux state, then localStorage, then falls back to the seller info API.
 */
export default function useSellerId() {
  const dispatch = useDispatch();
  const sellerIdFromStore = useSelector(selectSellerId);

  const [sellerId, setSellerIdState] = useState(
    sellerIdFromStore || Number(localStorage.getItem("sellerId")) || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sellerIdFromStore) {
      setSellerIdState(sellerIdFromStore);
      return;
    }

    const localId = Number(localStorage.getItem("sellerId"));
    if (localId) {
      setSellerIdState(localId);
      dispatch(setSellerId(localId));
      return;
    }

    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      setError("Seller profile missing. Please log in again.");
      return;
    }

    let isMounted = true;
    setLoading(true);
    fetchSellerInfo(storedUserId)
      .then((data) => {
        const resolvedId = Number(
          data?.sellerId ??
            data?.data?.sellerId ??
            data?.seller?.sellerId ??
            data?.id
        );

        if (!resolvedId) {
          throw new Error("Unable to resolve seller id");
        }

        if (isMounted) {
          localStorage.setItem("sellerId", resolvedId);
          dispatch(setSellerId(resolvedId));
          setSellerIdState(resolvedId);
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to fetch seller id", err);
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to fetch seller details"
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sellerIdFromStore, dispatch]);

  return useMemo(
    () => ({
      sellerId,
      loading,
      error,
    }),
    [sellerId, loading, error]
  );
}


