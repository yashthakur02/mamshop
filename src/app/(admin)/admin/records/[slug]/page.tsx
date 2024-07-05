import { onGetRecord } from '@/actions/records'
import UpdateRecord from '@/components/action/update-record'
import BreadCrumb from '@/components/dashboard/BreadCrumb'
import SectionHeader from '@/components/header/sextion-header';
import React from 'react'
import { recordColumns } from './record-table-columns'
import { DataTable } from '@/components/table/data-table'
import { PlusIcon } from 'lucide-react'
import FileUpload from '@/components/upload/file-upload'
import { IRecord } from '@/types'
import Modal from '@/components/modal'
import { Button } from '@/components/ui/button'
import AddRecordForm from '@/components/forms/add-record-form'


type Props = {}

const GameRecords = async ({ params }: { params: { slug: string } }) => {
    const data: IRecord[] | any = await onGetRecord(params.slug);
    return (
        <div className='flex flex-col gap-4'>
            <BreadCrumb />
            <SectionHeader
                title={params.slug.replace("-", " ") + " " + "Record"}
            >
                <FileUpload slug={params.slug} />
                <UpdateRecord slug={params.slug} />
                <Modal
                    title="Add new Game"
                    trigger={
                        <Button size={"icon"}><PlusIcon /></Button>
                    }
                >
                    <AddRecordForm gameId={data ? data.id : ""} />
                </Modal>
            </SectionHeader>
            <DataTable
                columns={recordColumns}
                data={data ? data.records : []}
                toolbar
            />
        </div>
    )
}

export default GameRecords;