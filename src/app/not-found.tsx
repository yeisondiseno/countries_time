import { NotFoundContent } from "@/components";
import { defaultLocale } from "@/lib/i18n/config";

export default function NotFound() {
  return <NotFoundContent locale={defaultLocale} />;
}
