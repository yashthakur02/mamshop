"use server"
import prisma from "@/lib/db";
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { revalidatePath } from "next/cache";
import { IRecord } from '@/types';

export async function getDocument(url: string) {

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

    const existingRecordsMap = new Map(existingGame.records.map(record => [record.date, record]));

    // Filter out records that already exist
    const newRecords = data.filter(recordData => !existingRecordsMap.has(recordData.date));

    for (let i = 0; i < newRecords.length; i += BATCH_SIZE) {
        const batch = newRecords.slice(i, i + BATCH_SIZE);

        await prisma.record.createMany({
            data: batch.map(recordData => ({
                ...recordData,
                gameId: existingGame.id
            })),
            skipDuplicates: true // Optional: skips records with duplicate primary keys
        });
    }

    revalidatePath(`/admin/record/${slug}`);
}

