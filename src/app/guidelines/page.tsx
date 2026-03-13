export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">投稿ガイドライン</h1>
        <p className="mt-2 text-sm text-gray-500">投稿前に必ずお読みください</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-green-200 bg-green-50 p-5">
          <h2 className="mb-3 font-semibold text-green-900">✅ 投稿できる内容</h2>
          <ul className="space-y-2 text-sm text-green-800">
            {[
              '広島大学在籍中または在籍時に提出したESの設問と回答',
              '通過した選考の種別（インターン・本選考）',
              '投稿者自身の経験に基づくメモ・アドバイス',
              '業界・企業・職種・卒年・文理などの属性情報',
              '個人を特定できる情報をマスキング処理した内容',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="mb-3 font-semibold text-red-900">❌ 投稿できない内容</h2>
          <ul className="space-y-2 text-sm text-red-800">
            {[
              '虚偽・架空のES、または実際に通過していない選考情報',
              '氏名・学籍番号・連絡先など個人を特定できる情報',
              '第三者（面接官・他の就活生など）の個人情報',
              '企業の守秘義務に関わる選考内容や機密情報',
              '差別的・侮辱的表現を含む内容',
              '他サービス・SNSへの誘導リンク',
              '他者のESを無断で使用した内容',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-gray-900">マスキング例</h2>
          <p className="mb-3 text-sm text-gray-600">以下のような情報は投稿前にマスキングが必要です。投稿フロー内で自動検出・置換できます。</p>
          <div className="space-y-2">
            {[
              { before: '田中教授のゼミで研究しています', after: '[MASK]のゼミで研究しています', type: '人名・ゼミ名' },
              { before: '090-1234-5678にご連絡ください', after: '[MASK]にご連絡ください', type: '電話番号' },
              { before: 'B2023xxxx として入学しました', after: '[MASK] として入学しました', type: '学籍番号' },
              { before: '2024年3月15日に選考を受けました', after: '[MASK]に選考を受けました', type: '具体的日付' },
              { before: 'https://github.com/myaccount で公開', after: '[MASK] で公開', type: 'URL' },
            ].map((ex, i) => (
              <div key={i} className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded bg-orange-100 px-1.5 py-0.5 text-orange-700 font-medium">{ex.type}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-red-600">修正前: {ex.before}</p>
                  <p className="text-green-600">修正後: {ex.after}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-gray-900">審査基準の概要</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {[
              '提出証跡または通過証跡との内容の整合性',
              '個人情報・機密情報の不在',
              '投稿フォーマットの適正さ',
              '虚偽・誇大内容でないこと',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-orange-200 bg-orange-50 p-5">
          <h2 className="mb-3 font-semibold text-orange-900">差し戻し例</h2>
          <ul className="space-y-2 text-sm text-orange-800">
            {[
              '回答に研究室名・ゼミ名の固有名詞が含まれている',
              'メールアドレスや電話番号が文中に残っている',
              '具体的な学籍番号と思われる文字列が検出された',
              '提出証跡と内容の時期が一致しない',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
