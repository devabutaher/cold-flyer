import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { getRecentWorkBySlugServer } from "@/lib/actions/recentWorks";
import { ArrowRight, Briefcase, Calendar, ChevronLeft, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const work = await getRecentWorkBySlugServer(slug);

  if (!work) {
    return { title: "Project Not Found | ColdFlyer" };
  }

  return {
    title: `${work.title} | ColdFlyer Recent Works`,
    description: work.excerpt || work.description?.slice(0, 160) || "View our completed project",
    openGraph: {
      title: work.title,
      description: work.excerpt || work.description?.slice(0, 160),
      images: work.image?.url ? [{ url: work.image.url }] : [],
    },
  };
}

export default async function RecentWorkDetailPage({ params }) {
  const { slug } = await params;
  const work = await getRecentWorkBySlugServer(slug);

  if (!work) {
    notFound();
  }

  const imageUrl = work.image?.url;
  const date = work.completionDate || work.createdAt;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-inverted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={work.title}
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 bg-inverted" />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-inverted/80 via-inverted/40 to-transparent" />
        <div className="relative z-10 container py-32">
          <Link
            href="/recent-works"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Recent Works
          </Link>
          <div className="max-w-3xl">
            <Badge className="mb-4 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm w-fit">
              {work.category}
            </Badge>
            <h1 className="font-sans font-extrabold text-4xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-6">
              {work.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              {formattedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} />
                  {formattedDate}
                </span>
              )}
              {work.clientName && (
                <span className="flex items-center gap-1.5">
                  <Briefcase size={15} />
                  {work.clientName}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye size={15} />
                {work.views || 0} views
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <AnimatedSection className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {work.excerpt && (
              <p className="text-lg text-muted-foreground font-medium mb-8 leading-relaxed">{work.excerpt}</p>
            )}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{work.description}</p>
            </div>

            {work.tags?.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="font-sans font-bold text-lg mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 bg-primary">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-extrabold text-3xl text-primary-foreground tracking-tight mb-1">
              Interested in Similar Work?
            </h3>
            <p className="text-primary-foreground/70 text-sm">Contact us to discuss your project requirements.</p>
          </div>
          <Link href="/contact">
            <div className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground text-primary px-6 py-3 text-sm font-bold hover:bg-primary-foreground/90 transition-colors">
              Get in Touch <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </AnimatedSection>
    </main>
  );
}
