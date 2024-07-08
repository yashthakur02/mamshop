"use client"

import RecordsAction from "@/components/action/records-action";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { formatDate } from "@/lib/utils";
import { IRecord } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const recordColumns: ColumnDef<IRecord>[] = [
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) =>
            <div className="w-max">
                {/* {row.getValue("date")} */}
                {formatDate(row.getValue("date"))}
            </div>,
        enableSorting: false,
        // enableHiding: false,
    },
    {
        accessorKey: "leftPanel",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Left Panel" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("leftPanel")}</div>,
        enableSorting: false,
        // enableHiding: false,
    },
    {
        accessorKey: "pair",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jodi" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("pair")}</div>,
        enableSorting: false,
        // enableHiding: false,
    },
    {
        accessorKey: "rightPanel",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Right Panel" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("rightPanel")}</div>,
        enableSorting: false,
        // enableHiding: false,
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            const record = row.original

            return (
                <div className="flex items-center justify-center">
                    <RecordsAction record={record} />
                </div>
            )
        },
    },
]