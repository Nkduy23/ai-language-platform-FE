// Home page - hero, features, pricing
import { redirect } from "next/navigation";

// Tạm thời redirect về login
// Phase 1: sau khi có Landing page thì thay bằng Landing component
export default function Home() {
  redirect("/auth/login");
}
