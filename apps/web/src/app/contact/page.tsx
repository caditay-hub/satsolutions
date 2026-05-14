import type { Metadata } from "next";
import Image from "next/image";
import { getSitePage } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { SocialLinks } from "@/components/SocialLinks";
import { FeedbackForm } from "@/components/FeedbackForm";

function pick(data: any, key: string) {
  return typeof data?.[key] === "string" ? (data[key] as string) : null;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { page } = await getSitePage("contact");
    return {
      title: page.title || "Контакты",
      description: "Контактная информация",
      alternates: { canonical: "/contact" }
    };
  } catch {
    return { title: "Контакты" };
  }
}

export default async function ContactPage() {
  try {
    const [{ page }, { page: site }] = await Promise.all([getSitePage("contact"), getSitePage("site")]);
    const img = resolveImageUrl(page.coverImageUrl);
    const phone = pick(page.data, "phone");
    const email = pick(page.data, "email");
    const address = pick(page.data, "address");
    const instagramUrl = typeof site.data?.social?.instagram === "string" ? site.data.social.instagram : null;
    const telegramUrl = typeof site.data?.social?.telegram === "string" ? site.data.social.telegram : null;
    const facebookUrl = typeof site.data?.social?.facebook === "string" ? site.data.social.facebook : null;

    return (
      <div className="container-page py-6 sm:py-10">
        <div className={`mx-auto max-w-6xl ${img ? "" : "flex flex-col items-center text-center"}`}>
          <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-6xl text-slate-950">{page.title}</h1>
          {page.content ? (
            <p className="mb-8 max-w-2xl text-xl font-medium text-slate-800">{page.content}</p>
          ) : null}

          <div className={`mt-10 grid w-full gap-12 ${img ? "lg:grid-cols-2 lg:items-center" : "max-w-3xl"}`}>
            {img ? (
              <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl transition-all hover:scale-[1.01]">
                <Image
                  alt={page.title}
                  src={img}
                  width={800}
                  height={1000}
                  className="h-full min-h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ) : null}

            <div className={`flex flex-col gap-8 ${!img ? "w-full" : ""}`}>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10 text-left">
                <div className="mb-10">
                  <h2 className="text-4xl font-bold tracking-tight text-slate-950">Обратная связь</h2>
                  <div className="mt-2 h-1.5 w-20 rounded-full bg-brand-600" />
                </div>

                <div className="space-y-10">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-600" />
                        <span className="text-sm font-black uppercase tracking-widest text-slate-600">Контактная информация</span>
                      </div>
                      <div className="space-y-2 text-2xl font-bold text-slate-950">
                        {phone ? <div className="hover:text-brand-600 transition-colors cursor-default">{phone}</div> : null}
                        {email ? <div className="text-xl hover:text-brand-600 transition-colors cursor-default">{email}</div> : null}
                        {address ? <div className="text-base font-semibold text-slate-700">{address}</div> : null}
                        {!phone && !email && !address ? (
                          <div className="text-base text-slate-500 italic font-medium">Данные будут добавлены позже.</div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-600" />
                        <span className="text-sm font-black uppercase tracking-widest text-slate-600">Социальные сети</span>
                      </div>
                      <div className="mt-1">
                        <SocialLinks instagramUrl={instagramUrl} telegramUrl={telegramUrl} facebookUrl={facebookUrl} />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  <FeedbackForm hideHeader />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="container-page py-6 sm:py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Контакты</h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          Страница пока не настроена.
        </div>
      </div>
    );
  }
}

