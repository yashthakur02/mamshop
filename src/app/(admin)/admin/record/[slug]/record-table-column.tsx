"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Record } from "@/types"
import GamesAction from "@/components/action/games-table-action";
import { RowData } from "@/components/table/panel-table";


export const recordColumns: ColumnDef<RowData>[] = [
    {
        accessorKey: "leftPanel",
        header: "Left Panel",
    },
    {
        accessorKey: "pair",
        header: "Pair",
    },
    {
        accessorKey: "rightPanel",
        header: "Right Panel",
    },
    {
        accessorKey: "startDate",
        header: "Start Date",
    },
    {
        accessorKey: "endDate",
        header: "End Date",
    },


    // {
    //     id: "actions",
    //     header: "Actions",
    //     enableHiding: false,
    //     cell: ({ row }) => {
    //         const game = row.original

    //         return (
    //             // <GamesAction slug={game.slug} />
    //         )
    //     },
    // },
]