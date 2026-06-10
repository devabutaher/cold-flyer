/**
 * RichText — renders HTML strings from content JSON files.
 * Converts <primary> tags to <span class="text-primary"> for
 * highlighted text, and renders <br>, <br></br> as line breaks.
 *
 * Usage:
 *   <RichText html={content.heroTitle} />
 *   <RichText html={content.heroTitle} as="h1" className="text-3xl" />
 */
export default function RichText({ html, className = "", as: Tag = "span" }) {
  if (!html) return null;

  const processed = html
    .replace(/<primary>/g, '<span class="text-primary">')
    .replace(/<\/primary>/g, "</span>");

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
}
