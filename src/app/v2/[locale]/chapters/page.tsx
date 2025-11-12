import { redirect } from "@/app/v2/i18n/navigation";

export default function ChaptersPage({ params }: { params: any }) {
  redirect({
    href: "/chapters/1",
    locale: params.locale,
  });
}
