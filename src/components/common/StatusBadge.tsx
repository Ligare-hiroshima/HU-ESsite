import { PostStatus } from '@/features/posts/types';
import { postStatusLabels, postStatusColors } from '@/lib/format';
import { cn } from '@/lib/utils';

interface Props {
  status: PostStatus;
  className?: string;
}

export function StatusBadge({ status, className }: Props) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', postStatusColors[status], className)}>
      {postStatusLabels[status]}
    </span>
  );
}
