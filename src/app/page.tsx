'use client';

import Link from 'next/link';
import { ShieldCheck, GraduationCap, FileText, ArrowRight, CheckCircle2, BookOpen, Eye, Search } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { mockPosts } from '@/mocks/data/posts';
import { PostCard } from '@/components/posts/PostCard';

export default function HomePage() {
  const recentApproved = mockPosts.filter(p => p.status === 'approved').slice(0, 3);
  const totalApproved = mockPosts.filter(p => p.status === 'approved').length;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
            <GraduationCap className="h-4 w-4" />
            広島大学生専用
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            通過ESを、<br className="sm:hidden" />
            <span className="text-blue-600">安心して</span>シェアしよう
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
            HU就活ナビは広島大学の現役学生・卒業生が匿名でESを共有するサービスです。
            すべての投稿は運営が審査し、個人情報をチェックしてから公開しています。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/posts" className={buttonVariants({ size: 'lg', className: 'gap-2' })}>
              <Search className="h-4 w-4" />
              ESを探す
            </Link>
            <Link href="/submit/basic" className={buttonVariants({ size: 'lg', variant: 'outline', className: 'gap-2' })}>
              <FileText className="h-4 w-4" />
              ESを投稿する
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            現在 {totalApproved} 件のESが公開中 · 広大生限定 · 完全匿名
          </p>
        </div>
      </section>

      {/* 3 Value Props */}
      <section className="border-y border-gray-100 bg-white px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center rounded-xl p-6 bg-blue-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-3">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">広大生限定</h3>
              <p className="mt-1 text-sm text-gray-600">広島大学の学生・卒業生による投稿のみ。同じ環境で就活する仲間の生きた情報です。</p>
            </div>
            <div className="flex flex-col items-center text-center rounded-xl p-6 bg-emerald-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-3">
                <Eye className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900">匿名投稿</h3>
              <p className="mt-1 text-sm text-gray-600">投稿者の個人情報は公開されません。身バレしやすい表現は運営が確認してからの公開です。</p>
            </div>
            <div className="flex flex-col items-center text-center rounded-xl p-6 bg-purple-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mb-3">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">運営確認済み</h3>
              <p className="mt-1 text-sm text-gray-600">すべての投稿は運営スタッフが目視確認。虚偽投稿や個人情報の含まれた投稿は公開しません。</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-xl font-bold text-gray-900 sm:text-2xl">使い方</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
                <BookOpen className="h-5 w-5 text-blue-600" />
                ESを探す場合
              </h3>
              <ol className="space-y-3">
                {[
                  '企業名・業界・職種でフィルタ',
                  '設問と回答を閲覧',
                  '投稿者メモも参考に',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-lg bg-white border border-gray-200 p-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
                <FileText className="h-5 w-5 text-emerald-600" />
                ESを投稿する場合
              </h3>
              <ol className="space-y-3">
                {[
                  '基本情報・設問回答を入力',
                  '証跡をアップロード（非公開）',
                  '個人情報の自動チェックで身バレ防止',
                  '運営の審査後に公開',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-lg bg-white border border-gray-200 p-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Recent posts */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">最近公開されたES</h2>
            <Link href="/posts" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
              すべて見る <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentApproved.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-lg font-bold text-gray-900">審査・匿名性について</h2>
          <div className="space-y-3 text-sm text-gray-700">
            {[
              { icon: CheckCircle2, text: '投稿はすべて運営スタッフが確認してから公開されます。虚偽と判断された投稿は非公開とします。' },
              { icon: CheckCircle2, text: '投稿フロー内で個人情報の自動検出機能が動作します。氏名・電話番号・メールアドレス等が含まれていないか確認します。' },
              { icon: CheckCircle2, text: '投稿者のプロフィールは公開されません。ES本文のみが公開されます。' },
              { icon: CheckCircle2, text: '削除依頼フォームから、投稿者本人・第三者・企業からの削除申請を受け付けています。' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-white border border-gray-200 p-3">
                <Icon className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
