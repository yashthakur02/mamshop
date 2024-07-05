"use client"

import React from 'react'
import { Button } from '../ui/button'
import { RefreshCwIcon } from 'lucide-react'
import { updateGames } from '@/actions/satta-matka-scrapper'
import { useToast } from '../ui/use-toast'
import { format } from 'date-fns'

type Props = {}

const UpdateGame = (props: Props) => {
    const [updating, setUpdating] = React.useState<boolean>(false)
    const { toast } = useToast()
    const handleUpdateRecord = async () => {
        setUpdating(true)
        try {
            await updateGames()
            setUpdating(false)
            toast({
                title: "Games Updated Successfully",
                variant: "success",
                description: format(new Date(), "EEE dd MMM, yyyy")
            })
        } catch (error) {
            setUpdating(false)
        } finally {
            setUpdating(false)
        }
    }
    return (
        <Button disabled={updating} onClick={handleUpdateRecord} size={"sm"}>
            <RefreshCwIcon className={`${updating ? "animate-spin" : ""}`} size={16} />
        </Button>
    )
}

export default UpdateGame