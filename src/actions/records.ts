"use server"

import prisma from "@/lib/db"
import { HttpError } from "@/lib/scrapper-utils"
import { genAnk } from "@/lib/utils"
import { IRecord } from "@/types"
import { parse } from "date-fns"
import { revalidatePath } from "next/cache"

export const onGetRecords = async (slug: string) => {
    try {
        const record = await prisma.game.findUnique({
            where: {
                slug
            },
            select: {
                slug: true,
                id: true,
                records: true
            }
        })

        // console.log(record)
        return record
    } catch (error) {
        console.log(error)
    }
}

export const onGetRecord = async (slug: string) => {
    try {
        const record = await prisma.game.findUnique({
            where: {
                slug
            },
            select: {
                id: true,
                daysCount: true,
                records: true,
            },
        })

        if (record && record.records) {
            record.records.sort((a, b) => {
                const dateA = parse(a.date, 'dd/MM/yyyy', new Date());
                const dateB = parse(b.date, 'dd/MM/yyyy', new Date());
                return dateB.getTime() - dateA.getTime(); // Ascending order
            });
        }
        return record
    } catch (error) {
        console.log(error)
    }
}

export const onUpdateRecord = async (id: string, recordData: IRecord) => {
    try {
        const record = await prisma.record.update({
            where: {
                id: id
            },
            data: {
                ...recordData
            }
        })
        return record
    } catch (error) {
        console.log(error)
    }
}

export async function onCreateRecord(gameId: string, recordData: IRecord) {
    try {
        // Check if a record with the same date and gameId already exists
        const existingRecord = await prisma.record.findFirst({
            where: {
                date: recordData.date,
                gameId: gameId,
            },
        });

        if (existingRecord) {
            // console.error('Error: Record with the same date already exists:', existingRecord);
            throw new HttpError('Record for date already exists.', 400);
        }

        const newRecord = await prisma.record.create({
            data: {
                leftPanel: recordData.leftPanel,
                pair: recordData.pair,
                rightPanel: recordData.rightPanel,
                date: recordData.date,
                gameId: gameId,
            },
        });
        return newRecord;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error; // Re-throw the custom HttpError
        }
        console.error('Error creating record:', error);
        throw new HttpError('Internal Server Error', 500); // 500 Internal Server Error
    }
}

export async function onDeleteRecord(recordId: string) {
    try {
        await prisma.record.delete({
            where: {
                id: recordId
            }
        })
        revalidatePath('/dashboard/all-games')
        return {
            message: "Record Deleted Successfully"
        }
    } catch (error) {
        console.log(error)
    }
}


export async function onGetRecordById(recordId: string) {
    try {
        const record = await prisma.record.findFirst({
            where: {
                id: recordId
            }
        })

        return record;
    } catch (error) {
        console.log(error)
    }
}


//TODO DELETE THIS
// export async function onGetResult(gameId: string) {
//     try {
//         const record = await prisma.record.findFirst({
//             where: {
//                 gameId
//             },
//             select: {
//                 id: true,
//                 date: true,
//                 leftPanel: true,
//                 rightPanel: true,
//                 pair: true,
//                 Game: {
//                     select: {
//                         slug: true,
//                         title: true,
//                         closeTime: true,
//                         openTime: true,
//                     }
//                 }
//             },
//             orderBy: {
//                 id: "desc"
//             }
//         });

//         let result = "";

//         if (record?.leftPanel && record?.rightPanel) {
//             result = `${record.leftPanel}-${genAnk(record.leftPanel)}${genAnk(record.rightPanel)}-${record.rightPanel}`;
//         } else if (record?.leftPanel) {
//             result = `${record.leftPanel}-${genAnk(record.leftPanel)}`;
//         }

//         return {
//             ...record,
//             result
//         };

//     } catch (error) {
//         console.error('Error fetching result:', error);
//         throw error; // Re-throw the error if you want to handle it further up the call stack
//     }
// }
