"use client"
import React from 'react'

type Props = {
    title: string,
    subTitle?: string,
    children?: React.ReactNode,
}

const SectionHeader = ({ title, children, subTitle }: Props) => {

    return (
        <div className='flex  w-full flex-wrap flex-col md:items-center md:justify-between md:flex-row  space-y-2'>
            <div className='flex flex-col items-start'>
                <h3 className='text-xl font-bold text-gray-700 capitalize'>
                    {title}
                </h3>
            </div>
            <div className='flex items-center md:justify-end gap-3 flex-1'>
                {children}
            </div>
            {/* {children} */}
        </div>
    )
}


export default SectionHeader