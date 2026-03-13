'use client';

import { Stepper } from '@/components/common/Stepper';
import { usePathname } from 'next/navigation';

const steps = [
  { label: '基本情報' },
  { label: '設問・回答' },
  { label: '証跡' },
  { label: '確認' },
];

const stepPaths = ['/submit/basic', '/submit/questions', '/submit/evidence', '/submit/masking'];

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentStep = stepPaths.findIndex(p => pathname === p);
  const showStepper = currentStep >= 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {showStepper && (
        <div className="mb-8">
          <h1 className="mb-4 text-xl font-bold text-gray-900">ES投稿</h1>
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
      )}
      {children}
    </div>
  );
}
