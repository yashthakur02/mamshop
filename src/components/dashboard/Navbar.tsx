import User from './user'

const Navbar = () => {
    return (
        <div className="fixed w-full z-30 flex bg-white dark:bg-[#0F172A] p-2 items-center justify-between px-10">
            <div className="logo ml-12 dark:text-white transform ease-in-out duration-500 flex-none h-full flex items-center justify-center text-xl font-medium">
                Mam<span className='text-orange-500 font-bold'>Shop</span>
            </div>
            <User />
        </div>
    )
}

export default Navbar
