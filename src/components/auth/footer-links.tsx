import Link from "next/link";
import { FieldDescription } from "../ui/field";
import { appRoutes } from "@/app-routes";

export function FooterLinks() {
  return (
    <FieldDescription className="px-6 text-center">
      By clicking continue, you agree to our <Link href={appRoutes.terms} target="_blank">Terms of Service</Link>{" "}
      and <Link href={appRoutes.privacy} target="_blank">Privacy Policy</Link>.
    </FieldDescription>
  )
}