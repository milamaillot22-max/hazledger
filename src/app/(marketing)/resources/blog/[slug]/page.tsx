import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";

import { FinalCta } from "@/components/marketing/final-cta";
import { TrialForm } from "@/components/marketing/trial-form";
import { routes, siteConfig } from "@/config/site";
import { getPost, POSTS, type Block } from "@/features/blog/posts";
import { articleStructuredData, jsonLd } from "@/lib/seo";
import { PageBackdrop } from "@/components/marketing/page-backdrop";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const path = routes.blogPost(post.slug);
  return {
    title: { absolute: `${post.title} | ${siteConfig.name}` },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName: siteConfig.name,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      images: [{ url: post.cover.src, width: post.cover.width, height: post.cover.height, alt: post.coverAlt }],
    },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={i} className="text-[17px] leading-[1.75] text-slate-700">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2 key={i} className="pt-4 font-heading text-2xl font-semibold tracking-[-0.02em] text-slate-900">
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul key={i} className="space-y-2.5 pl-1">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-slate-700">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <aside key={i} className="rounded-2xl border border-sky-100 bg-brand-soft/70 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-sky-900">
            <Info className="size-4" />
            {block.title}
          </p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-sky-950/80">{block.text}</p>
        </aside>
      );
    case "table":
      return (
        <div key={i} className="relative overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-semibold text-slate-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-slate-100">
                  {row.map((cell, c) => (
                    <td key={c} className={c === 0 ? "px-4 py-3 font-medium whitespace-nowrap text-slate-900 tabular" : "px-4 py-3 text-slate-600"}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function BlogPostPage({ params }: PageProps<"/resources/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = POSTS.filter((p) => p.slug !== post.slug);

  return (
    <>
      {articleStructuredData(post).map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(d)} />
      ))}

      <article>
        <header className="relative overflow-hidden bg-white">
          <PageBackdrop />
          <div className="relative mx-auto max-w-3xl px-4 pt-12 pb-14 sm:px-6 sm:pt-16">
            <Link href={routes.blog} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900">
              <ArrowLeft className="size-4" />
              Blog
            </Link>
            <p className="mt-6 text-xs font-semibold tracking-wider text-emerald-700 uppercase">{post.category}</p>
            <h1 className="mt-3 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-slate-900 sm:text-[2.6rem]">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">{post.description}</p>
            <p className="mt-6 text-sm text-slate-500">
              {siteConfig.name} Editorial · {formatDate(post.publishedAt)} · {post.readingMinutes} min read
            </p>
          </div>
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
            <div className="relative aspect-[21/9] overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgb(15_23_42/0.3)] ring-1 ring-slate-200/70">
              <Image src={post.cover} alt={post.coverAlt} fill priority placeholder="blur" sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl space-y-6 px-4 py-14 sm:px-6">
          {post.blocks.map(renderBlock)}

          <section aria-labelledby="sources" className="card-soft mt-10 rounded-3xl p-7">
            <h2 id="sources" className="text-sm font-semibold text-slate-900">
              Sources
            </h2>
            <ul className="mt-3 space-y-2">
              {post.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1.5 text-sm text-primary hover:underline">
                    <ExternalLink className="mt-0.5 size-3.5 shrink-0" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              General information, not legal advice. Check the current text of 29 CFR 1910.1200 and your State Plan for your
              situation.
            </p>
          </section>

          <aside className="card-soft relative mt-10 overflow-hidden rounded-3xl p-7 sm:p-9">
            <p className="font-heading text-xl font-semibold tracking-tight text-slate-900">Get your SDS library inspection-ready</p>
            <p className="mt-2 text-[15px] text-slate-500">Scan your binder, review it, and post one QR code for your whole team.</p>
            <TrialForm source={`blog-${post.slug}`} className="mt-6" />
          </aside>
        </div>
      </article>

      <nav aria-label="More articles" className="mx-auto max-w-3xl px-4 pb-6 sm:px-6">
        <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Keep reading</p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {related.map((p) => (
            <li key={p.slug}>
              <Link href={routes.blogPost(p.slug)} className="card-soft lift block h-full rounded-2xl p-5 text-[15px] font-semibold leading-snug text-slate-900 hover:border-sky-200 hover:text-primary">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <FinalCta />
    </>
  );
}
