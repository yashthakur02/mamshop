"use client"

import { useState } from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

type Props = {

}

const AddRecord = ({ }: Props) => {

    const [fetching, setFetching] = useState<boolean>(false)

    const handleAddRecord = async () => {
        setFetching(true)
        try {

            setFetching(false)
        } catch (error) {
            console.log(error)
            setFetching(false)
        } finally {
            setFetching(false)
        }
    }
    return (
        <Button disabled={fetching} onClick={handleAddRecord}>
            {fetching ? <Loader2 className='mr-2 animate-spin' /> : " Add Record"}
        </Button>
    )
}

export default AddRecord