import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCertificates, getPartners, getSitePage } from "@/lib/api";
import type { CertificateCategory, CertificateDto } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { contactGeo } from "@/lib/geo";
import { HandwriteText } from "@/components/HandwriteText";

const CERT_CATEGORY_LABELS: Record<CertificateCategory, string> = {
  certificate: "Сертификат",
  dealer: "Дилерское соглашение",
  award: "Награда"
};

const CERT_CATEGORY_GROUPS: { key: CertificateCategory; label: string }[] = [
  { key: "certificate", label: "Сертификаты" },
  { key: "dealer", label: "Дилерские соглашения" },
  { key: "award", label: "Награды" }
];

function CertificatesSection({ certificates }: { certificates: CertificateDto[] }) {
  const groups = CERT_CATEGORY_GROUPS.map((g) => ({
    ...g,
    items: certificates.filter((c) => c.category === g.key)
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold tracking-tight">Сертификаты и награды</h2>
      <div className="mt-6 space-y-10">
        {groups.map((group) => (
          <div key={group.key}>
            <h3 className="mb-4 text-lg font-semibold text-slate-800">{group.label}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {group.items.map((cert) => {
                const img = resolveImageUrl(cert.imageUrl);
                return (
                  <div key={cert.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
                    {img ? (
                      <div className="flex items-center justify-center">
                        <Image
                          alt={cert.name}
                          src={img}
                          width={320}
                          height={220}
                          className="h-40 w-auto max-w-full rounded-lg object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50 text-3xl text-slate-300">
                        {group.key === "award" ? "🏆" : group.key === "dealer" ? "🤝" : "📜"}
                      </div>
                    )}
                    <div className="mt-3 text-center text-sm font-semibold text-slate-900">{cert.name}</div>
                    {cert.issuedBy ? (
                      <div className="mt-1 text-center text-xs text-slate-500">{cert.issuedBy}</div>
                    ) : null}
                    {cert.description ? (
                      <div className="mt-2 text-center text-xs leading-relaxed text-slate-600">{cert.description}</div>
                    ) : null}
                    <div className="mt-auto pt-3 text-center">
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                        {CERT_CATEGORY_LABELS[cert.category]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { page } = await getSitePage("about");
    return {
      title: page.title || "О компании",
      description: page.content?.slice(0, 160) || "О компании",
      alternates: { canonical: "/about" }
    };
  } catch {
    return { title: "О компании" };
  }
}

export default async function AboutPage() {
  try {
    const [{ page }, { partners }, { page: contact }, { certificates }] = await Promise.all([
      getSitePage("about"),
      getPartners(),
      getSitePage("contact"),
      getCertificates()
    ]);
    const img = resolveImageUrl(page.coverImageUrl);
    const address = typeof contact.data?.address === "string" ? contact.data.address : null;
    const geo = contactGeo(contact.data);
    return (
      <div className="container-page py-6 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            {img ? (
              <Image
                alt={page.title}
                src={img}
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full rounded-2xl border border-slate-200 bg-white object-contain"
                priority
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-600">
                Нет изображения
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
            {page.content ? (
              <div className="mt-6 text-slate-600">
                <HandwriteText
                  text={page.content}
                  maxChars={10000}
                  speedMs={8}
                  reserveFinalHeight
                  className="text-slate-600"
                  textClassName="font-sans text-base leading-relaxed"
                />
              </div>
            ) : null}
          </div>
        </div>

        {address || geo.widgetSrc || geo.href ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-lg font-semibold text-slate-900">Геолокация</div>
            {address ? <div className="mt-2 text-sm text-slate-700">{address}</div> : null}
            {geo.widgetSrc ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <iframe
                  title="Карта"
                  src={geo.widgetSrc}
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
            {geo.href ? (
              <a
                href={geo.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 sm:w-auto"
              >
                Открыть на карте →
              </a>
            ) : null}
          </div>
        ) : null}

        {certificates.length > 0 ? (
          <CertificatesSection certificates={certificates} />
        ) : null}

        <div className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Партнеры</h2>
            <Link href="/partners" className="text-sm font-semibold text-brand-700 hover:underline">
              Все партнеры →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partners.slice(0, 8).map((p) => {
              const logo = resolveImageUrl(p.logoImageUrl);
              const card = (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-center">
                    {logo ? <Image alt={p.name} src={logo} width={240} height={120} className="h-14 w-auto object-contain" /> : null}
                  </div>
                  <div className="mt-3 text-center text-base font-semibold text-slate-900">{p.name}</div>
                </div>
              );
              return p.websiteUrl ? (
                <a key={p.id} href={p.websiteUrl} target="_blank" rel="noreferrer" className="block hover:opacity-95">
                  {card}
                </a>
              ) : (
                <div key={p.id}>{card}</div>
              );
            })}

            {partners.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 lg:col-span-4">
                Партнеров пока нет.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="container-page py-6 sm:py-10">
        <h1 className="text-3xl font-semibold tracking-tight">О компании</h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          Страница пока не настроена.
        </div>
      </div>
    );
  }
}

