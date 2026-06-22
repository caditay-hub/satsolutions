import { redirect } from "next/navigation";

// Cart removed — site is now informational. Keep the route as a redirect
// so any old links/bookmarks land on the home page instead of a 404.
export default function CartPage() {
  redirect("/");
}
