import Link from 'next/link';

const features = [
  {
    icon: '📝',
    title: '日記をかんたん記録',
    description:
      'テンプレート選択＋Markdownエディタで、毎日の振り返りをスムーズに。カレンダービューで一覧管理。',
  },
  {
    icon: '🤖',
    title: 'AI感情分析',
    description:
      'Claude APIが日記の感情を自動スコアリング。レーダーチャートで可視化し、自分の傾向を発見。',
  },
  {
    icon: '📊',
    title: '月間レポート',
    description:
      'AIが1ヶ月分の日記を総括。ハイライト・感情サマリー・ナラティブを自動生成。',
  },
  {
    icon: '🔥',
    title: 'ストリーク＆習慣化',
    description:
      '連続記録日数を表示し、書き続けるモチベーションをサポート。リマインダー通知も。',
  },
  {
    icon: '🔒',
    title: 'プライバシー最優先',
    description:
      'Supabase RLSで完全なデータ分離。あなたの日記は本人しか読めません。',
  },
  {
    icon: '📦',
    title: 'データエクスポート',
    description:
      'JSON / CSV形式でいつでもダウンロード。あなたのデータはあなたのもの。',
  },
];

const plans = [
  {
    name: 'Free',
    price: '¥0',
    period: '',
    description: 'まずは気軽に始めたい方に',
    features: [
      '月10件まで日記作成',
      '月5回までAI感情分析',
      'カレンダービュー',
      'ストリーク表示',
    ],
    cta: '無料ではじめる',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '¥980',
    period: '/月',
    description: '自己理解を深めたい方に',
    features: [
      '日記作成 無制限',
      'AI感情分析 無制限',
      '月間AIレポート',
      'データエクスポート',
      '優先サポート',
    ],
    cta: 'Proプランで始める',
    highlight: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            AI振り返りジャーナル
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              ログイン
            </Link>
            <Link
              href="/auth"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              無料ではじめる
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:pt-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950" />
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            日記を書くだけで
            <br />
            <span className="text-blue-600">AIが感情を可視化</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-gray-600 dark:text-gray-400">
            毎日の振り返りをAIが分析し、感情の推移やパターンを発見。
            自己理解と習慣化をサポートするジャーナルアプリです。
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl sm:w-auto"
            >
              無料ではじめる
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-gray-200 bg-white px-8 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              機能を見る
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
            主な機能
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-gray-600 dark:text-gray-400">
            日記の記録からAI分析、習慣化支援まで、振り返りに必要なすべてが揃っています。
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <span className="mb-4 block text-3xl">{f.icon}</span>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 px-4 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
            料金プラン
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-gray-600 dark:text-gray-400">
            まずは無料で始めて、もっと活用したくなったらProへ。
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlight
                    ? 'border-blue-600 bg-white shadow-xl dark:bg-gray-800'
                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    おすすめ
                  </span>
                )}
                <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="mt-0.5 text-green-500">&#10003;</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className={`block w-full rounded-full py-3 text-center text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            よくある質問
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'データは安全ですか？',
                a: 'Supabase の Row Level Security により、ご自身のデータは本人のみアクセス可能です。第三者に公開されることはありません。',
              },
              {
                q: 'Freeプランで何ができますか？',
                a: '月10件の日記作成と月5回のAI感情分析が利用できます。カレンダービュー、ストリーク表示も含まれます。',
              },
              {
                q: 'Proプランはいつでも解約できますか？',
                a: 'はい、設定画面からいつでも解約できます。解約後は次の更新日からFreeプランに戻ります。',
              },
              {
                q: 'データのエクスポートはできますか？',
                a: 'Proプランでは JSON / CSV 形式でいつでもダウンロードできます。アカウント削除時にもエクスポート可能です。',
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-gray-900 dark:text-white">
                  {faq.q}
                  <span className="ml-2 text-gray-400 transition-transform group-open:rotate-180">
                    &#9662;
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 px-4 py-20 dark:bg-blue-700">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            今日から振り返りを始めよう
          </h2>
          <p className="mb-8 text-blue-100">
            無料で始められます。クレジットカード不要。
          </p>
          <Link
            href="/auth"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50"
          >
            無料ではじめる
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white px-4 py-10 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            AI振り返りジャーナル
          </span>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/auth" className="hover:text-gray-900 dark:hover:text-white">
              ログイン
            </Link>
            <a href="#features" className="hover:text-gray-900 dark:hover:text-white">
              機能
            </a>
            <a href="#pricing" className="hover:text-gray-900 dark:hover:text-white">
              料金
            </a>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            &copy; {new Date().getFullYear()} AI振り返りジャーナル
          </p>
        </div>
      </footer>
    </div>
  );
}
