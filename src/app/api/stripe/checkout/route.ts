import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe, PLANS } from '@/lib/stripe';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLANS.pro.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      customer: subscription?.stripe_customer_id ?? undefined,
      customer_email: !subscription?.stripe_customer_id
        ? user.email
        : undefined,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'チェックアウトの作成に失敗しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
