import { createClient } from '@/lib/supabase/server';
import { PLANS } from '@/lib/stripe';

export type UserPlan = 'free' | 'pro';

export async function getUserPlan(): Promise<UserPlan> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 'free';

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_type, status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (subscription?.plan_type === 'pro' && subscription.status === 'active') {
    return 'pro';
  }

  return 'free';
}

export async function checkJournalLimit(): Promise<{
  allowed: boolean;
  current: number;
  limit: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { allowed: false, current: 0, limit: 0 };

  const plan = await getUserPlan();
  const limit = PLANS[plan].journalLimit;

  if (limit === Infinity) {
    return { allowed: true, current: 0, limit: Infinity };
  }

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const nextMonth =
    now.getMonth() === 11
      ? `${now.getFullYear() + 1}-01-01`
      : `${now.getFullYear()}-${String(now.getMonth() + 2).padStart(2, '0')}-01`;

  const { count } = await supabase
    .from('journal_entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('entry_date', monthStart)
    .lt('entry_date', nextMonth);

  const current = count ?? 0;

  return { allowed: current < limit, current, limit };
}

export async function checkAnalysisLimit(): Promise<{
  allowed: boolean;
  current: number;
  limit: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { allowed: false, current: 0, limit: 0 };

  const plan = await getUserPlan();
  const limit = PLANS[plan].analysisLimit;

  if (limit === Infinity) {
    return { allowed: true, current: 0, limit: Infinity };
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

  const { count } = await supabase
    .from('emotion_analyses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', monthStart)
    .lt('created_at', nextMonth);

  const current = count ?? 0;

  return { allowed: current < limit, current, limit };
}
