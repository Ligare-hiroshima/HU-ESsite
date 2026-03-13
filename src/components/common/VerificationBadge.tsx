import { VerificationStatus } from '@/features/posts/types';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  status: VerificationStatus;
  className?: string;
}

export function VerificationBadge({ status, className }: Props) {
  if (status === 'verified') {
    return (
      <span className={cn('inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700', className)}>
        <ShieldCheck className="h-3 w-3" />
        運営確認済み
      </span>
    );
  }
  if (status === 'flagged') {
    return (
      <span className={cn('inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700', className)}>
        <ShieldAlert className="h-3 w-3" />
        要確認
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500', className)}>
      <Shield className="h-3 w-3" />
      未確認
    </span>
  );
}
