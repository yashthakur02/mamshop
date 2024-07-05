"use client"

import React from 'react'
import { Button } from '../ui/button'
import { RefreshCwIcon } from 'lucide-react'
import { useToast } from '../ui/use-toast';
import { format } from 'date-fns';
import { onUpdateRecords } from '@/actions/satta-matka-scrapper';

type Props = {
    slug: string,
}

const UpdateRecord = ({ slug }: Props) => {

    const [fetching, setFetching] = React.useState<boolean>(false)
    const { toast } = useToast()
    const handleUpdateRecord = async () => {
        setFetching(true)
        try {
            await onUpdateRecords(slug)
            setFetching(false)
            toast({
                title: "Records Updated Successfully",
                variant: "success",
                description: format(new Date(), "EEE dd MMM, yyyy")
            })
        } catch (error) {
            setFetching(false)
        } finally {
            setFetching(false)
        }
    }
    return (
        <Button disabled={fetching} onClick={handleUpdateRecord} className='' size={"sm"}>
            <RefreshCwIcon className={`${fetching ? "animate-spin" : ""}`} size={16} />
        </Button>
    )
}

export default UpdateRecord;