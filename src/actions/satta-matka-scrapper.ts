"use server"

import { Game, IRecord, IResult } from "@/types";
import { getGames, onGetGame, onGetResults, onUpdateGame } from "./games";
import { getDocument, onUpdateDatabase } from "./web-scrapper";
import { onCreateRecord, onUpdateRecord } from "./records";
import prisma from "@/lib/db";
import { addDays, format, isValid } from "date-fns";
import { revalidatePath } from "next/cache";
import { promises as fs } from 'fs';
import { cleanText } from "@/lib/scrapper-utils";
import { formatSpecificDate, parseDate } from "@/lib/utils";

const baseUrl = process.env.SATTA_MATKA_URL as string

async function fetchLiveResult(document: Document) {
    const results = [...document.querySelectorAll('.menu2')];

    let resultsData: any[] = [];
    const gamesToFetch = await getGames();
    const titlesToScrape = gamesToFetch.map((game) => game.title);

    for (const result of results) {
        const gameElements = result.querySelectorAll('span[style*="color:red;font-size:21px;"]');
        const resultElements = result.querySelectorAll("span[style*='color:blue;font-size:23px;']");

        if (gameElements.length !== resultElements.length) {
            console.error('Mismatch between game elements and result elements');
            continue;
        }

        for (let i = 0; i < gameElements.length; i++) {
            const gameElement = gameElements[i];
            const resultElement = resultElements[i];

            const title = gameElement?.textContent?.trim() || '';
            const resultText = resultElement?.textContent?.trim() || '';

            if (title && resultText) {
                let slug = title.replace(/\s+/g, '-').toLowerCase();
                const [leftPanel, pair, rightPanel] = resultText.split('-').map(s => s.trim());

                if (titlesToScrape.includes(title)) {
                    resultsData.push({
                        gameTitle: title,
                        result: resultText,
                        leftPanel: leftPanel || '',
                        pair: pair || '',
                        rightPanel: rightPanel || '',
                        slug,
                        date: format(new Date(), 'dd/MM/yyyy') // Use current date
                    });
                }
            }
        }
    }
    return resultsData;
}

function extractRecordsData(document: Document): IRecord[] {
    const tbody = document.querySelector('.panel-body, .pchart');
    if (!tbody) {
        throw new Error('tbody element not found');
    }

    const data: IRecord[] = [];
    const rows = tbody.querySelectorAll('tr');
    let lastStartDate: Date | null = null;

    rows.forEach((row, rowIndex) => {
        // if (rowIndex === 0) return;
        console.log("row", rows[0].innerHTML)
        const cells = row.querySelectorAll('th, td');
        for (let cellIndex = 0; cellIndex < cells.length; cellIndex += 3) {
            if (cellIndex + 2 < cells.length) {
                const dateRangeCell = cells[cellIndex].innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ');
                const dateRange = dateRangeCell.match(/(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/g);

                const leftPanel = cleanText(cells[cellIndex + 1].innerHTML);
                const pair = cleanText(cells[cellIndex + 2]?.innerHTML);
                const rightPanel = cleanText(cells[cellIndex + 3]?.innerHTML);


                if (leftPanel || rightPanel || pair) {
                    let date: string;

                    if (dateRange && dateRange.length === 2) {
                        date = formatSpecificDate(dateRange[0]);
                        lastStartDate = parseDate(dateRange[0]);
                    } else if (lastStartDate) {
                        lastStartDate = addDays(lastStartDate, 1);
                        date = format(lastStartDate, 'dd/MM/yyyy');
                    } else {
                        date = '';
                    }

                    if (isValid(lastStartDate)) {
                        const rowData: IRecord = {
                            leftPanel,
                            pair,
                            rightPanel,
                            date
                        };
                        data.push(rowData);
                    }
                }
            }
        }
    });
    return data;
}

async function extractOnMount(document: Document) {
    const resultRegex = /\d{3}-\d{2}-\d{3}|\d{3}-\d{1}/g;
    const results = [...document.querySelectorAll('.news2, .fix')];
    const gameResults = results.map((result) => result.querySelector("span[style*='color:black']"));
    const games = results.map((result) => result.querySelector('span'));

    let resultsData: IRecord[] = [];
    const gamesToFetch = await getGames();
    const titlesToScrape = gamesToFetch.map((game) => game.title);

    for (let id = 0; id < games.length; id++) {
        const fetchedGame = games[id];
        const result = gameResults[id]?.textContent;
        const title = fetchedGame?.textContent as string;
        let slug = title.replace(/\s+/g, '-').toLowerCase();

        const resultMatch = result?.match(resultRegex)
        if (titlesToScrape.includes(title)) {
            resultsData.push({
                title,
                result: result!,
                leftPanel: resultMatch ? result?.split("-")[0] || "" : "",
                pair: result?.split("-")[1] || '',
                rightPanel: result?.split("-")[2] || '',
                slug,
                date: format(new Date(), "dd/MM/yyyy")
            });
        }
        console.log("Gettting Result", title, result, resultMatch)
    }
    return resultsData;
}

async function extractGames(document: Document): Promise<IRecord[]> {
    const resultRegex = /\d{3}-\d{2}-\d{3}|\d{3}-\d{1}/g;
    const results = [...document.querySelectorAll('.news2, .fix')];
    const gameResults = results.map((result) => result.querySelector("span[style*='color:black']"));
    const games = results.map((result) => result.querySelector('span'));

    let resultsData: IRecord[] = [];
    const gamesToFetch = await getGames();
    const titlesToScrape = gamesToFetch.map((game) => game.title);

    for (let id = 0; id < games.length; id++) {
        const fetchedGame = games[id];
        const result = gameResults[id]?.textContent;
        const title = fetchedGame?.textContent as string;
        let slug = title.replace(/\s+/g, '-').toLowerCase();

        const resultMatch = result?.match(resultRegex)
        if (titlesToScrape.includes(title)) {
            resultsData.push({
                title,
                result: result!,
                leftPanel: resultMatch ? result?.split("-")[0] || "" : "",
                pair: result?.split("-")[1] || '',
                rightPanel: result?.split("-")[2] || '',
                slug,
                date: format(new Date(), "dd/MM/yyyy")
            });
        }

    }
    return resultsData;
}

export async function onUpdateRecords(slug: string) {
    let url = ""

    const games = slug.split("-")

    if (games.includes("sridevi")) {
        url = `${baseUrl}record/${slug}-satta-penal-chart.php`;
    } else if (games.includes("madhur") || games.includes("main")) {
        url = `${baseUrl}${slug}-panel-chart.php`;
    } else {
        url = `${baseUrl}record/${slug}-penal-chart.php`;
    }
    try {
        const document = await getDocument(url)
        const records: IRecord[] = extractRecordsData(document);

        await onUpdateDatabase(slug, records);

        const dataCSV = records.reduce((acc, record) => {
            return acc + `${record.date}, ${record.leftPanel}, ${record.pair},${record.rightPanel}\n`;
        }, `date, leftPanel, pair, rightPanel\n`); // corrected column name

        await fs.writeFile(`${slug}.csv`, dataCSV, 'utf8');
    } catch (error) {
        console.error('Error scraping the table:', error);
    }
}

export async function onFetchAndUpdateResult(): Promise<IRecord[]> {
    try {
        const document = await getDocument("https://sattamatka777.in/")
        // if (!document) {
        //     return await onGetResults();
        // }

        const results: IRecord[] = await extractOnMount(document);

        if (results && results.length > 0) {
            for (const result of results) {
                const game: Game | null = await onGetGame(result.slug!)

                if (!game) {
                    console.error(`Game with slug ${result.slug} does not exist.`);
                    return []; // Skip this result and proceed to the next
                }

                const existingRecord = await prisma.record.findFirst({
                    where: {
                        date: result.date,
                        gameId: game.id,
                    },
                });
                // console.log("EXISTING RECORD", existingRecord, result.date)
                if (existingRecord && game) {
                    await onUpdateRecord(existingRecord?.id, {
                        leftPanel: result.leftPanel || "",
                        pair: result.pair || "",
                        rightPanel: result.rightPanel || "",
                        date: existingRecord.date
                    })
                } else {
                    await onCreateRecord(game.id!, {
                        leftPanel: result.leftPanel,
                        pair: result.pair,
                        rightPanel: result.rightPanel,
                        date: result.date,
                    })
                }
                console.log("Result", result)
            }
        }

        return await onGetResults();
    } catch (error) {
        console.log(error, "hhhhhhhhhhhhhhhhhh");
        return await onGetResults();
    }
}

export async function updateGames() {

    const timeRegex = /\((\d{2}:\d{2})\) - \((\d{2}:\d{2})\)|\((\d{2}:\d{2}) - - (\d{2}:\d{2})\)|\((\d{2}:\d{2}) -  - (\d{2}:\d{2})\)/;

    try {
        const document = await getDocument(baseUrl)
        if (!document) {
            return []
        }
        const results = [...document.querySelectorAll('.news2, .fix')];
        const games = results.map((result) => result.querySelector('span'));
        const gameTimings = results.map((timing) => timing.querySelector("span[style*='color:red; font-size: small;']"))


        const gamesToFetch = await getGames();
        const titlesToScrape = gamesToFetch.map((game) => game.title);
        const timeSuffixMap: Record<string, [string, string]> = {
            "SRIDEVI": ["AM", "PM"],
            "MAIN BAZAR": ["PM", "AM"]
        };
        await Promise.all(games.map(async (game, id) => {
            const title = game?.textContent?.trim() || '';

            if (titlesToScrape.includes(title)) {
                const timings = gameTimings[id]?.textContent?.trim();
                const timeMatches = timings?.match(timeRegex);

                if (timeMatches) {
                    const [otime, ctime] = [
                        timeMatches[1] || timeMatches[3] || timeMatches[5],
                        timeMatches[2] || timeMatches[4] || timeMatches[6]
                    ];

                    const [openSuffix, closeSuffix] = timeSuffixMap[title] || ["PM", "PM"];
                    const openTime = `${otime} ${openSuffix}`;
                    const closeTime = `${ctime} ${closeSuffix}`;

                    const slug = title.replace(/\s+/g, '-').toLowerCase();

                    const existingGame = await prisma.game.findUnique({ where: { slug } });

                    if (existingGame) {
                        await onUpdateGame(slug, {
                            closeTime,
                            openTime,
                        })
                    }
                }
            }
        }));
        revalidatePath("/admin/games-list");
    } catch (error) {
        console.log(error);
    }
}

