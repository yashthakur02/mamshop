import { Copyright, HomeIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

type Props = {}

const Footer = (props: Props) => {
    return (
        <footer className='bg-violet-300/20 p-5 backdrop-blur-md'>
            <div className='flex flex-col justify-center items-center space-y-3'>
                <Button asChild variant={'destructive'} size={"icon"} className='p-1'>
                    <Link href={'/admin/all-games'}>
                        <HomeIcon className='h-5 w-5' />
                    </Link>
                </Button>
                <p className='text-sm text-gray-600 text-center'>Copyright ©2024, Mamshop.com. ALL RIGHTS RESERVED 2024</p>
            </div>
        </footer>
    )
}

export default Footer