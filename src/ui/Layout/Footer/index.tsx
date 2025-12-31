// @ts-nocheck
import React from 'react'
import Logo from '../Logo'
import Subscribe from './Subscribe'
import { FaCcAmex, FaCcMastercard, FaCcVisa, FaFacebook, FaGooglePay, FaInstagram, FaLinkedin, FaPaypal, FaPinterest, FaStripe, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import Link from 'next/link'
import getSiteData from '@/backend/serverActions/getSiteData'

const Footer = async () => {
  const siteData = await getSiteData()
  return <footer className='text-primary-content bottom-0'>
    <div className='bg-primary ~py-10/0'>
      <div className='mx-auto flex ~p-0/20 max-lg:flex-col'>
        <div className='lg:basis-1/3 space-y-10 ~px-5/10'>
          <Logo className='text-left text-white' taglineClass='text-xs' />
          <div className='space-y-5'>
            <p className='font-bold text-lg ~leading-6/7'>Welcome to Chouhan Rugs - Your Source for the Finest Handmade Jute Rugs & Other Natural Jute Products</p>
            <p className='font-light text-xs'>
              <b>India:</b> Kanji nagar, Plot no 43, Agra Rd, Kanzi Nagar, Jaipur, Rajasthan, 302031<br />
              <b>US Office:</b> 1001 S MAIN ST STE 500 KALISPELL, MT 59901-5635-016</p>
          </div>
        </div>
        <div className='lg:basis-1/3 ~p-10/0'>
          <div className='grid grid-cols-2 ~text-xs/base'>
            <ul id='pages' className='list-none space-y-2'>
              <li className=''>
                <Link href='/'>
                  <span>Home</span>
                </Link>
              </li>
              <li className=''>
                <Link href='/about-us'>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  About Us
                </Link>
              </li>
              <li className=''>
                <Link href='/contact-us'>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  Contact Us
                </Link>
              </li>
              {/* <li className=''>
                <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                FAQ
              </li> */}
              <li className=''>
                <Link href='/blog'>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  Blogs
                </Link>
              </li>
              <li className=''>
                <Link href='/policies'>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  Policies
                </Link>
              </li>
              <li className=''>
                <Link href='/terms'>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  T&C
                </Link>
              </li>
            </ul>
            <div>
              <ul id='categories' className='list-none space-y-2 h-fit'>
                <li className=''>
                  <h3>
                    <Link href='/cotton-rugs'>
                      Cotton Rugs
                    </Link>
                  </h3>
                </li>
                <li className=''>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  <h3>
                    <Link href='/pillow-and-cushion-covers'>
                      Cushion & Pillow Covers
                    </Link>
                  </h3>
                </li>
                <li className=''>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  <h3>
                    <Link href='/jute-hand-bags'>
                      Jute Hand Bags
                    </Link>
                  </h3>
                </li>
                <li className=''>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  <h3>
                    <Link href='/jute-rugs'>
                      Jute Rugs
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
          <div className='~text-sm/xl'>Get Access to Updates in you Mailbox.</div>
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
            <span className='~text-xs/base'>Follow Us</span>
            {
              siteData.profiles.map((profile) => <Link
                key={profile}
                href={profile}
              >
                {
                  ["facebook.com", "www.facebook.com", "fb.me"].includes((new URL(profile)).hostname) && <>
                    <FaFacebook className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">Facebook page</span>
                  </>
                }
                {
                  ["instagram.com", "www.instagram.com"].includes((new URL(profile)).hostname) && <>
                    <FaInstagram className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">Instagram page</span>
                  </>
                }
                {
                  ["twitter.com", "www.twitter.com",].includes((new URL(profile)).hostname) && <>
                    <FaXTwitter className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">Twitter page</span>
                  </>
                }
                {
                  ["pinterest.com", "www.pinterest.com", "in.pinterest.com"].includes((new URL(profile)).hostname) && <>
                    <FaPinterest className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">Pinterest page</span>
                  </>
                }
                {
                  ["youtube.com", "www.youtube.com"].includes((new URL(profile)).hostname) && <>
                    <FaYoutube className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">Youtube page</span>
                  </>
                }
                {
                  ["www.linkedin.com", "linkedin.com"].includes((new URL(profile)).hostname) && <>
                    <FaLinkedin className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
                    <span className="sr-only">Linkedin page</span>
                  </>
                }
              </Link>)
            }
          </div>
        </div>
      </div>
    </div>
    <div className='bg-base-200 flex items-center justify-center ~text-xs/sm py-1 text-primary'>
      &copy;&nbsp;2024&nbsp;<Link className='inline-block underline' href='/'>Chouhan Rugs</Link>. All Rights Reserved
    </div>
  </footer>
}

export default Footer