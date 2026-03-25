// @ts-nocheck
'use client'
import { authClient } from '@/lib/auth-client'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { useCallback, useState, KeyboardEvent } from 'react'
import { FaSignInAlt } from 'react-icons/fa'

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
    const [error, setError] = useState<string>('');

    const handleSignInUsingEmail = useCallback(async () => {
        if (isLoading) return; // Prevent duplicate calls
        if (!email || !email.includes('@')) {
            setError(t('invalidEmail'));
            return;
        }

        setIsLoading(true);
        setError('');

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
            setError('');
        } catch (err) {
            setError(t('errorSendingOTP'));
            console.error('Error sending OTP:', err);
        } finally {
            setIsLoading(false);
        }
    }, [email, isLoading]);

    const onReady = useCallback(async () => {
        if (isLoading) return; // Prevent duplicate calls
        if (!code || code.length !== 6) {
            setError(t('invalidOTP'));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { data, error: signInError } = await authClient.signIn.emailOtp({
                email,
                otp: code,
            });

            if (signInError) {
                setError(t('wrongOTPError'));
                setIsLoading(false);
            } else if (data) {
                window.location.href = window.location.protocol + "//" + window.location.host + (searchParams.get('cb') ?? '/');
            } else {
                setError(t('signInFailed'));
                setIsLoading(false);
            }
        } catch (err) {
            setError(t('errorSignIn'));
            console.error('Error during sign-in:', err);
            setIsLoading(false);
        }
    }, [code, email, searchParams, isLoading]);

    const onKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                onReady();
            }
        },
        [onReady]
    );

    return (
        <div className="sm:mt-10 mt-5 flex flex-col items-center">
            <div className="w-full flex-1 mt-8">
                {
                    !isOTPForm && <>
                        <div className="flex flex-col items-center">
                            <button className="w-full max-w-xs sm:max-w-sm font-bold shadow-sm rounded-lg py-3 bg-secondary bg-opacity-40 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow-2xl hover:scale-105 focus:shadow-sm focus:shadow-outline" onClick={e => { authClient.signIn.social({ provider: "google", callbackURL: window.location.protocol + "//" + window.location.host + (searchParams.get('cb') ?? '/') }) }}>
                                <div className="bg-white p-2 rounded-full">
                                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                                        <path
                                            d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                                            fill="#4285f4"
                                        />
                                        <path
                                            d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                                            fill="#34a853"
                                        />
                                        <path
                                            d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                                            fill="#fbbc04"
                                        />
                                        <path
                                            d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                                            fill="#ea4335"
                                        />
                                    </svg>
                                </div>
                                <span className="ml-4">{t('signInWithGoogle')}</span>
                            </button>
                        </div>
                        <div className="sm:my-12 my-7 border-b text-center">
                            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                {t('orSignInWithEmail')}
                            </div>
                        </div>
                        <div className="mx-auto max-w-xs sm:max-w-sm ">
                            <input
                                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                type="email"
                                defaultValue={email}
                                onChange={e => setEmail(e.currentTarget.value)}
                                placeholder={t('emailPlaceholder')}
                                disabled={isLoading}
                            />
                            {
                                searchParams.get('error') && <p className='mb-6 text-red-600 text-opacity-70 font-semibold'>{t('wrongOTP')}</p>
                            }
                            {
                                error && <p className='mb-6 text-red-600 text-opacity-70 font-semibold'>{error}</p>
                            }
                            <p className="mt-6 max-sm:mb-6 text-xs text-center">
                                <b className='text-red-600'>{t('noteLabel')}</b> {t('otpNote', { inbox: 'inbox', spam: 'spam/junk' })}
                            </p>
                            {/* <input
                                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                type="password"
                                defaultValue={password}
                                onChange={e => setPassword(e.currentTarget.value)}
                                placeholder="Password"
                            /> */}
                            <button
                                className="mt-5 tracking-wide font-semibold bg-secondary text-primary hover:text-gray-100 w-full py-4 rounded-lg hover:bg-primary transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={_ => handleSignInUsingEmail()}
                                disabled={isLoading}
                            >
                                <FaSignInAlt className="w-6 h-6 -ml-2" />
                                <span className="ml-3">{isLoading ? t('sendingOTP') : t('signIn')}</span>
                            </button>
                            <p className="mt-6 max-sm:mb-6 text-xs text-gray-600 text-center">
                                {t('agreeTerms')} {siteTitle}&nbsp;
                                <a href="#" className="border-b border-gray-500 border-dotted">
                                    {t('termsOfService')}&nbsp;
                                </a>
                                {t('andIts')}&nbsp;
                                <a href="#" className="border-b border-gray-500 border-dotted">
                                    {t('privacyPolicy')}
                                </a>
                            </p>
                        </div>
                    </>
                }
                {
                    isOTPForm && <div className='mx-auto max-w-xs sm:max-w-sm '>
                        {
                            error && <p className='mb-6 text-red-600 text-opacity-70 font-semibold text-center'>{error}</p>
                        }
                        <p className='mb-6 text-primary text-opacity-70 text-center'>{t('otpSent', { email })}</p>
                        <input
                            className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white'
                            maxLength={6}
                            type='text'
                            placeholder={t('otpPlaceholder')}
                            onChange={e => setCode(e.currentTarget.value)}
                            onKeyDown={onKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            className="mt-5 tracking-wide font-semibold bg-secondary text-primary hover:text-gray-100 w-full py-4 rounded-lg hover:bg-primary transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={_ => onReady()}
                            disabled={isLoading}
                        >
                            <FaSignInAlt className="w-6 h-6 -ml-2" />
                            <span className="ml-3">{isLoading ? t('verifying') : t('verify')}</span>
                        </button>
                        <button
                            className="mt-3 text-sm text-primary underline hover:text-secondary transition-colors"
                            onClick={() => {
                                setIsOTPForm(false);
                                setCode('');
                                setError('');
                            }}
                            disabled={isLoading}
                        >
                            {t('backToEmail')}
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default SigninForm