"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { announceContentUpdated } from "@/content/useContent";
import { BlogPost, getBlogSection, toBlogSlug } from "@/lib/blogs";

type Locale = "ar" | "en";

interface BilingualContent {
  ar: Record<string, unknown>;
  en: Record<string, unknown>;
}

interface UploadPayload {
  success: boolean;
  url: string;
  folder: string;
  fileName: string;
}

const EMPTY_CONTENT: BilingualContent = {
  ar: {},
  en: {},
};

function createEmptyPost(seed?: string): BlogPost {
  const today = new Date().toISOString().slice(0, 10);

  return {
    slug: seed || `blog-${Date.now()}`,
    title: "",
    excerpt: "",
    contentHtml: "",
    coverImage: "",
    gallery: [],
    author: "",
    publishedAt: today,
  };
}

function reorder<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read selected file."));
    reader.readAsDataURL(file);
  });
}

interface RichTextEditorProps {
  value: string;
  dir: "rtl" | "ltr";
  placeholder: string;
  onChange: (html: string) => void;
}

function RichTextEditor({ value, dir, placeholder, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execute = (command: string, commandValue?: string) => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current.innerHTML);
  };

  const onInput = (event: FormEvent<HTMLDivElement>) => {
    onChange(event.currentTarget.innerHTML);
  };

  const buttonClass =
    "rounded-lg border border-[#cbb277] bg-[#f8f1df] px-2.5 py-1 text-xs font-bold text-[#3c4a23] transition hover:bg-[#edd9ad]";

  return (
    <div className="rounded-2xl border border-[#dac99e] bg-[#fffdf7] p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => execute("bold")} className={buttonClass}>
          Bold
        </button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => execute("italic")} className={buttonClass}>
          Italic
        </button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => execute("underline")} className={buttonClass}>
          Underline
        </button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => execute("formatBlock", "<h2>")} className={buttonClass}>
          H2
        </button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => execute("insertUnorderedList")} className={buttonClass}>
          Bullet List
        </button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => execute("insertOrderedList")} className={buttonClass}>
          Numbered List
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            const url = window.prompt("Enter link URL", "https://");
            if (!url) {
              return;
            }

            execute("createLink", url);
          }}
          className={buttonClass}
        >
          Link
        </button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => execute("unlink")} className={buttonClass}>
          Unlink
        </button>
      </div>

      <div className="relative">
        {!value.trim() && <span className="pointer-events-none absolute start-4 top-3 text-sm text-slate-400">{placeholder}</span>}
        <div
          ref={editorRef}
          dir={dir}
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
          className="min-h-[260px] rounded-xl border border-[#d9c79f] bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none focus:border-[#b79a59]"
        />
      </div>
    </div>
  );
}

export default function BlogAdminPage() {
  const [data, setData] = useState<BilingualContent>(EMPTY_CONTENT);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [status, setStatus] = useState("Manage blog articles and save to publish on the website.");

  const arSection = useMemo(() => getBlogSection(data.ar, "ar"), [data]);
  const enSection = useMemo(() => getBlogSection(data.en, "en"), [data]);

  const mergedPosts = useMemo(() => {
    const count = Math.max(arSection.posts.length, enSection.posts.length);

    return Array.from({ length: count }, (_, index) => {
      const ar = arSection.posts[index] ?? createEmptyPost(`post-${index + 1}`);
      const en = enSection.posts[index] ?? createEmptyPost(ar.slug || `post-${index + 1}`);

      return {
        ar,
        en,
        slug: ar.slug || en.slug || `post-${index + 1}`,
        title: ar.title || en.title || ar.slug || en.slug || `Post ${index + 1}`,
        coverImage: ar.coverImage || en.coverImage,
        publishedAt: ar.publishedAt || en.publishedAt,
      };
    });
  }, [arSection.posts, enSection.posts]);

  const selectedPost = mergedPosts[selectedIndex] ?? null;

  useEffect(() => {
    if (mergedPosts.length === 0) {
      setSelectedIndex(0);
      return;
    }

    if (selectedIndex > mergedPosts.length - 1) {
      setSelectedIndex(mergedPosts.length - 1);
    }
  }, [mergedPosts.length, selectedIndex]);

  const mutatePosts = (
    mutator: (arPosts: BlogPost[], enPosts: BlogPost[]) => { arPosts: BlogPost[]; enPosts: BlogPost[] },
  ) => {
    setData((current) => {
      const arDictionary = current.ar;
      const enDictionary = current.en;
      const arCurrentSection = getBlogSection(arDictionary, "ar");
      const enCurrentSection = getBlogSection(enDictionary, "en");

      const count = Math.max(arCurrentSection.posts.length, enCurrentSection.posts.length);
      const arPosts = [...arCurrentSection.posts];
      const enPosts = [...enCurrentSection.posts];

      while (arPosts.length < count) {
        arPosts.push(createEmptyPost());
      }

      while (enPosts.length < count) {
        enPosts.push(createEmptyPost());
      }

      const next = mutator(arPosts, enPosts);

      return {
        ar: {
          ...arDictionary,
          blogs: {
            ...arCurrentSection,
            posts: next.arPosts,
          },
        },
        en: {
          ...enDictionary,
          blogs: {
            ...enCurrentSection,
            posts: next.enPosts,
          },
        },
      };
    });
  };

  const loadContent = async () => {
    setIsLoading(true);
    setStatus("Loading blog content...");

    try {
      const response = await fetch(`/api/admin/content?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Load failed with status ${response.status}`);
      }

      const payload = (await response.json()) as Partial<BilingualContent>;
      setData({
        ar: (payload.ar ?? {}) as Record<string, unknown>,
        en: (payload.en ?? {}) as Record<string, unknown>,
      });

      setStatus("Blog content loaded successfully.");
    } catch (error) {
      console.error(error);
      setStatus("Failed to load blog content.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    setIsSaving(true);
    setStatus("Saving blog content...");

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let message = `Save failed with status ${response.status}`;
        try {
          const payload = (await response.json()) as { error?: string; details?: string };
          const details = [payload.error, payload.details].filter(Boolean).join(" - ");
          if (details) {
            message = details;
          }
        } catch {
          // Ignore JSON parse errors and keep status-based fallback message.
        }

        throw new Error(message);
      }

      announceContentUpdated();
      setStatus("Blog content saved and published.");
    } catch (error) {
      console.error(error);
      const details = error instanceof Error && error.message ? ` ${error.message}` : "";
      setStatus(`Failed to save blog content.${details}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    void loadContent();
  }, []);

  const updateSharedField = (index: number, field: "slug" | "coverImage" | "author" | "publishedAt", value: string) => {
    mutatePosts((arPosts, enPosts) => {
      arPosts[index] = { ...arPosts[index], [field]: value };
      enPosts[index] = { ...enPosts[index], [field]: value };
      return { arPosts, enPosts };
    });
  };

  const updateLocaleField = (locale: Locale, index: number, field: "title" | "excerpt" | "contentHtml", value: string) => {
    mutatePosts((arPosts, enPosts) => {
      if (locale === "ar") {
        arPosts[index] = { ...arPosts[index], [field]: value };
      } else {
        enPosts[index] = { ...enPosts[index], [field]: value };
      }

      return { arPosts, enPosts };
    });
  };

  const updateGalleryValue = (index: number, galleryIndex: number, value: string) => {
    mutatePosts((arPosts, enPosts) => {
      const nextArGallery = [...(arPosts[index]?.gallery ?? [])];
      const nextEnGallery = [...(enPosts[index]?.gallery ?? [])];

      nextArGallery[galleryIndex] = value;
      nextEnGallery[galleryIndex] = value;

      arPosts[index] = { ...arPosts[index], gallery: nextArGallery };
      enPosts[index] = { ...enPosts[index], gallery: nextEnGallery };

      return { arPosts, enPosts };
    });
  };

  const addGallerySlot = (index: number) => {
    mutatePosts((arPosts, enPosts) => {
      arPosts[index] = { ...arPosts[index], gallery: [...(arPosts[index]?.gallery ?? []), ""] };
      enPosts[index] = { ...enPosts[index], gallery: [...(enPosts[index]?.gallery ?? []), ""] };
      return { arPosts, enPosts };
    });
  };

  const removeGallerySlot = (index: number, galleryIndex: number) => {
    mutatePosts((arPosts, enPosts) => {
      arPosts[index] = {
        ...arPosts[index],
        gallery: (arPosts[index]?.gallery ?? []).filter((_, itemIndex) => itemIndex !== galleryIndex),
      };
      enPosts[index] = {
        ...enPosts[index],
        gallery: (enPosts[index]?.gallery ?? []).filter((_, itemIndex) => itemIndex !== galleryIndex),
      };

      return { arPosts, enPosts };
    });
  };

  const addPost = () => {
    const seed = `blog-${Date.now()}`;

    mutatePosts((arPosts, enPosts) => {
      arPosts.push(createEmptyPost(seed));
      enPosts.push(createEmptyPost(seed));
      return { arPosts, enPosts };
    });

    setSelectedIndex(mergedPosts.length);
    setStatus("New blog draft added.");
  };

  const removePost = (index: number) => {
    mutatePosts((arPosts, enPosts) => {
      return {
        arPosts: arPosts.filter((_, itemIndex) => itemIndex !== index),
        enPosts: enPosts.filter((_, itemIndex) => itemIndex !== index),
      };
    });

    setStatus("Blog removed.");
  };

  const movePost = (from: number, to: number) => {
    mutatePosts((arPosts, enPosts) => ({
      arPosts: reorder(arPosts, from, to),
      enPosts: reorder(enPosts, from, to),
    }));

    setSelectedIndex(to);
  };

  const ensureBlogSlug = (): string => {
    if (!selectedPost) {
      return "";
    }

    const currentSlug = selectedPost.slug.trim();
    if (currentSlug) {
      return currentSlug;
    }

    const generated =
      toBlogSlug(selectedPost.ar.title) ||
      toBlogSlug(selectedPost.en.title) ||
      `blog-${Date.now()}`;

    updateSharedField(selectedIndex, "slug", generated);
    return generated;
  };

  const uploadImage = async (file: File, variant: "cover" | "gallery"): Promise<string | null> => {
    const slug = ensureBlogSlug();
    if (!slug) {
      setStatus("Please create a post first.");
      return null;
    }

    setUploadingTarget(variant);
    setStatus(`Uploading ${variant} image...`);

    try {
      const dataUrl = await fileToDataUrl(file);
      const response = await fetch("/api/admin/blog-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogName: slug,
          fileName: file.name,
          dataUrl,
          variant,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Upload failed with status ${response.status}`);
      }

      const payload = (await response.json()) as UploadPayload;
      setStatus(`Uploaded image to ${payload.folder}.`);
      return payload.url;
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "Failed to upload image.");
      return null;
    } finally {
      setUploadingTarget(null);
    }
  };

  const onCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedPost) {
      return;
    }

    const uploadedUrl = await uploadImage(file, "cover");
    if (uploadedUrl) {
      updateSharedField(selectedIndex, "coverImage", uploadedUrl);
    }

    event.target.value = "";
  };

  const onGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedPost) {
      return;
    }

    const uploadedUrl = await uploadImage(file, "gallery");
    if (uploadedUrl) {
      mutatePosts((arPosts, enPosts) => {
        arPosts[selectedIndex] = {
          ...arPosts[selectedIndex],
          gallery: [...(arPosts[selectedIndex]?.gallery ?? []), uploadedUrl],
        };

        enPosts[selectedIndex] = {
          ...enPosts[selectedIndex],
          gallery: [...(enPosts[selectedIndex]?.gallery ?? []), uploadedUrl],
        };

        return { arPosts, enPosts };
      });
    }

    event.target.value = "";
  };

  return (
    <main className="min-h-screen bg-[#090C11] p-4 sm:p-6">
      <div className="mx-auto max-w-[1520px] space-y-4">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#111723] to-[#161d2b] p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">Blog Management</h1>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                Create rich blog posts with formatted text, cover image, and gallery images.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a href="/admin" className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                Back To Dashboard
              </a>
              <button
                type="button"
                onClick={loadContent}
                disabled={isLoading}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
              >
                {isLoading ? "Loading..." : "Reload"}
              </button>
              <button
                type="button"
                onClick={saveContent}
                disabled={isSaving}
                className="rounded-xl bg-[#cb9a3c] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save & Publish"}
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">{status}</p>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-black uppercase tracking-wide text-[#2f4a1f]">Posts</h2>
              <button
                type="button"
                onClick={addPost}
                className="rounded-lg border border-[#b69a5f] bg-[#f6edd8] px-3 py-1.5 text-xs font-semibold text-[#3f4d28]"
              >
                Add Post
              </button>
            </div>

            <div className="space-y-2">
              {mergedPosts.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                  No blog posts yet. Create your first post.
                </div>
              )}

              {mergedPosts.map((post, index) => (
                <div
                  key={`${post.slug}-${index}`}
                  className={`rounded-xl border p-3 transition ${
                    index === selectedIndex
                      ? "border-[#b89d5b] bg-[#f8f1df]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className="w-full text-start"
                  >
                    <div className="truncate text-sm font-black text-[#2f3b1f]">{post.title}</div>
                    <div className="mt-1 truncate text-xs text-slate-500">{post.slug}</div>
                  </button>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => movePost(index, index - 1)}
                      disabled={index === 0}
                      className="rounded border border-slate-300 px-2 py-1 text-[11px] disabled:opacity-40"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => movePost(index, index + 1)}
                      disabled={index === mergedPosts.length - 1}
                      className="rounded border border-slate-300 px-2 py-1 text-[11px] disabled:opacity-40"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={() => removePost(index)}
                      className="rounded border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            {!selectedPost ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                Select a post or create a new one.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Slug</label>
                    <input
                      value={selectedPost.slug}
                      onChange={(event) => updateSharedField(selectedIndex, "slug", toBlogSlug(event.target.value))}
                      placeholder="example-blog-post"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Author</label>
                    <input
                      value={selectedPost.ar.author || selectedPost.en.author || ""}
                      onChange={(event) => updateSharedField(selectedIndex, "author", event.target.value)}
                      placeholder="Author name"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Published Date</label>
                    <input
                      type="date"
                      value={selectedPost.publishedAt}
                      onChange={(event) => updateSharedField(selectedIndex, "publishedAt", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Open Live Post</label>
                    <a
                      href={`/blogs/${encodeURIComponent(selectedPost.slug || "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-xl border border-[#b89d5b] bg-[#f8f1df] px-3 py-2 text-sm font-semibold text-[#3c4a23]"
                    >
                      Preview Blog
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#dcc99b] bg-[#fff8e8] p-4">
                  <h3 className="text-sm font-black uppercase tracking-wide text-[#3b4923]">Cover Image</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <input
                      value={selectedPost.coverImage}
                      onChange={(event) => updateSharedField(selectedIndex, "coverImage", event.target.value)}
                      placeholder="https://... or /Blogs/your-post/cover.jpg"
                      className="min-w-[250px] flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                    <label className="cursor-pointer rounded-lg border border-[#b89d5b] bg-[#f6edd8] px-3 py-2 text-xs font-semibold text-[#3f4d28]">
                      Upload Cover
                      <input type="file" accept="image/*" className="hidden" onChange={onCoverUpload} />
                    </label>
                    {uploadingTarget === "cover" && <span className="text-xs text-slate-500">Uploading...</span>}
                  </div>
                  {selectedPost.coverImage && (
                    <img src={selectedPost.coverImage} alt="Cover" className="mt-3 h-40 w-full rounded-xl border border-[#d9c79f] object-cover sm:w-72" />
                  )}
                </div>

                <div className="rounded-2xl border border-[#dcc99b] bg-[#fff8e8] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-black uppercase tracking-wide text-[#3b4923]">Blog Gallery</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => addGallerySlot(selectedIndex)}
                        className="rounded-lg border border-[#b89d5b] bg-[#f6edd8] px-3 py-1.5 text-xs font-semibold text-[#3f4d28]"
                      >
                        Add URL Slot
                      </button>
                      <label className="cursor-pointer rounded-lg border border-[#b89d5b] bg-[#f6edd8] px-3 py-1.5 text-xs font-semibold text-[#3f4d28]">
                        Upload Gallery Image
                        <input type="file" accept="image/*" className="hidden" onChange={onGalleryUpload} />
                      </label>
                    </div>
                  </div>

                  {uploadingTarget === "gallery" && <p className="mt-2 text-xs text-slate-500">Uploading...</p>}

                  <div className="mt-3 space-y-2">
                    {(selectedPost.ar.gallery.length > 0 ? selectedPost.ar.gallery : selectedPost.en.gallery).map((image, galleryIndex) => (
                      <div key={`gallery-${galleryIndex}`} className="flex flex-wrap items-center gap-2">
                        <input
                          value={image}
                          onChange={(event) => updateGalleryValue(selectedIndex, galleryIndex, event.target.value)}
                          placeholder="/Blogs/post-slug/gallery-image.jpg"
                          className="min-w-[230px] flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeGallerySlot(selectedIndex, galleryIndex)}
                          className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-[#2f4a1f]">Arabic Content</h3>
                    <div className="space-y-2">
                      <input
                        value={selectedPost.ar.title}
                        onChange={(event) => updateLocaleField("ar", selectedIndex, "title", event.target.value)}
                        placeholder="عنوان المقال"
                        dir="rtl"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                      <textarea
                        value={selectedPost.ar.excerpt}
                        onChange={(event) => updateLocaleField("ar", selectedIndex, "excerpt", event.target.value)}
                        placeholder="وصف مختصر للمقال"
                        dir="rtl"
                        rows={3}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                      <RichTextEditor
                        value={selectedPost.ar.contentHtml}
                        dir="rtl"
                        placeholder="اكتب محتوى المقال هنا..."
                        onChange={(html) => updateLocaleField("ar", selectedIndex, "contentHtml", html)}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-[#2f4a1f]">English Content</h3>
                    <div className="space-y-2">
                      <input
                        value={selectedPost.en.title}
                        onChange={(event) => updateLocaleField("en", selectedIndex, "title", event.target.value)}
                        placeholder="Blog title"
                        dir="ltr"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                      <textarea
                        value={selectedPost.en.excerpt}
                        onChange={(event) => updateLocaleField("en", selectedIndex, "excerpt", event.target.value)}
                        placeholder="Short summary"
                        dir="ltr"
                        rows={3}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                      <RichTextEditor
                        value={selectedPost.en.contentHtml}
                        dir="ltr"
                        placeholder="Write your article content here..."
                        onChange={(html) => updateLocaleField("en", selectedIndex, "contentHtml", html)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
