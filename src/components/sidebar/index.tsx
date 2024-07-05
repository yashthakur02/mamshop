"use client"

import React from 'react'
import { SideSheet } from '../sheet'
import { Button } from '../ui/button'
import { ChevronLeft, Gamepad2, Grid3X3, Grid3x3, LayoutDashboardIcon } from 'lucide-react'
import Link from 'next/link'

type Props = {}

const Sidebar = (props: Props) => {

    const [open, setOpen] = React.useState(false)

    return (
        <aside className={`w-60 ${open ? "translate-x-none" : "-translate-x-48"} fixed transition transform ease-in-out duration-1000 z-50 flex h-screen bg-slate-900`}>
            <div className={`max-toolbar w-full -right-6 transition transform ease-in duration-300 flex items-center justify-between border-2  border-white dark:border-[#0F172A]  bg-[#1E293B] absolute top-2 rounded-full h-12 ${open ? "translate-x-0" : "translate-x-24 scale-x-0 "}`}>
                <div className={`flex pl-4 items-center space-x-2 `}>
                    <div>
                        <div onClick={() => { }} className="moon text-white hover:text-blue-500 dark:hover:text-[#38BDF8]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        </div>
                        <div onClick={() => { }} className="sun hidden text-white hover:text-blue-500 dark:hover:text-[#38BDF8]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>
                        </div>
                    </div >
                </div>
                <div className={`flex items-center space-x-3 group bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-yellow-500 via-orange-500 to-orange-500  pl-10 pr-2 py-1 rounded-full text-white `}>
                    <div className="transform ease-in-out duration-300 mr-12">
                        Admin
                    </div>
                </div>
            </div>
            <div onClick={() => setOpen(prev => !prev)} className="-right-6 transition transform ease-in-out duration-500 flex border-2 border-white dark:border-[#0F172A] bg-[#1E293B] dark:hover:bg-blue-500 hover:bg-purple-500 absolute top-2 p-3 rounded-full text-white hover:rotate-45">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            </div>
            <div className={`max ${open ? "flex" : "hidden"} text-white mt-20 flex-col space-y-2 w-full h-[calc(100vh)]`}>
                <Link href={"/dashboard"} className="hover:ml-4 w-full text-white hover:text-purple-500 dark:hover:text-blue-500 hover:bg-[#1E293B] p-2 pl-8 rounded-full transform ease-in-out duration-300 flex flex-row items-center space-x-3">
                    <LayoutDashboardIcon size={16} />
                    <div>
                        Dashboard
                    </div>
                </Link>
                <Link href={"/dashboard/all-games"} className="hover:ml-4 w-full text-white hover:text-purple-500 dark:hover:text-blue-500 hover:bg-[#1E293B] p-2 pl-8 rounded-full transform ease-in-out duration-300 flex flex-row items-center space-x-3">
                    <Gamepad2 size={16} />
                    <div>
                        Games
                    </div>
                </Link>
                <Link href={"/admin/records"} className="hover:ml-4 w-full text-white hover:text-purple-500 dark:hover:text-blue-500 hover:bg-[#1E293B] p-2 pl-8 rounded-full transform ease-in-out duration-300 flex flex-row items-center space-x-3">
                    <Grid3x3 size={16} />
                    <div>
                        Records
                    </div>
                </Link>
            </div>
            {/* Mini Sidebar */}
            <div className={`mini mt-20 ${open ? "hidden" : "flex"} flex-col space-y-2 w-full h-[calc(100vh)]`}>
                <div className="hover:ml-4 justify-end pr-5 text-white hover:text-purple-500 dark:hover:text-blue-500 w-full bg-[#1E293B] p-3 rounded-full transform ease-in-out duration-300 flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </div>
                <div className="hover:ml-4 justify-end pr-5 text-white hover:text-purple-500 dark:hover:text-blue-500 w-full bg-[#1E293B] p-3 rounded-full transform ease-in-out duration-300 flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                </div>
                <div className="hover:ml-4 justify-end pr-5 text-white hover:text-purple-500 dark:hover:text-blue-500 w-full bg-[#1E293B] p-3 rounded-full transform ease-in-out duration-300 flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                    </svg>
                </div>
            </div>

        </aside>
    )
}

export default Sidebar