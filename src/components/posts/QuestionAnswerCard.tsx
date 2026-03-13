import { PostQuestionItem } from '@/features/posts/types';

interface Props {
  item: PostQuestionItem;
  index: number;
}

export function QuestionAnswerCard({ item, index }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 mt-0.5">
              {index + 1}
            </span>
            <p className="text-sm font-medium text-gray-800 leading-relaxed">{item.question}</p>
          </div>
          {item.charLimit && (
            <span className="shrink-0 text-xs text-gray-400">{item.charLimit}字以内</span>
          )}
        </div>
      </div>
      <div className="px-4 py-4">
        <p className="text-sm leading-7 text-gray-700 whitespace-pre-wrap">{item.answer}</p>
        <div className="mt-2 flex justify-end">
          <span className="text-xs text-gray-400">{item.answer.length}字</span>
        </div>
      </div>
    </div>
  );
}
