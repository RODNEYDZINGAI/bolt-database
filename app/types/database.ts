export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  last_login: string | null
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string | null
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  is_active: boolean
  created_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'cancelled' | 'expired'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface CalculatorUsage {
  id: string
  user_id: string
  calculator_type: string
  calculator_name: string
  used_at: string
}

export interface UserPreferences {
  user_id: string
  theme: 'light' | 'dark' | 'system'
  notification_preferences: Record<string, any>
  created_at: string
  updated_at: string
}
