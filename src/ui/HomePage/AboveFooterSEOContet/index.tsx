import clsx from 'clsx'
import React from 'react'
import style from './Style.module.scss'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { Locale } from '@/i18n/routing'

const AboveFooterSEOContet = ({ data,locale }: { data?: FooterContentDataModel, locale: Locale }) => {
    return (
        <div className={clsx("collapse",style.accordion)}>
            <input type="checkbox" id='expander-footer-content'/>
            <div dangerouslySetInnerHTML={{ __html: resolveLocalizedString(data?.shortContent, locale) ?? "" }} className='collapse-title'>
            </div>
            <div dangerouslySetInnerHTML={{ __html: resolveLocalizedString(data?.content, locale) ?? "" }} className='collapse-content'>
            </div>
            <label htmlFor='expander-footer-content' className='text-primary'></label>
        </div >
    )
}

export default AboveFooterSEOContet