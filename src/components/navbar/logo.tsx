import Link from 'next/link'
import React from 'react'

type Props = {}

const Logo = (props: Props) => {
    return (
        <div className='flex items-center'>
            <Link href={'/'} className='text-orange-600 text-2xl font-medium'>
                <span className='text-black font-bold'>Mam</span>Shop
            </Link>
        </div>
    )
}

export default Logo