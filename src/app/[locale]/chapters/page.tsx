import { redirect } from "@/i18n/routing";

export default function ChaptersPage({ params }: { params: any }) {
  redirect({
    href: "/chapters/1",
    locale: params.locale,
  });
}
