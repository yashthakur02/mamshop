"use server"

import prisma from "@/lib/db"
import { HttpError } from "@/lib/scrapper-utils";
import { convertTo24HourFormat, genAnk } from "@/lib/utils";
import { AddGameInput, EditGameInput, Game, IRecord } from "@/types"
import { revalidatePath } from "next/cache"


export const getGames = async (): Promise<Game[]> => {
    try {
        let games = await prisma.game.findMany();

        const sortedGames = games.sort((a, b) => {
            const openTimeA = convertTo24HourFormat(a.openTime);
            const openTimeB = convertTo24HourFormat(b.openTime);
            return openTimeA.localeCompare(openTimeB);
        });
        return sortedGames;
    } catch (error) {
        console.error("ERROR from getGames", error);
        return [];
    }
};

export const onGetGame = async (slug: string): Promise<Game | null> => {
    try {
        const game = await prisma.game.findUnique({
            where: {
                slug
            },
        })

        if (!game) {
            return null;
        }
        return game
    } catch (error) {
        console.log(error)
        throw new HttpError("Something went ron", 500)
    }
}


export const onUpdateGame = async (slug: string, data: EditGameInput) => {
    try {
        const updatedGame = await prisma.game.update({
            where: {
                slug
            },
            data
        })
        revalidatePath('/dashboard/all-games')
        return updatedGame
    } catch (error) {

    }
}
export const onCreateGame = async (data: AddGameInput) => {

    const slug = data.title.replace(/\s+/g, "-").toLowerCase()
    try {
        const game = await prisma.game.create({
            data: {
                ...data,
                slug
            }
        })
        revalidatePath('/dashboard/all-games')
        return game;

    } catch (error) {
        console.log(error)
    }
}

export const onDeleteGame = async (slug: string) => {
    try {
        await prisma.game.delete({
            where: {
                slug
            }
        })
        revalidatePath('/dashboard/all-games')
        return {
            message: "Game Deleted Successfully"
        }
    } catch (error) {
        console.log(error)
    }
}

export const onGetResults = async (): Promise<IRecord[]> => {
    try {
        const games = await getGames()

        const gamesWithFirstRecord = await Promise.all(games.map(async (game) => {
            const firstRecord = await prisma.record.findFirst({
                where: {
                    gameId: game.id
                },
                select: {
                    leftPanel: true,
                    rightPanel: true,
                    pair: true,
                    date: true
                },
                orderBy: {
                    id: "desc"
                }
            });
            let result = ""
            if (firstRecord?.leftPanel && firstRecord?.rightPanel) {
                const pair = `${genAnk(firstRecord.leftPanel)}${genAnk(firstRecord.rightPanel)}`
                result = `${firstRecord.leftPanel}-${pair}-${firstRecord.rightPanel}`;
            } else if (firstRecord?.leftPanel.includes("Loading...")) {
                result = `${firstRecord.leftPanel}`;

            } else if (firstRecord?.leftPanel) {
                const pair = genAnk(firstRecord.leftPanel)
                result = `${firstRecord.leftPanel}-${pair}`;
            } else {
                result = ""
            }

            return {
                id: game.id,
                title: game.title,
                date: firstRecord?.date,
                slug: game.slug,
                result,

                openTime: game.openTime,
                closeTime: game.closeTime
            };
        }));

        // Filter out null values
        const filteredGames = gamesWithFirstRecord.filter(game => game !== null);

        return filteredGames as IRecord[];
    } catch (error) {
        console.log(error);
        return [];
    }
};

