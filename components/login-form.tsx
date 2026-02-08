'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

import { signIn } from 'next-auth/react'

type LoginStep = 'credentials' | 'otp' | 'success'

export function LoginForm() {
  const [step, setStep] = useState<LoginStep>('credentials')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(300)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [twoFaEnabled, setTwoFaEnabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // OTP timer countdown
  useEffect(() => {
    if (step !== 'otp') return

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [step])

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error === '2FA_REQUIRED') {
        // If 2FA is needed, we need to trigger the OTP email first
        // Usually you'd have an API to send the OTP separately
        await fetch('/api/auth/resend-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })

        setTwoFaEnabled(true)
        setStep('otp')
        setTimer(300)
        setResendDisabled(true)
      } else if (result?.error) {
        setErrorMessage(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error)
      } else {
        setStep('success')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('An error occurred during login.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) return

    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        otp: otpCode,
        redirect: false,
      })

      if (result?.error) {
        setErrorMessage('Invalid verification code')
      } else {
        setStep('success')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setErrorMessage('An error occurred during verification.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    setResendDisabled(true)

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to resend OTP')
        setResendDisabled(false)
        setIsLoading(false)
        return
      }

      console.log('✅ OTP resent successfully')
      setOtp(['', '', '', '', '', ''])
      setTimer(300)
    } catch (error) {
      console.error('Resend OTP error:', error)
      alert('An error occurred while resending OTP. Please try again.')
      setResendDisabled(false)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={`
        w-full max-w-md transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      {/* Card */}
      <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center animate-pulse-glow">
              {step === 'success' ? (
                <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              )}
            </div>
            {/* Floating particles */}
            <div
              className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-primary/60 animate-float"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full bg-primary/40 animate-float"
              style={{ animationDelay: '0.5s' }}
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to Captcha<span className="text-primary">Ɱaster</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {step === 'credentials' && 'Sign in to continue to your dashboard'}
            {step === 'otp' && 'Enter the verification code sent to your email'}
            {step === 'success' && 'Welcome back! Redirecting...'}
          </p>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Step 1: Credentials */}
        {step === 'credentials' && (
          <form onSubmit={handleSubmitCredentials} className="space-y-5 relative z-10 animate-in fade-in duration-300">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>

              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div></div>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>{twoFaEnabled ? 'Sending OTP...' : 'Signing in...'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 relative z-10 animate-in fade-in duration-300">
            {/* OTP Input Fields */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Verification Code</Label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all font-semibold text-lg"
                    placeholder="•"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">A code has been sent to {email}</p>
            </div>

            {/* Timer and Resend */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expires in</span>
                <span className={`font-semibold ${timer < 60 ? 'text-destructive' : 'text-primary'}`}>
                  {formatTime(timer)}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={resendDisabled || isLoading}
                onClick={handleResendOtp}
                className="text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                Resend
              </Button>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Verify & Sign In</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>

            {/* Back Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep('credentials')
                setOtp(['', '', '', '', '', ''])
                setTimer(300)
              }}
              className="w-full h-12 border-border hover:bg-secondary/50 transition-all bg-transparent"
            >
              Back to Sign In
            </Button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="space-y-6 relative z-10 animate-in fade-in duration-300 py-8 text-center">
            <div className="inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse-glow">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Welcome Back!</h2>
              <p className="text-muted-foreground">
                {twoFaEnabled ? 'Your login was verified successfully.' : 'You are now signed in.'}
              </p>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
            <div className="w-full h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {/* Divider - Only show in credentials step */}
        {step === 'credentials' && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-sm text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="h-12 border-border hover:bg-secondary/50 hover:border-primary/30 transition-all bg-transparent"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                className="h-12 border-border hover:bg-secondary/50 hover:border-primary/30 transition-all bg-transparent"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </>
        )}

        {/* Sign Up Link - Only show in credentials step */}
        {step === 'credentials' && (
          <p className="text-center text-sm text-muted-foreground mt-6 relative z-10">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Create account
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
