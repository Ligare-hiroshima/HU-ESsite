// User Modes
export type UserMode = 'viewer' | 'poster' | 'admin';

// Academic Levels
export type AcademicLevel = 'B1' | 'B2' | 'B3' | 'B4' | 'M1' | 'M2' | 'D1' | 'D2' | 'D3';

// Broad Fields
export type BroadField = 'science' | 'humanities' | 'medical' | 'education' | 'other';

// Selection Types
export type SelectionType = 'internship' | 'full_time';

// Job Families
export type JobFamily =
  | 'engineering_it'
  | 'engineering_mech'
  | 'engineering_elec'
  | 'engineering_chem'
  | 'business_general'
  | 'business_sales'
  | 'business_hr'
  | 'business_finance'
  | 'research'
  | 'design'
  | 'consulting'
  | 'other';

// Post Status
export type PostStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'revise' | 'unpublished';

// Verification Status
export type VerificationStatus = 'unverified' | 'verified' | 'flagged';

// Report Reasons
export type ReportReason =
  | 'personal_info'
  | 'false_content'
  | 'inappropriate'
  | 'rights_violation'
  | 'other';

// Takedown Request Types
export type TakedownRequestType = 'poster_self' | 'third_party' | 'company' | 'other';

// Review Decisions
export type ReviewDecision = 'approve' | 'revise' | 'reject' | 'unpublish';

// Hiroshima University Faculty / Graduate School
export type HUFaculty =
  // 学部
  | 'integrated_arts'      // 総合科学部
  | 'letters'              // 文学部
  | 'education'            // 教育学部
  | 'law'                  // 法学部
  | 'economics'            // 経済学部
  | 'science'              // 理学部
  | 'medicine'             // 医学部
  | 'dentistry'            // 歯学部
  | 'pharmacy'             // 薬学部
  | 'engineering'          // 工学部
  | 'applied_bio'          // 生物生産学部
  | 'informatics'          // 情報科学部
  // 研究科
  | 'grad_humanities'      // 人間社会科学研究科
  | 'grad_adv_science'     // 先進理工系科学研究科
  | 'grad_medical'         // 医系科学研究科
  | 'grad_smart_society'   // スマート社会実装科学研究科
  | 'other';

// Company
export interface Company {
  id: string;
  name: string;
  normalizedName: string;
  industry: string;
  aliases: string[];
  isLocal: boolean;
}

// Post Question Item
export interface PostQuestionItem {
  id: string;
  order: number;
  question: string;
  answer: string;
  charLimit?: number;
  isMasked: boolean;
}

// Evidence File
export interface EvidenceFile {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileType: 'submission' | 'result';
  uploadedAt: string;
  thumbnailUrl?: string;
}

// Post
export interface Post {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  industry: string;
  selectionType: SelectionType;
  jobFamily: JobFamily;
  graduationYear: number;
  academicLevel: AcademicLevel;
  broadField: BroadField;
  faculty?: HUFaculty;
  questions: PostQuestionItem[];
  posterMemo?: string;
  status: PostStatus;
  verificationStatus: VerificationStatus;
  evidenceFiles: EvidenceFile[];
  dangerFlagCount: number;
  reviewNote?: string;
  reviewerMessage?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  posterUserId: string;
  viewCount: number;
}

// Report
export interface Report {
  id: string;
  postId: string;
  reason: ReportReason;
  detail: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

// Takedown Request
export interface TakedownRequest {
  id: string;
  postId?: string;
  postUrl?: string;
  requestType: TakedownRequestType;
  reason: string;
  detail: string;
  contactEmail: string;
  status: 'pending' | 'accepted' | 'rejected' | 'resolved';
  adminNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

// Moderation Log
export interface ModerationLog {
  id: string;
  operatorId: string;
  operatorName: string;
  targetId: string;
  targetType: 'post' | 'report' | 'takedown' | 'company';
  action: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}
