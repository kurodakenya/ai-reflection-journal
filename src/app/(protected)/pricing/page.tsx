import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS } from '@/lib/stripe';
import { getUserPlan } from '@/lib/subscription';
import { UpgradeButton } from '@/components/pricing/UpgradeButton';
import { ManageButton } from '@/components/pricing/ManageButton';
import { DEMO_MODE } from '@/lib/demo';

export const instant = false;

export default async function PricingPage() {
  await connection();
  let currentPlan: string;

  if (DEMO_MODE) {
    currentPlan = 'pro';
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    currentPlan = await getUserPlan();
  }

  const plans = [
    {
      key: 'free' as const,
      name: PLANS.free.name,
      price: '¥0',
      period: '/月',
      features: [
        `月${PLANS.free.journalLimit}件の日記作成`,
        `月${PLANS.free.analysisLimit}回のAI感情分析`,
        '基本的な振り返り機能',
        'ストリーク追跡',
      ],
    },
    {
      key: 'pro' as const,
      name: PLANS.pro.name,
      price: '¥980',
      period: '/月',
      features: [
        '無制限の日記作成',
        '無制限のAI感情分析',
        '詳細な感情レポート',
        '優先サポート',
        'データエクスポート',
      ],
      recommended: true,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        料金プラン
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        あなたに合ったプランを選んでください
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.key;

          return (
            <div
              key={plan.key}
              className={`relative rounded-xl border p-6 ${
                plan.recommended
                  ? 'border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/20'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-4 rounded-full bg-blue-500 px-3 py-0.5 text-xs font-semibold text-white">
                  おすすめ
                </span>
              )}

              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {plan.name}
              </h2>

              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">
                  {plan.period}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      width={16}
                      height={16}
                      className="shrink-0 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <div className="rounded-lg bg-gray-100 py-2 text-center text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    現在のプラン
                  </div>
                ) : plan.key === 'pro' ? (
                  <UpgradeButton />
                ) : (
                  currentPlan === 'pro' && <ManageButton />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
