"use server"
import { parse, format, addDays, isValid } from 'date-fns';
import prisma from "@/lib/db";
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { revalidatePath } from "next/cache";
import { promises as fs } from 'fs';
import { IRecord } from '@/types';
import { onUpdateRecord } from './records';


//Fetching HTML from the Website
async function fetchHTML(url: string): Promise<string> {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch HTML from ${url}: ${error}`);
    }
}

//Parsing Html Document
async function parseHTML(html: string): Promise<Document | null> {
    const dom = new JSDOM(html);
    return dom.window.document;
}

export async function getDocument(url: string) {
    console.log(url)
    try {
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);

        return dom.window.document
    } catch (error) {
        throw new Error(`Failed to fetch HTML from ${url}: ${error}`);
        // return null
    }
}

const BATCH_SIZE = 50;

//Updating Records in Database
export async function onUpdateDatabase(slug: string, data: IRecord[]): Promise<void> {
    const existingGame = await prisma.game.findUnique({
        where: { slug },
        include: { records: true }
    });

    if (!existingGame) {
        console.error(`Game with slug ${slug} does not exist in the database.`);
        return;
    }

    const existingRecordsMap = new Map(existingGame.records.map(record => [record.date, record])); //Creating Existing Records

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);

        await prisma.$transaction(async (prisma) => {
            for (const recordData of batch) {
                const existingRecord = existingRecordsMap.get(recordData.date);

                // if (existingRecord) {
                //     await onUpdateRecord(existingRecord.id, recordData)
                // } else {
                //     await prisma.record.createMany({
                //         data: {
                //             ...recordData,
                //             gameId: existingGame.id
                //         }
                //     })
                // }

                if (!existingRecord) {
                    await prisma.record.createMany({
                        data: {
                            ...recordData,
                            gameId: existingGame.id
                        }
                    })
                }
            }
        }, { timeout: 10000 }); // Increasing the timeout to 10 seconds
    }
    revalidatePath(`/admin/record/${slug}`);
}

