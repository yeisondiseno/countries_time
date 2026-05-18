import { NotFoundContent } from "@/components/molecules/NotFoundContent/NotFoundContent";
import { defaultLocale } from "@/lib/i18n/config";

export default function NotFound() {
  return <NotFoundContent locale={defaultLocale} />;
}
