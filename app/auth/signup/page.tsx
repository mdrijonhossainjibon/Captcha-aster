'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  User,
  Check,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/modules/rootReducer'
import * as authActions from '@/modules/auth/actions'

type SignupStep = 'credentials' | 'otp' | 'success'

const passwordRequirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
]

export default function SignupPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { loading: isLoading, registrationSuccess, verificationSuccess, requiresVerification } = useSelector((state: RootState) => state.auth)

  const [step, setStep] = useState<SignupStep>('credentials')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(300)
  const [resendDisabled, setResendDisabled] = useState(true)

  const avatarUrls = [
    "https://i.pravatar.cc/40?img=3",
    "https://i.pravatar.cc/40?img=7",
    "https://i.pravatar.cc/40?img=11",
    "https://i.pravatar.cc/40?img=16"
  ]

  useEffect(() => {
    setMounted(true)
    setIsVisible(true)
    dispatch(authActions.resetAuthState())
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [dispatch])

  // Handle Redux Success states
  useEffect(() => {
    if (registrationSuccess) {
      if (requiresVerification) {
        setStep('otp')
        setTimer(300)
        setResendDisabled(true)
      } else {
        setStep('success')
        setTimeout(() => router.push('/dashboard'), 2000)
      }
    }
  }, [registrationSuccess, requiresVerification, router])

  useEffect(() => {
    if (verificationSuccess) {
      setStep('success')
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }, [verificationSuccess, router])

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

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      notification.error({ message: 'Passwords do not match', description: 'Please ensure your passwords are identical.' })
      return
    }
    dispatch(authActions.registerRequest({ name, email, password }))
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus()
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) return
    dispatch(authActions.verifyEmailRequest({ email, otp: otpCode }))
  }

  const handleResendOtp = () => {
    setResendDisabled(true)
    setOtp(['', '', '', '', '', ''])
    setTimer(300)
    dispatch(authActions.resendVerificationRequest({ email }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const passwordStrength = passwordRequirements.filter((req) => req.test(password)).length
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  // ─── Reusable Form UI ───
  const renderFormContent = () => (
    <>
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8 relative z-10">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-2xl bg-background flex items-center justify-center animate-pulse-glow shadow-lg border border-border/50 overflow-hidden">
            {step === 'success' ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : (
              <Image src="/logo.png" alt="Captcha Master Logo" width={80} height={80} className="w-full h-full object-contain p-2" />
            )}
          </div>
          <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-primary/60 animate-float" style={{ animationDelay: '0.2s' }} />
          <div className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full bg-primary/40 animate-float" style={{ animationDelay: '0.5s' }} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Create your <span className="text-primary">Account</span></h1>
        <p className="text-muted-foreground text-sm mt-1">
          {step === 'credentials' && 'Start solving captchas in seconds'}
          {step === 'otp' && 'Enter the verification code sent to your email'}
          {step === 'success' && 'Account created successfully!'}
        </p>
      </div>

      {/* Step 1: Credentials */}
      {step === 'credentials' && (
        <form onSubmit={handleSubmitCredentials} className="space-y-4 relative z-10 animate-in fade-in duration-300">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-11 pr-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength >= level ? passwordStrength <= 1 ? 'bg-red-500' : passwordStrength <= 2 ? 'bg-orange-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-secondary'}`} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req) => (
                    <div key={req.label} className={`flex items-center gap-1 text-xs ${req.test(password) ? 'text-green-500' : 'text-muted-foreground'}`}>
                      <Check className={`w-3 h-3 ${req.test(password) ? 'opacity-100' : 'opacity-30'}`} /> {req.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`pl-11 pr-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all ${confirmPassword.length > 0 && !passwordsMatch ? 'border-red-500 focus:border-red-500' : ''}`} required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && <p className="text-xs text-red-500">Passwords do not match</p>}
            {passwordsMatch && <p className="text-xs text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Passwords match</p>}
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5" />
            <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-tight">
              I agree to the <Link href="#" className="text-primary hover:text-primary/80">Terms of Service</Link> and <Link href="#" className="text-primary hover:text-primary/80">Privacy Policy</Link>
            </Label>
          </div>

          <Button type="submit" disabled={isLoading || !agreeTerms || !passwordsMatch || passwordStrength < 4} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 group disabled:opacity-50">
            {isLoading ? (
              <div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /><span>Creating account...</span></div>
            ) : (
              <div className="flex items-center gap-2"><span>Create Account</span><ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></div>
            )}
          </Button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-4 text-sm text-muted-foreground">Or sign up with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            <Button type="button" variant="outline" disabled={isLoading} className="h-12 border-border hover:bg-secondary/50 hover:border-primary/30 transition-all bg-transparent disabled:opacity-50">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </Button>
            <Button type="button" variant="outline" className="h-12 border-border hover:bg-secondary/50 hover:border-primary/30 transition-all bg-transparent">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-5 relative z-10">
            Already have an account? <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link>
          </p>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-6 relative z-10 animate-in fade-in duration-300">
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Verification Code</Label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <Input key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} className="w-12 h-12 text-center bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all font-semibold text-lg" placeholder="•" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">A code has been sent to {email}</p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expires in</span>
              <span className={`font-semibold ${timer < 60 ? 'text-destructive' : 'text-primary'}`}>{formatTime(timer)}</span>
            </div>
            <Button type="button" variant="ghost" size="sm" disabled={resendDisabled || isLoading} onClick={handleResendOtp} className="text-primary hover:text-primary/80 disabled:text-muted-foreground">Resend</Button>
          </div>

          <Button type="submit" disabled={isLoading || otp.join('').length !== 6} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 group">
            {isLoading ? (
              <div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /><span>Verifying...</span></div>
            ) : (
              <div className="flex items-center gap-2"><span>Verify & Create Account</span><ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></div>
            )}
          </Button>

          <Button type="button" variant="outline" onClick={() => { setStep('credentials'); setOtp(['', '', '', '', '', '']); setTimer(300) }} className="w-full h-12 border-border hover:bg-secondary/50 transition-all bg-transparent">Back to Sign Up</Button>
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
            <h2 className="text-2xl font-bold text-foreground">Account Created!</h2>
            <p className="text-muted-foreground">Welcome {name}! Your account is ready to use.</p>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </div>
          <div className="w-full h-1 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      )}
    </>
  )

  // ─── Mobile Native App Layout ───
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        <div className="relative h-[35vh] bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
          <div className="absolute inset-0">
            <div className={`absolute top-10 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ animation: 'float 15s ease-in-out infinite' }} />
            <div className={`absolute -bottom-10 -left-20 w-32 h-32 bg-primary/15 rounded-full blur-2xl transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ animation: 'float 20s ease-in-out infinite reverse' }} />
          </div>
          <div className={`relative z-10 flex flex-col items-center justify-center h-full px-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="w-20 h-20 rounded-3xl bg-primary/10 backdrop-blur-xl border border-primary/20 flex items-center justify-center mb-4 shadow-lg overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={80} height={80} className="w-full h-full object-contain p-3" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Create Account</h1>
            <p className="text-sm text-muted-foreground text-center">Start solving captchas in seconds</p>
            
            {/* Mobile Demo Avatars */}
            <div className="flex -space-x-2 mt-4">
              {avatarUrls.map((url, i) => (
                <img key={i} src={url} alt="User" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
              ))}
            </div>
          </div>
        </div>

        <div className={`flex-1 bg-card rounded-t-[32px] -mt-8 relative z-20 shadow-2xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-border rounded-full" /></div>
          <div className="overflow-y-auto h-full pb-10 px-6 pt-2">
            {renderFormContent()}
          </div>
        </div>
      </div>
    )
  }

  // ─── Desktop Split Screen Layout ───
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Decorative / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-pulse delay-1000" />

        <div className="absolute rounded-full bg-primary/20 animate-float" style={{ width: 6, height: 6, top: '15%', left: '20%', animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute rounded-full bg-primary/20 animate-float" style={{ width: 4, height: 4, top: '40%', left: '70%', animationDelay: '1s', animationDuration: '8s' }} />
        <div className="absolute rounded-full bg-primary/20 animate-float" style={{ width: 8, height: 8, top: '70%', left: '30%', animationDelay: '2s', animationDuration: '7s' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-xl font-bold text-foreground">Captcha<span className="text-primary">Ɱaster</span></span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div className={`transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary tracking-wide uppercase">Start Your Journey</span>
              </div>

              <h2 className="text-4xl font-bold text-foreground leading-tight mb-4">
                Join the <br /> <span className="text-primary">CaptchaⱮaster</span> team
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-10">
                Create your account today and unlock lightning-fast, AI-powered captcha solving technology trusted by professionals worldwide.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:translate-x-1">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
                  <div><h4 className="font-semibold text-foreground text-sm">Secure & Private</h4><p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">End-to-end encryption keeps your data safe at all times.</p></div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:translate-x-1">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center"><Zap className="w-5 h-5 text-primary" /></div>
                  <div><h4 className="font-semibold text-foreground text-sm">Lightning Fast</h4><p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">Average solve time under 2 seconds with 99.9% accuracy.</p></div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:translate-x-1">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center"><Trophy className="w-5 h-5 text-primary" /></div>
                  <div><h4 className="font-semibold text-foreground text-sm">Proven Results</h4><p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">Trusted by 50,000+ users solving 10M+ captchas daily.</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-6 transition-all duration-700 delay-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex -space-x-2">
              {avatarUrls.map((url, i) => (
                <img key={i} src={url} alt="User" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">50,000+ users</p>
              <p className="text-xs text-muted-foreground">already joined us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className={`w-full max-w-md transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Mobile/Tablet-only logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-xl font-bold text-foreground">Captcha<span className="text-primary">Ɱaster</span></span>
          </div>

          <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl overflow-hidden">
            <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />
            {renderFormContent()}
          </div>
        </div>
      </div>
    </div>
  )
}