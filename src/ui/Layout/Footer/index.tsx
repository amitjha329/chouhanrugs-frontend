import React from 'react'
import Logo from '../Logo'
import Subscribe from './Subscribe'
import { FaCcAmex, FaCcMastercard, FaCcVisa, FaFacebook, FaGooglePay, FaInstagram, FaLinkedin, FaPaypal, FaPinterest, FaStripe, FaTwitter, FaX, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import Link from 'next/link'

const Footer = () => {
  return <footer className='text-primary-content bottom-0'>
    <div className='bg-primary ~py-10/0'>
      <div className='mx-auto flex ~p-0/20 max-lg:flex-col'>
        <div className='lg:basis-1/3 space-y-10 ~px-5/10'>
          <Logo className='text-left text-white' taglineClass='text-xs' />
          <div className='space-y-5'>
            <p className='font-bold text-lg ~leading-6/7'>Welcome to Chouhan Rugs - Your Source for the Finest Jute Rugs  Handmade Jute Products</p>
            <p className='font-light text-xs'>We specializes in crafting eco-friendly jute products - rugs, cotton rugs, hemp rugs, cushion covers, pillow covers, handbags, and wall macrame. Elevate your space sustainably with us.</p>
          </div>
        </div>
        <div className='lg:basis-1/3 ~p-10/0'>
          <div className='grid grid-cols-2 ~text-xs/base'>
            <ul id='pages' className='list-none space-y-2'>
              <li className=''>
                <span>Home</span>
              </li>
              <li className=''>
                <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                About Us
              </li>
              <li className=''>
                <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                Contact Us
              </li>
              <li className=''>
                <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                FAQ
              </li>
              <li className=''>
                <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                Blogs
              </li>
              <li className=''>
                <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                Policies
              </li>
              <li className=''>
                <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                T&C
              </li>
            </ul>
            <div>
              <ul id='categories' className='list-none space-y-2 h-fit'>
                <li className=''>
                  <Link href='/cotton-rugs'>
                    Cotton Rugs
                  </Link>
                </li>
                <li className=''>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  <Link href='/pillow-and-cushion-covers'>
                    Cushion & Pillow Covers
                  </Link>
                </li>
                <li className=''>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  <Link href='/jute-hand-bags'>
                    Jute Hand Bags
                  </Link>
                </li>
                <li className=''>
                  <hr className='bg-base-200 opacity-30 h-[0.5px] w-1/2 mb-2' />
                  <Link href='/jute-rugs'>
                    Jute Rugs
                  </Link>
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
            <FaFacebook className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
            <FaInstagram className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
            <FaLinkedin className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
            <FaPinterest className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
            <FaXTwitter className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
            <FaYoutube className='~sm/md:~w-7/10 ~sm/md:~h-7/10' />
          </div>
        </div>
      </div>
    </div>
    <div className='bg-base-200 flex items-center justify-center ~text-xs/sm py-1 text-primary'>
      &copy;&nbsp;2024&nbsp;<a className='inline-block underline' href='/'>Chouhan Rugs</a>. All Rights Reserved
    </div>
  </footer>
}

export default Footer