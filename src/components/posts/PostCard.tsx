import Link from 'next/link';
import { Post } from '@/features/posts/types';
import { VerificationBadge } from '@/components/common/VerificationBadge';
import { selectionTypeLabels, jobFamilyLabels, broadFieldLabels, huFacultyLabels } from '@/lib/format';
import { formatDate } from '@/lib/utils';
import { FileText, Eye, MessageSquare } from 'lucide-react';

interface Props {
  post: Post;
}

export function PostCard({ post }: Props) {
  const totalChars = post.questions.reduce((sum, q) => sum + q.answer.length, 0);

  return (
    <Link href={`/posts/${post.id}`} className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{post.industry}</span>
            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{selectionTypeLabels[post.selectionType]}</span>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{post.graduationYear}卒</span>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{broadFieldLabels[post.broadField]}</span>
            {post.faculty && (
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{huFacultyLabels[post.faculty]}</span>
            )}
            {post.verificationStatus === 'verified' && <VerificationBadge status="verified" />}
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 line-clamp-2 text-sm sm:text-base">
            {post.companyName}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">{jobFamilyLabels[post.jobFamily]}</p>
        </div>
      </div>

      {post.posterMemo && (
        <p className="mt-2 line-clamp-2 text-xs text-gray-500 border-l-2 border-gray-200 pl-2">
          {post.posterMemo}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400 border-t border-gray-100 pt-3">
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {post.questions.length}問
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          計{totalChars.toLocaleString()}字
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {post.viewCount}
        </span>
        <span className="ml-auto">{formatDate(post.publishedAt || post.createdAt)}</span>
      </div>
    </Link>
  );
}
