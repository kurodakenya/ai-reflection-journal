import { describe, test, expect, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/stripe', () => ({
  PLANS: {
    free: { journalLimit: 10, analysisLimit: 5 },
    pro: { journalLimit: Infinity, analysisLimit: Infinity },
  },
}));

describe('subscription module', () => {
  test('returns free when no user', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: vi.fn(),
    } as never);

    const { getUserPlan } = await import('@/lib/subscription');
    const plan = await getUserPlan();
    expect(plan).toBe('free');
  });

  test('returns free when no active subscription', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1' } },
        }),
      },
      from: mockFrom,
    } as never);

    const { getUserPlan } = await import('@/lib/subscription');
    const plan = await getUserPlan();
    expect(plan).toBe('free');
  });

  test('returns pro when active subscription exists', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { plan_type: 'pro', status: 'active' },
          }),
        }),
      }),
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1' } },
        }),
      },
      from: mockFrom,
    } as never);

    const { getUserPlan } = await import('@/lib/subscription');
    const plan = await getUserPlan();
    expect(plan).toBe('pro');
  });
});
