import clsx from 'clsx'
import React from 'react'
import style from './Style.module.scss'

const AboveFooterSEOContet = ({ data }: { data?: FooterContentDataModel }) => {
    return (
        <div className={clsx("text-sm collapse",style.accordion)}>
            <input type="checkbox" id='expander-footer-content'/>
            <div dangerouslySetInnerHTML={{ __html: data?.shortContent ?? "" }} className='collapse-title'>
            </div>
            <div dangerouslySetInnerHTML={{ __html: data?.content ?? "" }} className='collapse-content'>
            </div>
            <label htmlFor='expander-footer-content' className='text-primary'></label>
        </div >
    )
}

export default AboveFooterSEOContet