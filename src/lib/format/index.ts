import { PostStatus, SelectionType, JobFamily, BroadField, AcademicLevel, ReportReason, TakedownRequestType, VerificationStatus, HUFaculty } from '@/features/posts/types';

export const selectionTypeLabels: Record<SelectionType, string> = {
  internship: 'インターン',
  full_time: '本選考',
};

export const jobFamilyLabels: Record<JobFamily, string> = {
  engineering_it: 'ITエンジニア',
  engineering_mech: '機械系エンジニア',
  engineering_elec: '電気・電子系エンジニア',
  engineering_chem: '化学系エンジニア',
  business_general: '総合職',
  business_sales: '営業職',
  business_hr: '人事職',
  business_finance: '財務・金融職',
  research: '研究職',
  design: 'デザイナー',
  consulting: 'コンサルタント',
  other: 'その他',
};

export const broadFieldLabels: Record<BroadField, string> = {
  science: '理系',
  humanities: '文系',
  medical: '医療・保健系',
  education: '教育系',
  other: 'その他',
};

export const academicLevelLabels: Record<AcademicLevel, string> = {
  B1: '学部1年',
  B2: '学部2年',
  B3: '学部3年',
  B4: '学部4年',
  M1: '修士1年',
  M2: '修士2年',
  D1: '博士1年',
  D2: '博士2年',
  D3: '博士3年',
};

export const postStatusLabels: Record<PostStatus, string> = {
  draft: '下書き',
  pending: '審査待ち',
  approved: '公開中',
  rejected: '却下',
  revise: '差し戻し',
  unpublished: '非公開',
};

export const postStatusColors: Record<PostStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  revise: 'bg-orange-100 text-orange-700',
  unpublished: 'bg-gray-100 text-gray-500',
};

export const reportReasonLabels: Record<ReportReason, string> = {
  personal_info: '個人情報が残っている',
  false_content: '虚偽の疑い',
  inappropriate: '不適切な表現',
  rights_violation: '権利侵害の懸念',
  other: 'その他',
};

export const takedownTypeLabels: Record<TakedownRequestType, string> = {
  poster_self: '投稿者本人',
  third_party: '第三者',
  company: '企業・団体',
  other: 'その他',
};

export const verificationLabels: Record<VerificationStatus, string> = {
  unverified: '未確認',
  verified: '運営確認済み',
  flagged: '要確認',
};

export const industries = [
  'IT・通信', 'IT・EC', 'IT・広告', 'IT・製造', 'IT・電機・エンタメ',
  'コンサルティング・IT', '銀行・金融', '総合商社', '電機・製造',
  '自動車・製造', '自動車部品', '電力・エネルギー', 'ガス・エネルギー',
  'サービス・HR', 'その他',
];

export function fileSizeLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
