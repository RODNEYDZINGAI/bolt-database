import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session?.user) {
    // Check if user exists in profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      // Create profile if it doesn't exist
      await supabase.from('profiles').insert([
        {
          id: session.user.id,
          email: session.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      // Create user preferences
      await supabase.from('user_preferences').insert([
        {
          user_id: session.user.id,
          theme: 'system',
        },
      ])

      // Assign free subscription
      const { data: freePlan } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('name', 'Free')
        .single()

      if (freePlan) {
        await supabase.from('user_subscriptions').insert([
          {
            user_id: session.user.id,
            plan_id: freePlan.id,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              new Date().setFullYear(new Date().getFullYear() + 100)
            ).toISOString(),
          },
        ])
      }
    } else {
      // Update last login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', session.user.id)
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
