import { onGetRecord } from '@/actions/records'
import BreadCrumb from '@/components/dashboard/BreadCrumb'
import React from 'react'
import { recordColumns } from './record-table-column'
import { RowData } from '@/components/table/panel-table'
import { DataTable } from '@/components/table/data-table'

type Props = {
    params: {
        slug: string
    }
}

const Record = async ({ params: { slug } }: Props) => {
    const record: RowData[] | any = await onGetRecord(slug)

    console.log(record)
    return (
        <div>
            <BreadCrumb />
            <DataTable columns={recordColumns} data={record.records} />
        </div>
    )
}

export default Record