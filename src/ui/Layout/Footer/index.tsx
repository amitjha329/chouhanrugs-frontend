// @ts-nocheck
import React from 'react'
import Logo from '../Logo'
import Subscribe from './Subscribe'
import { FaCcAmex, FaCcMastercard, FaCcVisa, FaFacebook, FaGooglePay, FaInstagram, FaLinkedin, FaPaypal, FaPinterest, FaStripe, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import Link from 'next/link'
import getSiteData from '@/backend/serverActions/getSiteData'
import { getTranslations } from 'next-intl/server'

const Footer = async () => {
  const siteData = await getSiteData()
  const t = await getTranslations('footer')
  const tNav = await getTranslations('nav')
  return <footer className='text-primary-content bottom-0'>
    <div className='bg-primary ~py-10/0'>
      <div className='mx-auto flex ~p-0/20 max-lg:flex-col'>
        <div className='lg:basis-1/3 space-y-10 ~px-5/10'>
          <Logo className='text-left text-white' taglineClass='text-xs' />
          <div className='space-y-5'>
            <p className='font-bold text-lg ~leading-6/7'>{t('welcomeMessage')}</p>
            <p className='font-light text-xs'>
              <b>{t('indiaLabel')}</b> {t('indiaAddress')}<br />
              <b>{t('usOfficeLabel')}</b> {t('usAddress')}</p>
          </div>
        </div>
        <div className='lg:basis-1/3 ~p-10/0'>
          <div className='grid grid-cols-2 ~text-xs/base'>
            <ul id='pages' className='list-none space-y-2'>
              <li className=''>
                <Link href='/'>
                  <span>{tNav('home')}</span>
                </Link>
              </li>
              <li className=''>
                <Link href='/about-us'>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  {tNav('aboutUs')}
                </Link>
              </li>
              <li className=''>
                <Link href='/contact-us'>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  {tNav('contact')}
                </Link>
              </li>
              {/* <li className=''>
                <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                FAQ
              </li> */}
              <li className=''>
                <Link href='/blog'>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  {tNav('blog')}
                </Link>
              </li>
              <li className=''>
                <Link href='/policies'>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  {tNav('policies')}
                </Link>
              </li>
              <li className=''>
                <Link href='/terms'>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  {tNav('termsShort')}
                </Link>
              </li>
            </ul>
            <div>
              <ul id='categories' className='list-none space-y-2 h-fit'>
                <li className=''>
                  <h3>
                    <Link href='/cotton-rugs'>
                      {t('cottonRugs')}
                    </Link>
                  </h3>
                </li>
                <li className=''>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  <h3>
                    <Link href='/pillow-and-cushion-covers'>
                      {t('cushionPillowCovers')}
                    </Link>
                  </h3>
                </li>
                <li className=''>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  <h3>
                    <Link href='/jute-hand-bags'>
                      {t('juteHandBags')}
                    </Link>
                  </h3>
                </li>
                <li className=''>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  <h3>
                    <Link href='/jute-rugs'>
                      {t('juteRugs')}
                    </Link>
                  </h3>
                </li>
              </ul>
              <div className='flex w-full items-center gap-2 justify-end max-lg:grid max-lg:grid-cols-3 lg:hidden py-10'>
                <div className='border-2 border-primary-content rounded px-2'><FaGooglePay className='w-7 h-7' /></div>
                <div className='border-2 border-primary-content rounded px-2'><FaPaypal className='w-7 h-7' /></div>
                <div className='border-2 border-primary-content rounded px-2'><FaCcAmex className='w-7 h-7' /></div>
                <div className='border-2 border-primary-content rounded px-2'><FaStripe className='w-7 h-7' /></div>
                <div className='border-2 border-primary-content rounded px-2'><FaCcVisa className='w-7 h-7' /></div>
                <div className='border-2 border-primary-content rounded px-2'><FaCcMastercard className='w-7 h-7' /></div>
              </div>
            </div>
          </div>
        </div>
        <div className='basis-1/3 ~space-y-3/10 ~p-5/0'>
          <div className='~text-sm/xl'>{t('subscribeHeading')}</div>
          <Subscribe />

          <div className='flex w-full items-center gap-2 justify-end max-lg:hidden'>
            <div className='border-2 border-primary-content rounded px-2'><FaGooglePay className='w-9 h-9' /></div>
            <div className='border-2 border-primary-content rounded px-2'><FaPaypal className='w-9 h-9' /></div>
            <div className='border-2 border-primary-content rounded px-2'><FaCcAmex className='w-9 h-9' /></div>
            <div className='border-2 border-primary-content rounded px-2'><FaStripe className='w-9 h-9' /></div>
            <div className='border-2 border-primary-content rounded px-2'><FaCcVisa className='w-9 h-9' /></div>
            <div className='border-2 border-primary-content rounded px-2'><FaCcMastercard className='w-9 h-9' /></div>
          </div>

          <div className='flex items-center max-lg:justify-center justify-end gap-5 ~pt-7/0'>
            <span className='~text-xs/base'>{t('followUs')}</span>
            {
              siteData.profiles.map((profile) => <Link
                key={profile}
                href={profile}
              >
                {
                  ["facebook.com", "www.facebook.com", "fb.me"].includes((new URL(profile)).hostname) && <>
                    <FaFacebook className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">{t('facebookPage')}</span>
                  </>
                }
                {
                  ["instagram.com", "www.instagram.com"].includes((new URL(profile)).hostname) && <>
                    <FaInstagram className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">{t('instagramPage')}</span>
                  </>
                }
                {
                  ["twitter.com", "www.twitter.com",].includes((new URL(profile)).hostname) && <>
                    <FaXTwitter className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">{t('twitterPage')}</span>
                  </>
                }
                {
                  ["pinterest.com", "www.pinterest.com", "in.pinterest.com"].includes((new URL(profile)).hostname) && <>
                    <FaPinterest className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">{t('pinterestPage')}</span>
                  </>
                }
                {
                  ["youtube.com", "www.youtube.com"].includes((new URL(profile)).hostname) && <>
                    <FaYoutube className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">{t('youtubePage')}</span>
                  </>
                }
                {
                  ["www.linkedin.com", "linkedin.com"].includes((new URL(profile)).hostname) && <>
                    <FaLinkedin className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">{t('linkedinPage')}</span>
                  </>
                }
              </Link>)
            }
          </div>
        </div>
      </div>
    </div>
    <div className='bg-base-200 flex items-center justify-center ~text-xs/sm py-1 text-primary'>
      &copy;&nbsp;{new Date().getFullYear()}&nbsp;<Link className='inline-block underline' href='/'>{t('copyrightBrand')}</Link>. {t('allRightsReserved')}
    </div>
  </footer>
}

export default Footer