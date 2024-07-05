import Navbar from '@/components/dashboard/Navbar'
import Sidebar from '@/components/sidebar'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sooner } from "@/components/ui/sonner"

type Props = {
    children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
    return (
        <div className='h-screen'>
            <Navbar />
            <Sidebar />
            <main className='ml-12 lg:ml-60 transform ease-in-out duration-500 pt-20 px-2 md:px-5 pb-4 mr-10'>
                {children}
            </main>
            <Sooner />
            <Toaster />
        </div>
    )
}

export default AdminLayout