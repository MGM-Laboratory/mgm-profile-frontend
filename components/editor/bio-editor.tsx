"use client";

import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import { cn } from "@/lib/cn";

// Rich-text bio editor (TipTap). Emits HTML; kept modest (marks + lists) to suit
// the calm design system. Controlled by `value`/`onChange`.
export function BioEditor({
  value,
  onChange,
  placeholder = "Write a short bio…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose-measure min-h-32 max-w-none px-3 py-2 text-body-sm leading-relaxed text-ink focus:outline-none",
        "aria-label": "Bio",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Keep editor content in sync when the form resets it externally.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className="border-line bg-surface focus-within:border-brand-blue overflow-hidden rounded-md border transition-colors duration-200">
      <Toolbar editor={editor} />
      {editor ? (
        <EditorContent editor={editor} />
      ) : (
        <p className="text-ink-4 text-body-sm px-3 py-2">{placeholder}</p>
      )}
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  const btn = (active: boolean) =>
    cn(
      "flex h-7 w-7 items-center justify-center rounded-sm transition-colors duration-150",
      active
        ? "bg-brand-blue-50 text-brand-blue"
        : "text-ink-3 hover:bg-surface-muted hover:text-ink",
    );
  return (
    <div className="border-line bg-surface-muted flex items-center gap-1 border-b px-2 py-1.5">
      <button
        type="button"
        aria-label="Bold"
        className={btn(editor.isActive("bold"))}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={15} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        aria-label="Italic"
        className={btn(editor.isActive("italic"))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={15} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        aria-label="Strikethrough"
        className={btn(editor.isActive("strike"))}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={15} strokeWidth={2.25} />
      </button>
      <span className="bg-line mx-1 h-4 w-px" />
      <button
        type="button"
        aria-label="Bullet list"
        className={btn(editor.isActive("bulletList"))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={15} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        aria-label="Ordered list"
        className={btn(editor.isActive("orderedList"))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={15} strokeWidth={2.25} />
      </button>
    </div>
  );
}
