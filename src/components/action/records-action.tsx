"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Loader2, PenLineIcon, Trash2Icon } from 'lucide-react'
import { onDeleteRecord } from '@/actions/records'

import { useToast } from '../ui/use-toast'
import Modal from '../modal'
import { IRecord } from '@/types'
import EditRecordForm from '../forms/edit-record-form'

type IRecordActionProps = {
    record: IRecord
}

const RecordsAction = ({ record }: IRecordActionProps) => {
    const { toast } = useToast()
    const [open, setOpen] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    async function handleDeleteRecord() {
        setDeleting(true)
        try {
            await onDeleteRecord(record.id!)
            toast({
                title: "Record Deleted Successfully",
                variant: "danger",
                description: ""
            })
            setDeleting(false)
        } catch (error) {
            console.log(error)
            setDeleting(false)
        }
    }


    return (
        <div className='space-x-4 '>
            <Modal
                open={open}
                setOpen={setOpen}
                title="Update Record"
                trigger={
                    <Button onClick={() => setOpen(true)} size={'icon'} className='bg-blue-600 hover:bg-blue-800'>
                        <PenLineIcon size={16} />
                    </Button>
                }
            >
                {record ? (
                    <EditRecordForm record={record} setOpen={setOpen} />
                ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                        <Loader2 className='animate-spin' />
                    </div>
                )}
            </Modal>
            {
                deleting ? (
                    <Button size={"icon"} disabled>
                        <Loader2 className='animate-spin' size={16} />
                    </Button>
                ) : (
                    <Button onClick={() => handleDeleteRecord()} size={"icon"} className='bg-red-600 hover:bg-red-800'>
                        <Trash2Icon className='' size={16} />
                    </Button>
                )
            }
        </div>
    )
}

export default RecordsAction