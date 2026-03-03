'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface UserProfile {
  id: string
  name: string
  email: string
  created_at?: string
}

export default function Dashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/Atlas-Synapse-Homepage/login')
      return
    }

    // Fetch user profile from Supabase
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          // User doesn't exist in database yet, create profile
          const { data: newUser } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || 'User',
                created_at: new Date(),
              },
            ])
            .select()
            .single()

          if (newUser) {
            setProfile(newUser)
          }
        } else if (data) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/Atlas-Synapse-Homepage/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050816]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-atlas-primary/30 border-t-atlas-primary mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050816]">
        <p className="text-slate-300">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] pt-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">{profile.name}</h1>
              <p className="text-slate-400">{profile.email}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Full Name</p>
                <p className="text-slate-100 font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Email Address</p>
                <p className="text-slate-100 font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">User ID</p>
                <p className="text-slate-100 font-medium text-xs font-mono">{profile.id}</p>
              </div>
              {profile.created_at && (
                <div>
                  <p className="text-sm text-slate-400">Member Since</p>
                  <p className="text-slate-100 font-medium">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mt-8">
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600/20 px-6 py-2 font-semibold text-red-400 hover:bg-red-600/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/Atlas-Synapse-Homepage/" className="text-atlas-secondary hover:text-atlas-primary">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
