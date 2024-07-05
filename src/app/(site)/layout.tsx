import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const MainLayout
    = ({ children }: Props) => {
        return (
            <div className='bg-slate-200/50'>
                <Navbar />
                {children}
                <Footer />
            </div>
        )
    }

export default MainLayout
