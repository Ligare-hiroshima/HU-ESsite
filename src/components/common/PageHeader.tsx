import { cn } from '@/lib/utils';

interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  breadcrumb?: React.ReactNode;
}

export function PageHeader({ title, description, actions, className, breadcrumb }: Props) {
  return (
    <div className={cn('border-b border-gray-200 bg-white px-4 py-6 sm:px-6', className)}>
      <div className="mx-auto max-w-7xl">
        {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
