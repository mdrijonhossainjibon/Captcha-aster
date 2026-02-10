"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, KeyRound, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { notification } from "antd"

type ResetStep = 'loading' | 'form' | 'success' | 'error'

export function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [step, setStep] = useState<ResetStep>('loading')
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [email, setEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!token) {
            setStep('error')
            setErrorMessage('Invalid reset link')
            return
        }

        // Verify token
        const verifyToken = async () => {
            try {
                const response = await fetch(`/api/auth/reset-password/verify?token=${token}`)
                const data = await response.json()

                if (!response.ok) {
                    setStep('error')
                    setErrorMessage(data.error || 'Invalid or expired reset link')
                    return
                }

                setEmail(data.email)
                setStep('form')
            } catch (error) {
                console.error('Token verification error:', error)
                setStep('error')
                setErrorMessage('Failed to verify reset link')
            }
        }

        verifyToken()
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password.length < 6) {
            notification.error({
                message: 'Password Too Short',
                description: 'Password must be at least 6 characters.',
            })
            return
        }

        if (password !== confirmPassword) {
            notification.error({
                message: 'Passwords do not match',
                description: 'Please ensure your passwords are identical.',
            })
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                notification.error({
                    message: 'Reset Failed',
                    description: data.error || 'Failed to reset password.',
                })
                setIsLoading(false)
                return
            }

            notification.success({
                message: 'Password Reset',
                description: 'Your password has been successfully reset! Redirecting...',
            })

            console.log('✅ Password reset successful')
            setStep('success')

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (error) {
            console.error('Reset password error:', error)
            notification.error({
                message: 'Error',
                description: 'An error occurred. Please try again.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className={`
        w-full max-w-md transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
        >
            {/* Card */}
            <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl overflow-hidden">
                {/* Shimmer overlay */}
                <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />

                {/* Loading State */}
                {step === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-12 relative z-10">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="text-muted-foreground">Verifying reset link...</p>
                    </div>
                )}

                {/* Error State */}
                {step === 'error' && (
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="relative mb-4">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mb-2">Invalid Link</h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            {errorMessage || 'This password reset link is invalid or has expired.'}
                        </p>

                        <Link href="/forgot-password">
                            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl">
                                Request New Link
                            </Button>
                        </Link>

                        <Link href="/login" className="mt-4 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                            Back to login
                        </Link>
                    </div>
                )}

                {/* Form State */}
                {step === 'form' && (
                    <>
                        {/* Logo Section */}
                        <div className="flex flex-col items-center mb-8 relative z-10">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 rounded-2xl bg-background flex items-center justify-center animate-pulse-glow shadow-lg border border-border/50 overflow-hidden">
                                    <Image
                                        src="/logo.png"
                                        alt="Captcha Master Logo"
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-contain p-2"
                                    />
                                </div>
                                {/* Floating particles */}
                                <div
                                    className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-primary/60 animate-float"
                                    style={{ animationDelay: "0.2s" }}
                                />
                                <div
                                    className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full bg-primary/40 animate-float"
                                    style={{ animationDelay: "0.5s" }}
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
                            <p className="text-muted-foreground text-sm mt-1 text-center">
                                Enter your new password for
                                <br />
                                <span className="text-foreground font-medium">{email}</span>
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-foreground font-medium">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-11 pr-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all"
                                        required
                                        minLength={6}
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

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-11 pr-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password requirements */}
                            <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                                <p className="text-xs text-muted-foreground">
                                    Password must be at least 6 characters long
                                </p>
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
                                        <span>Resetting...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Reset Password</span>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </>
                )}

                {/* Success State */}
                {step === 'success' && (
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="relative mb-4">
                            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            {/* Success animation rings */}
                            <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping" />
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mb-2">Password Reset!</h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            Your password has been successfully reset.
                            <br />
                            Redirecting to login...
                        </p>

                        <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '100%' }} />
                        </div>

                        <Link href="/login" className="mt-6">
                            <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl">
                                Go to Login
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Help link */}
                {step === 'form' && (
                    <p className="text-center text-sm text-muted-foreground mt-6 relative z-10">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}
