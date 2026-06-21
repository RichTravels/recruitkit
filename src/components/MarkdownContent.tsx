import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("prose prose-sm max-w-none text-slate-800", className)}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
