// @ts-nocheck
'use client'
import { authClient } from '@/lib/auth-client'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { KeyboardEvent, useCallback, useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiBox, FiCheckCircle, FiMail, FiShield } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { HiOutlineSparkles } from 'react-icons/hi2'

type propTypes = {
    siteTitle: string,
}

const SigninForm = ({ siteTitle }: propTypes) => {
    const searchParams = useSearchParams()
    const t = useTranslations('auth')
    const [email, setEmail] = React.useState("")
    const [isOTPForm, setIsOTPForm] = useState<boolean>(false)
    const [code, setCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isResending, setIsResending] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [notice, setNotice] = useState<string>('');

    const callbackURL = () => window.location.protocol + "//" + window.location.host + (searchParams.get('cb') ?? '/')

    const sendEmailOtp = useCallback(async ({ resend = false }: { resend?: boolean } = {}) => {
        if (isLoading || isResending) return;
        if (!email || !email.includes('@')) {
            setError(t('invalidEmail'));
            return;
        }

        resend ? setIsResending(true) : setIsLoading(true);
        setError('');
        setNotice('');

        try {
            const { error: otpError } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: 'sign-in',
            });

            if (otpError) {
                setError(t('failedOTP'));
                setIsLoading(false);
                return;
            }

            setIsOTPForm(true);
            setCode('');
            setError('');
            setNotice(resend ? t('otpResent') : '');
        } catch (err) {
            setError(t('errorSendingOTP'));
            console.error('Error sending OTP:', err);
        } finally {
            resend ? setIsResending(false) : setIsLoading(false);
        }
    }, [email, isLoading, isResending, t]);

    const handleSignInUsingEmail = useCallback(async () => {
        await sendEmailOtp();
    }, [sendEmailOtp]);

    const handleResendOtp = useCallback(async () => {
        await sendEmailOtp({ resend: true });
    }, [sendEmailOtp]);

    const onReady = useCallback(async () => {
        if (isLoading || isResending) return;
        if (!code || code.length !== 6) {
            setError(t('invalidOTP'));
            return;
        }

        setIsLoading(true);
        setError('');
        setNotice('');

        try {
            const { data, error: signInError } = await authClient.signIn.emailOtp({
                email,
                otp: code,
            });

            if (signInError) {
                setError(t('wrongOTPError'));
                setIsLoading(false);
            } else if (data) {
                window.location.href = callbackURL();
            } else {
                setError(t('signInFailed'));
                setIsLoading(false);
            }
        } catch (err) {
            setError(t('errorSignIn'));
            console.error('Error during sign-in:', err);
            setIsLoading(false);
        }
    }, [code, email, isLoading, isResending, searchParams, t]);

    const onKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                onReady();
            }
        },
        [onReady]
    );

    return (
        <div className="w-full">
            <div className="mb-6 flex flex-wrap items-center gap-2 max-sm:hidden">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <HiOutlineSparkles className="h-4 w-4" aria-hidden="true" />
                    Handloom access
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold text-secondary-content">
                    <FiShield className="h-4 w-4" aria-hidden="true" />
                    Secure OTP
                </span>
            </div>

            <div className="mb-7">
                <h2 className="text-2xl font-semibold leading-tight text-base-content sm:text-3xl">
                    {isOTPForm ? 'Verify your email' : 'Sign in or create your account'}
                </h2>
                <p className="mt-3 text-sm leading-6 text-base-content/65">
                    {isOTPForm
                        ? t('otpSent', { email })
                        : `Continue to ${siteTitle} with Google or a secure email OTP. No password needed.`}
                </p>
            </div>

            {!isOTPForm && (
                <>
                    <button
                        className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-sm font-semibold text-base-content shadow-sm transition hover:border-primary/30 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => { authClient.signIn.social({ provider: "google", callbackURL: callbackURL() }) }}
                        disabled={isLoading}
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-base-100 shadow-sm">
                            <FcGoogle className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span>{t('signInWithGoogle')}</span>
                    </button>

                    <div className="my-6 flex items-center gap-4">
                        <span className="h-px flex-1 bg-base-300" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-base-content/45">OR</span>
                        <span className="h-px flex-1 bg-base-300" />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-base-content" htmlFor="signin-email">
                            Email address
                        </label>
                        <div className="relative">
                            <FiMail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/45" aria-hidden="true" />
                            <input
                                id="signin-email"
                                className="h-14 w-full rounded-2xl border border-base-300 bg-base-100 pl-12 pr-4 text-base font-medium text-base-content shadow-sm placeholder:text-base-content/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.currentTarget.value)}
                                placeholder={t('emailPlaceholder')}
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {searchParams.get('error') && <p className="mt-3 text-sm font-semibold text-error/80">{t('wrongOTP')}</p>}
                    {error && <p className="mt-3 text-sm font-semibold text-error/80">{error}</p>}

                    <button
                        className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-primary px-5 text-base font-semibold text-primary-content shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleSignInUsingEmail()}
                        disabled={isLoading}
                    >
                        <span>{isLoading ? t('sendingOTP') : t('signIn')}</span>
                        <FiArrowRight className="ml-3 h-5 w-5" aria-hidden="true" />
                    </button>
                </>
            )}

            {isOTPForm && (
                <div>
                    {error && <p className="mb-4 text-sm font-semibold text-error/80">{error}</p>}
                    {notice && <p className="mb-4 text-sm font-semibold text-success/80">{notice}</p>}
                    <label className="block text-sm font-semibold text-base-content" htmlFor="signin-otp">
                        Verification code
                    </label>
                    <input
                        id="signin-otp"
                        className="mt-3 h-14 w-full rounded-2xl border border-base-300 bg-base-100 px-4 text-center text-xl font-semibold tracking-[0.35em] text-base-content shadow-sm placeholder:text-base-content/35 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
                        maxLength={6}
                        type="text"
                        inputMode="numeric"
                        placeholder={t('otpPlaceholder')}
                        onChange={e => setCode(e.currentTarget.value)}
                        onKeyDown={onKeyPress}
                        disabled={isLoading || isResending}
                    />
                    <button
                        className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-primary px-5 text-base font-semibold text-primary-content shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => onReady()}
                        disabled={isLoading || isResending}
                    >
                        <span>{isLoading ? t('verifying') : t('verify')}</span>
                        <FiArrowRight className="ml-3 h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-base-content/60">
                        <span>{t('didNotReceiveOTP')}</span>
                        <button
                            type="button"
                            className="font-semibold text-primary transition hover:text-secondary disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={handleResendOtp}
                            disabled={isLoading || isResending}
                        >
                            {isResending ? t('resendingOTP') : t('resendOTP')}
                        </button>
                    </div>
                    <button
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-secondary"
                        onClick={() => {
                            setIsOTPForm(false);
                            setCode('');
                            setError('');
                            setNotice('');
                        }}
                        disabled={isLoading || isResending}
                    >
                        <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
                        {t('backToEmail')}
                    </button>
                </div>
            )}

            <div className="mt-6 rounded-2xl border border-base-300 bg-base-200/70 p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="min-w-0">
                        <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-content">
                            <HiOutlineSparkles className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <p className="mt-2 text-[11px] font-semibold leading-4 text-base-content">Premium craft</p>
                    </div>
                    <div className="min-w-0">
                        <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-content">
                            <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <p className="mt-2 text-[11px] font-semibold leading-4 text-base-content">Fast checkout</p>
                    </div>
                    <div className="min-w-0">
                        <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-content">
                            <FiBox className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <p className="mt-2 text-[11px] font-semibold leading-4 text-base-content">Order updates</p>
                    </div>
                </div>
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-base-content/55">
                {t('agreeTerms')} {siteTitle}&nbsp;
                <a href="#" className="font-semibold text-primary underline-offset-4 hover:underline">
                    {t('termsOfService')}
                </a>
                &nbsp;{t('andIts')}&nbsp;
                <a href="#" className="font-semibold text-primary underline-offset-4 hover:underline">
                    {t('privacyPolicy')}
                </a>
            </p>
        </div>
    )
}

export default SigninForm
