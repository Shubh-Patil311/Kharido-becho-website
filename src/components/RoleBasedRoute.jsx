/**
 * RoleBasedRoute Component
 * 
 * A more flexible route wrapper that allows multiple roles or public access.
 * 
 * Props:
 * - allowedRoles: array of roles that can access (e.g., ["BUYER", "SELLER"])
 * - public: if true, route is accessible to everyone (including guests)
 * - redirectTo: where to redirect if access is denied (default: "/login" for guests, "/" for authenticated users)
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function RoleBasedRoute({
  children,
  allowedRoles = [],
  public: isPublic = false,
  redirectTo = null,
}) {
  const { isSignedIn, isLoading, roles } = useAuth();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Public routes: accessible to everyone
  if (isPublic) {
    return children;
  }

  // If not authenticated, redirect to login (or custom redirect)
  if (!isSignedIn) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  // If allowedRoles is empty, allow any authenticated user
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user has at least one of the allowed roles
  const hasAllowedRole = allowedRoles.some((role) => roles.includes(role));

  if (!hasAllowedRole) {
    // User doesn't have any allowed role, redirect
    return <Navigate to={redirectTo || "/"} replace />;
  }

  // User has required role, render children
  return children;
}

