import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Eye, Newspaper, Tag, User, ArrowLeft, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sanitizeForRSC } from "@/lib/utils";
import { getBreadcrumbSchema } from "@/lib/seo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.com";

async function fetchBlog(slug) {
  try {
    const res = await fetch(`${API_URL}/api/blogs/slug/${slug}`, { next: { tags: ["blogs", "blog-detail"] } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.blog || data?.blog || null;
  } catch {
    return null;
  }
}

async function fetchFeaturedBlogs(currentSlug) {
  try {
    const res = await fetch(`${API_URL}/api/blogs/featured?limit=3`, { next: { tags: ["blogs"] } });
    if (!res.ok) return [];
    const data = await res.json();
    const blogs = data?.data?.blogs || data?.blogs || [];
    return blogs.filter((b) => b.slug !== currentSlug).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!slug) return {};

  const blog = await fetchBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Cold Flyer",
      description: "The requested blog post could not be found.",
    };
  }

  const imageUrl = blog.image?.url || "/placeholder-blog.jpg";
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${SITE_URL}${imageUrl}`;
  const description = blog.excerpt || blog.seo?.metaDescription || blog.content?.slice(0, 160) || "";

  return {
    title: `${blog.title} | Cold Flyer Blog`,
    description,
    openGraph: {
      title: `${blog.title} | Cold Flyer Blog`,
      description,
      url: `${SITE_URL}/blog/${blog.slug}`,
      siteName: "Cold Flyer",
      images: [{ url: fullImageUrl, width: 1200, height: 630, alt: blog.title }],
      locale: "en_BD",
      type: "article",
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: [blog.author?.name || "Cold Flyer"],
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | Cold Flyer Blog`,
      description,
      images: [fullImageUrl],
    },
    alternates: { canonical: `${SITE_URL}/blog/${blog.slug}` },
    keywords: blog.tags?.join(", ") || blog.seo?.metaKeywords || "",
  };
}

export async function generateStaticParams() {
  return [];
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readingTime(content) {
  if (!content) return 1;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  if (!slug) notFound();

  const blog = sanitizeForRSC(await fetchBlog(slug));
  if (!blog) notFound();

  const featuredBlogs = sanitizeForRSC(await fetchFeaturedBlogs(slug));

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: blog.title, url: `${SITE_URL}/blog/${slug}` },
  ]);

  return (
    <>
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}

      <article className="bg-background text-foreground">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {blog.image?.url ? (
            <Image
              src={blog.image.url}
              alt={blog.image?.alt || blog.title}
              fill
              priority
              sizes="100vw"
              quality={85}
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Newspaper className="h-20 w-20 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container pb-12 md:pb-16">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft size="16" />
                Back to Blog
              </Link>
              <div className="max-w-3xl">
                <Badge className="mb-4 border-0 bg-primary/90 text-primary-foreground uppercase text-xs tracking-wider">
                  <Tag size="12" className="mr-1" />
                  {blog.category}
                </Badge>
                <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-white leading-tight tracking-tight mb-4">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
                  {blog.author?.name && (
                    <span className="flex items-center gap-1.5">
                      <User size="14" />
                      {blog.author.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar size="14" />
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size="14" />
                    {readingTime(blog.content)} min read
                  </span>
                  {blog.views > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Eye size="14" />
                      {blog.views} views
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            {blog.excerpt && (
              <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-8">{blog.excerpt}</p>
            )}

            <div className="prose prose-lg max-w-none dark:prose-invert">
              {blog.content?.split("\n").map((paragraph, i) => (paragraph.trim() ? <p key={i}>{paragraph}</p> : null))}
            </div>

            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Link href="/blog">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ArrowLeft size="14" />
                  All Articles
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Share2 size="14" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {featuredBlogs.length > 0 && (
          <section className="bg-card py-16">
            <div className="container">
              <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredBlogs.map((related) => (
                  <Link
                    key={related._id}
                    href={`/blog/${related.slug}`}
                    className="group bg-background rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {related.image?.url ? (
                        <Image
                          src={related.image.url}
                          alt={related.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                          <Newspaper className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <Badge variant="secondary" className="text-xxs uppercase tracking-wider mb-2">
                        {related.category}
                      </Badge>
                      <h3 className="font-sans font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{related.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
