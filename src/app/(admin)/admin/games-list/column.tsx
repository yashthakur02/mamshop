"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Game } from "@/types"
import GamesAction from "@/components/action/games-table-action";


export const columns: ColumnDef<Game>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "openTime",
        header: "Open Time",
    },
    {
        accessorKey: "closeTime",
        header: "Close Time"
    },
    {
        accessorKey: "daysCount",
        header: "Days Count"
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            const game = row.original

            return (
                <GamesAction slug={game.slug} />
            )
        },
    },
]