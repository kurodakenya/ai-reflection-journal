import { createClient } from '@/lib/supabase/server';
import { getUserPlan } from '@/lib/subscription';
import { SettingsForm } from './SettingsForm';
import { ReminderSettings } from '@/components/settings/ReminderSettings';
import { ExportData } from '@/components/settings/ExportData';
import { DeleteAccount } from '@/components/settings/DeleteAccount';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const plan = await getUserPlan();

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, timezone')
    .eq('id', user!.id)
    .single();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        設定
      </h1>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            プロフィール
          </h2>
          <SettingsForm
            email={user!.email ?? ''}
            displayName={profile?.display_name ?? ''}
            timezone={profile?.timezone ?? 'Asia/Tokyo'}
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            リマインダー通知
          </h2>
          <ReminderSettings />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            アカウント情報
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                メールアドレス
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user!.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                認証方法
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user!.app_metadata?.provider === 'github' ? 'GitHub' : 'メール+パスワード'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                プラン
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {plan === 'pro' ? 'Pro' : 'Free'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            データエクスポート
          </h2>
          <ExportData isPro={plan === 'pro'} />
        </div>

        <div className="rounded-2xl border border-red-200 bg-white p-6 dark:border-red-900/50 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-red-600 dark:text-red-400">
            アカウント削除
          </h2>
          <DeleteAccount />
        </div>
      </div>
    </>
  );
}
