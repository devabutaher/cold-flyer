"use client";

export function FormHeader({ title = "Add New Blog" }) {
  const isEdit = title === "Edit Blog";
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isEdit ? "Update the details to modify this blog post." : "Fill in the details to create a new blog post."}
        </p>
      </div>
    </div>
  );
}
