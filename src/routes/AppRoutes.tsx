import { CollabPage } from "../pages/CollabPage"
import { HomePage } from "../pages/HomePage"

export function AppRoutes() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/"

  if (path === "/collab") return <CollabPage />
  return <HomePage />
}
