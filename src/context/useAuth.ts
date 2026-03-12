import { useContext } from "react";
import { AuthContext } from "./authTypes";
import type { AuthContextValue } from "./authTypes";

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden");
  return ctx;
}
