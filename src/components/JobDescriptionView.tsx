import MarkdownContent from "@/components/MarkdownContent";

type JobDescriptionViewProps = {
  title: string;
  content: string;
  tone?: string;
  createdAt?: string;
};

export default function JobDescriptionView({
  title,
  content,
  tone,
  createdAt,
}: JobDescriptionViewProps) {
  return (
    <article className="rounded-xl border bg-white p-6 shadow-sm">
      <header className="mb-4 border-b pb-4">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
          {tone ? <span className="capitalize">Tone: {tone}</span> : null}
          {createdAt ? <span>{createdAt}</span> : null}
        </div>
      </header>
      <MarkdownContent content={content} />
    </article>
  );
}
