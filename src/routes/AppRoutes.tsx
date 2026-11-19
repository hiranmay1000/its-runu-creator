import { CollabPage } from "../pages/collabpage"
import { HomePage } from "../pages/homepage"

export function AppRoutes() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/"

  if (path === "/collab") return <CollabPage />
  return <HomePage />
}
