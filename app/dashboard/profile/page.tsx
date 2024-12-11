'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Profile, UserSubscription, SubscriptionPlan } from '@/app/types/database'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [subscription, setSubscription] = useState<(UserSubscription & { subscription_plans: SubscriptionPlan }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    fetchProfileAndSubscription()
  }, [])

  const fetchProfileAndSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setFullName(profileData.full_name || '')
      }

      // Fetch subscription with plan details
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (subscriptionData) {
        setSubscription(subscriptionData)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error

      setProfile(prev => prev ? { ...prev, full_name: fullName } : null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-blue-600">
              {profile?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded"
                    placeholder="Enter your full name"
                  />
                ) : (
                  profile?.full_name || 'No name set'
                )}
              </h1>
              <p className="text-blue-100">{profile?.email}</p>
            </div>
            <button
              onClick={() => {
                if (isEditing) {
                  handleUpdateProfile()
                } else {
                  setIsEditing(true)
                }
              }}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {isEditing ? 'Save' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Subscription Details
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {subscription?.subscription_plans.name || 'Free Plan'}
                </h3>
                <p className="text-gray-500 dark:text-gray-300">
                  {subscription?.subscription_plans.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${subscription?.subscription_plans.price}/
                  <span className="text-sm text-gray-500">
                    {subscription?.subscription_plans.interval}
                  </span>
                </p>
              </div>
            </div>

            {/* Subscription Features */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Included Features:
              </h4>
              <ul className="space-y-2">
                {subscription?.subscription_plans.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscription Status */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="font-medium text-green-500">
                  {subscription?.status.charAt(0).toUpperCase() + subscription?.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500 dark:text-gray-400">Current Period</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(subscription?.current_period_start || '').toLocaleDateString()} - 
                  {new Date(subscription?.current_period_end || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Account Details
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
              <p className="text-gray-900 dark:text-white">
                {new Date(profile?.created_at || '').toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
              <p className="text-gray-900 dark:text-white">
                {profile?.last_login 
                  ? new Date(profile.last_login).toLocaleDateString()
                  : 'Not available'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
