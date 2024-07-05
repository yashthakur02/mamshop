"use client"

import { LayoutDashboardIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {
    path?: string
}

const BreadCrumb = () => {

    const pathname = usePathname()

    const fullPath = pathname.split('/').slice(2, pathname.split('/').length)
    return (
        <nav className="flex px-5 py-3 text-gray-700  rounded-lg bg-gray-50 dark:bg-[#1E293B] " aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link href="/admin/dashboard" className="inline-flex gap-1 capitalize items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <LayoutDashboardIcon size={16} fill='#000000' />
                        Dashboard
                    </Link>
                </li>
                {fullPath.length > 0 && (
                    fullPath.map((path, idx) => (
                        <li key={path}>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                <Link href="#" className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white capitalize">
                                    {path.replace("-", " ")}
                                </Link>
                            </div>
                        </li>
                    ))
                )}
            </ol>
        </nav>
    )
}

export default BreadCrumb