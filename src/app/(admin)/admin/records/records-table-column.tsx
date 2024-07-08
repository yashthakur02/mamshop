"use client"


import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { buttonVariants } from "@/components/ui/button";
import { cn, } from "@/lib/utils";
import { IRecord } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

export const recordsColumns: ColumnDef<IRecord>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => <div className="w-max">{row.getValue("title")}</div>,
        enableSorting: false,
        // enableHiding: false,
    },
    // {
    //     accessorKey: "leftPanel",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Left Panel" />
    //     ),
    //     cell: ({ row }) => <div className="w-[80px]">{row.getValue("leftPanel")}</div>,
    //     enableSorting: false,
    //     // enableHiding: false,
    // },
    // {
    //     accessorKey: "pair",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Jodi" />
    //     ),
    //     cell: ({ row }) => <div className="w-[80px]">{row.getValue("pair")}</div>,
    //     enableSorting: false,
    //     // enableHiding: false,
    // },
    // {
    //     accessorKey: "rightPanel",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Right Panel" />
    //     ),
    //     cell: ({ row }) => <div className="w-[80px]">{row.getValue("rightPanel")}</div>,
    //     enableSorting: false,
    //     // enableHiding: false,
    // },
    {
        accessorKey: "result",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Result" />
        ),
        cell: ({ row }) => <div className="w-max">{row.getValue("result")}</div>,
        enableSorting: false,
        // enableHiding: false,
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated" />
        ),
        cell: ({ row }) =>
            <div className="w-max">
                {row.getValue("date")}
            </div>,
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
                <div className="flex items-center justify-center space-x-3">
                    <Link href={`/admin/records/${record.slug}`} className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "bg-orange-500 hover:bg-orange-500/80")}>
                        <EyeIcon className="text-white" size={18} />
                    </Link>
                </div>
            )
        },
    },
]