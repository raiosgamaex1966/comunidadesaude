import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SalesPage } from "@/components/SalesPage";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/overview");
  return <SalesPage />;
}
