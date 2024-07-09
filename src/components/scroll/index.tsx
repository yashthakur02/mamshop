"use client"
import React from 'react'
import { Button } from '../ui/button'

type Props = {
    position: "top" | "bottom",
    title: string
}

const ScrollTo = ({ position, title }: Props) => {
    return (
        <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
                window.scrollTo({
                    top: position === "bottom" ? (document.documentElement.scrollHeight - 50) : 0,
                    behavior: 'smooth'
                })
            }}>
            Go to {title}
        </Button>
    )
}

export default ScrollTo