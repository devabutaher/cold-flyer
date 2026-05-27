import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth-server";
import EditBlogForm from "@/components/dashboard/blog/edit-blog/edit-blog-form";
import { getBlogBySlugServer } from "@/lib/actions/blogs";

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await getCurrentUser();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const blog = await getBlogBySlugServer(id);
    return {
      title: blog ? `Edit ${blog.title} | ColdFlyer` : "Edit Blog | ColdFlyer",
    };
  } catch {
    return { title: "Edit Blog | ColdFlyer" };
  }
}

export default async function EditBlogPage({ params }) {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = h.get("x-invoke-path") || h.get("next-url") || "";
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  const user = await getUser();

  if (!user || !["admin", "moderator"].includes(user.role)) {
    redirect("/");
  }

  const { id: slugOrId } = await params;

  let blog = null;
  try {
    blog = await getBlogBySlugServer(slugOrId);
  } catch (error) {
    console.error("Failed to fetch blog:", error);
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-muted-foreground">Blog not found</p>
      </div>
    );
  }

  return <EditBlogForm blog={blog} isAdmin={["admin", "moderator"].includes(user.role)} />;
}
