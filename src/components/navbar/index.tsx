import React from 'react'
import Logo from './logo'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun } from 'lucide-react'

type Props = {}

const Navbar = (props: Props) => {
    return (
        <header className='bg-violet-300/20 p-3 sticky top-0 w-full right-0 left-0 backdrop-blur-lg'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                    <Link href={'/'} className='text-orange-600 sm:text-2xl text-base font-medium'>
                        <span className='text-black font-bold'>Mam</span>Shop
                    </Link>
                </div>
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default Navbar