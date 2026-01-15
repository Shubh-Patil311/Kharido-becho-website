/**
 * ProtectedRoute Component
 *
 * Controls access to routes based on authentication and role requirements.
 *
 * Behavior:
 * - If `requiredRole` is null: route is accessible to any authenticated user
 * - If `requiredRole` is "BUYER": only buyers can access
 * - If `requiredRole` is "SELLER": only sellers can access
 * - If user is not authenticated: redirects to login
 * - If user doesn't have required role: redirects to home
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ============================================================
   LOADING SCREEN
============================================================ */
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/* ============================================================
   PROTECTED ROUTE
============================================================ */
export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isSignedIn, isLoading, roles } = useAuth();

  // Show spinner until auth state is initialized
  if (isLoading) {
    return <LoadingScreen />;
  }

  /* ============================================================
     IF NOT LOGGED IN → GO TO HOME (NOT LOGIN)
     This FIXES the logout redirect issue.
  ============================================================ */
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  /* ============================================================
     ROLE VALIDATION (if required)
  ============================================================ */
  if (requiredRole) {
    const hasRole = roles.includes(requiredRole);

    // user doesn't have correct role → go home
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  // Authenticated & authorized → show the route
  return children;
}
