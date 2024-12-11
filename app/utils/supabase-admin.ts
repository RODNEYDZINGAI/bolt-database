import { createClient } from '@supabase/supabase-js'

// This client should be used only on the server side
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export const getActiveSubscription = async (userId: string) => {
  const { data: subscription } = await supabaseAdmin
    .from('user_subscriptions')
    .select(`
      *,
      subscription_plans(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  return subscription
}

export const getUserProfile = async (userId: string) => {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return profile
}

export const recordCalculatorUsage = async (
  userId: string,
  calculatorType: string,
  calculatorName: string
) => {
  const { error } = await supabaseAdmin
    .from('calculator_usage')
    .insert([
      {
        user_id: userId,
        calculator_type: calculatorType,
        calculator_name: calculatorName
      }
    ])

  if (error) {
    console.error('Error recording calculator usage:', error)
  }
}
