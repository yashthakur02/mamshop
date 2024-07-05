import { onGetResults } from '@/actions/games'
import BreadCrumb from '@/components/dashboard/BreadCrumb'
import React from 'react'
import SectionHeader from '@/components/header/sextion-header'
import { DataTable } from '@/components/table/data-table'
import { recordsColumns } from './records-table-column'
import { IRecord } from '@/types'

type Props = {}


const Records = async ({ params }: { params: { slug: string } }) => {

    const results: IRecord[] = await onGetResults()

    return (
        <div className='space-y-4'>
            <BreadCrumb />
            <SectionHeader
                title={"Records List"}
            />
            <DataTable
                columns={recordsColumns}
                data={results}
            />
        </div>
    )
}

export default Records