import { ModerationLog } from '@/features/posts/types';

export const mockLogs: ModerationLog[] = [
  { id: 'l1', operatorId: 'admin1', operatorName: '管理者A', targetId: 'p1', targetType: 'post', action: '承認', meta: { previousStatus: 'pending', newStatus: 'approved' }, createdAt: '2025-06-12T09:00:00Z' },
  { id: 'l2', operatorId: 'admin1', operatorName: '管理者A', targetId: 'p2', targetType: 'post', action: '承認', meta: { previousStatus: 'pending', newStatus: 'approved' }, createdAt: '2025-05-22T11:00:00Z' },
  { id: 'l3', operatorId: 'admin2', operatorName: '管理者B', targetId: 'p3', targetType: 'post', action: '承認', meta: { previousStatus: 'pending', newStatus: 'approved' }, createdAt: '2025-07-03T10:00:00Z' },
  { id: 'l4', operatorId: 'admin2', operatorName: '管理者B', targetId: 'p4', targetType: 'post', action: '承認', meta: { previousStatus: 'pending', newStatus: 'approved' }, createdAt: '2025-04-17T14:00:00Z' },
  { id: 'l5', operatorId: 'admin1', operatorName: '管理者A', targetId: 'p5', targetType: 'post', action: '承認', meta: { previousStatus: 'pending', newStatus: 'approved' }, createdAt: '2025-03-12T09:00:00Z' },
  { id: 'l6', operatorId: 'admin1', operatorName: '管理者A', targetId: 'p19', targetType: 'post', action: '差し戻し', meta: { previousStatus: 'pending', newStatus: 'revise', reason: '個人情報の検出' }, createdAt: '2025-09-08T15:00:00Z' },
  { id: 'l7', operatorId: 'admin2', operatorName: '管理者B', targetId: 'p20', targetType: 'post', action: '差し戻し', meta: { previousStatus: 'pending', newStatus: 'revise', reason: '研究室名の記載' }, createdAt: '2025-09-10T11:00:00Z' },
  { id: 'l8', operatorId: 'admin1', operatorName: '管理者A', targetId: 'p21', targetType: 'post', action: '差し戻し', meta: { previousStatus: 'pending', newStatus: 'revise', reason: '電話番号・学籍番号の検出' }, createdAt: '2025-09-12T14:00:00Z' },
  { id: 'l9', operatorId: 'admin2', operatorName: '管理者B', targetId: 'p23', targetType: 'post', action: '却下', meta: { previousStatus: 'pending', newStatus: 'rejected', reason: '証跡と内容の矛盾' }, createdAt: '2025-08-20T16:00:00Z' },
  { id: 'l10', operatorId: 'admin1', operatorName: '管理者A', targetId: 'p24', targetType: 'post', action: '却下', meta: { previousStatus: 'pending', newStatus: 'rejected', reason: '個人情報の除去不能' }, createdAt: '2025-09-01T14:00:00Z' },
  { id: 'l11', operatorId: 'admin2', operatorName: '管理者B', targetId: 'p25', targetType: 'post', action: '却下', meta: { previousStatus: 'pending', newStatus: 'rejected', reason: '不適切なコンテンツ' }, createdAt: '2025-08-25T11:00:00Z' },
  { id: 'l12', operatorId: 'admin1', operatorName: '管理者A', targetId: 'r1', targetType: 'report', action: '通報確認済み（問題なし）', meta: { reportId: 'r1', postId: 'p5' }, createdAt: '2025-03-16T09:00:00Z' },
  { id: 'l13', operatorId: 'admin2', operatorName: '管理者B', targetId: 'r3', targetType: 'report', action: '通報却下', meta: { reportId: 'r3', postId: 'p7' }, createdAt: '2025-05-12T10:00:00Z' },
  { id: 'l14', operatorId: 'admin1', operatorName: '管理者A', targetId: 't1', targetType: 'takedown', action: '削除依頼受理', meta: { takedownId: 't1', postId: 'p5' }, createdAt: '2025-08-03T14:00:00Z' },
  { id: 'l15', operatorId: 'admin2', operatorName: '管理者B', targetId: 't4', targetType: 'takedown', action: '削除依頼却下', meta: { takedownId: 't4', postId: 'p10', reason: '原則不受理' }, createdAt: '2025-08-22T10:00:00Z' },
  { id: 'l16', operatorId: 'admin1', operatorName: '管理者A', targetId: 'p6', targetType: 'post', action: '承認', meta: { previousStatus: 'pending', newStatus: 'approved' }, createdAt: '2025-06-03T11:00:00Z' },
  { id: 'l17', operatorId: 'admin2', operatorName: '管理者B', targetId: 'p7', targetType: 'post', action: '承認', meta: { previousStatus: 'pending', newStatus: 'approved' }, createdAt: '2025-05-04T10:00:00Z' },
  { id: 'l18', operatorId: 'admin1', operatorName: '管理者A', targetId: 'p22', targetType: 'post', action: '差し戻し', meta: { previousStatus: 'pending', newStatus: 'revise', reason: 'ゼミ名の記載' }, createdAt: '2025-09-14T10:00:00Z' },
];
