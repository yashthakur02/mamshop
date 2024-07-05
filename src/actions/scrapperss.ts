"use server"
import { parse, format, addDays, isValid } from 'date-fns';
import prisma from "@/lib/db";
import { Game, IRecord } from "@/types";
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { revalidatePath } from "next/cache";
import { promises as fs } from 'fs';
import { parseDate } from '@/lib/utils';

const baseUrl = process.env.SCRAPPING_WEBSITE_URL1 as string
const baseUrl2 = process.env.SCRAPPING_WEBSITE_URL2 as string


function formatSpecificDate(dateStr: string) {
    const parsedDate = parseDate(dateStr);
    if (parsedDate) {
        return format(parsedDate, 'dd/MM/yyyy');
    }
    return dateStr;
}

//Fetching HTML from the Website
async function fetchHTML(url: string): Promise<string> {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch HTML from ${url}: ${error}`);
    }
}
//DPBoss Scrapper
function extractDataFromDBBOSS(document: Document): IRecord[] {
    const tbody = document.querySelector('.panel-body');
    if (!tbody) {
        throw new Error('tbody element not found');
    }

    const data: IRecord[] = [];
    const rows = tbody.querySelectorAll('tr');

    let lastStartDate: any = undefined;
    let lastEndDate: any = undefined;


    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;

        const cells = row.querySelectorAll('th, td');
        for (let cellIndex = 0; cellIndex < cells.length; cellIndex += 3) {
            if (cellIndex + 2 < cells.length) {
                const dateRangeCell = cells[cellIndex].innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ');
                const dateRange = dateRangeCell.match(/(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/g);

                const leftPanel = cleanText(cells[cellIndex + 1].innerHTML);
                const pair = cleanText(cells[cellIndex + 2]?.innerHTML);
                const rightPanel = cleanText(cells[cellIndex + 3]?.innerHTML);

                if (leftPanel.length !== 0 || rightPanel.length !== 0 || pair.length !== 0) {
                    let date

                    if (dateRange && dateRange.length === 2) {
                        date = formatSpecificDate(dateRange[0]);
                        lastStartDate = parseDate(dateRange[0]);
                        if (!lastStartDate) {
                            console.error('Invalid parsed date:', dateRange[0]);
                        }
                    } else if (lastStartDate) {
                        // If current row doesn't have dates, increment the last start date
                        lastStartDate = addDays(lastStartDate, 1);
                        date = format(lastStartDate!, 'dd/MM/yyyy');
                        if (!isValid(lastStartDate)) {
                            console.error('Invalid incremented date:', lastStartDate);
                        }
                    } else {
                        date = '';
                    }
                    const rowData: IRecord = {
                        leftPanel,
                        pair,
                        rightPanel,
                        date
                    };

                    // Set createdAt if startDate exists
                    data.push(rowData);
                }
            }
        }
    });
    // console.log("Data from DPBOSS", data)
    return data;
}

//Parsing HTML
function parseHTML(html: string): Document {
    const dom = new JSDOM(html);
    return dom.window.document;
}

//
export async function getPanelChartFromDPBoss(slug: string): Promise<any> {
    let url = `https://dpbossss.services/panel-chart-record/${slug}.php?full_chart`

    console.log(url);
    try {
        const html = await fetchHTML(url);
        const document = await parseHTML(html);
        const data: IRecord[] = extractDataFromDBBOSS(document);

        await updateDatabase(slug, data.reverse());
        // await fs.writeFile(`${slug}.csv`, JSON.stringify(data, null, '\t'));
        const dataCSV = data.reduce((acc, record) => {

            acc += `${record.date}, ${record.leftPanel}, ${record.pair},${record.rightPanel}\n`;
            return acc;
        },
            `date, leftPanel, pair, righrPanel\n` // column names for csv
        );

        // finally, write csv content to a file using Node's fs module
        await fs.writeFile(`${slug}.csv`, dataCSV, 'utf8')

        return data
    } catch (error) {
        console.error('Error scraping the table:', error);
        return [];
    }
}


async function extractGames(document: Document) {

    const timeRegex = /\((\d{2}:\d{2})\) - \((\d{2}:\d{2})\)|\((\d{2}:\d{2}) - - (\d{2}:\d{2})\)|\((\d{2}:\d{2}) -  - (\d{2}:\d{2})\)/;
    const gameData: Game[] = [];
    try {
        const gamesDoc = Array.from(document.querySelectorAll('.news2, .fix'));
        const gamesResult = gamesDoc.map((result) => result.querySelector("span[style*='color:black']"))
        const games = gamesDoc.map((game) => game.querySelector('span'))
        const gameTimings = gamesDoc.map((timing) => timing.querySelector("span[style*='color:red']"))

        const titlesToScrape = ["KALYAN", "SRIDEVI", "MADHUR DAY", "MADHUR NIGHT", "SRIDEVI NIGHT", "RAJDHANI NIGHT", "MAIN BAZAR"];
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
                        await prisma.game.update({
                            where: { slug },
                            data: {
                                // result: result?.textContent?.trim()?.split('\n')[0]?.trim()?.match(phoneRegex)?.[0] || "Loading...",
                            }
                        });
                    } else {
                        gameData.push({
                            title,
                            openTime,
                            closeTime,
                            slug
                        });
                    }
                }
            }
        }));

        if (gameData.length > 0) {
            await prisma.game.createMany({ data: gameData });
        }

        revalidatePath("/admin/all-games");

        return gameData;
    } catch (error) {
        console.log(error);
        return [];
    }
}
export async function onScrapAndUpdateGame() {
    try {
        const html = await fetchHTML(baseUrl)
        const document = await parseHTML(html)
    } catch (error) {

    }
}


export async function onScrapeAndUpdateGame(): Promise<Game[]> {
    try {
        const response = await axios.get(baseUrl);
        const html = await response.data;

        const phoneRegex = /\d{3}-\d{2}-\d{3}|\d{3}-\d{1}/g;
        const timeRegex = /\((\d{2}:\d{2})\) - \((\d{2}:\d{2})\)|\((\d{2}:\d{2}) - - (\d{2}:\d{2})\)|\((\d{2}:\d{2}) -  - (\d{2}:\d{2})\)/;

        const document = new JSDOM(html).window.document;
        const results = [...document.querySelectorAll('.menu2')];
        const gameResults = results.map((result) => result.querySelector("span[style*='color:blue;font-size:23px;']"));
        const games = results.map((result) => result.querySelector('span'));
        const gameTimings = results.map((result) => result.querySelector("span[style*='color:red']"));

        let gameData: any[] = [];

        for (let id = 0; id < games.length; id++) {
            const game = games[id];
            const result = gameResults[id]?.textContent;
            const title = game?.textContent as string;
            const titlesToScrape = ["KALYAN", "SRIDEVI", "MADHUR DAY", "MADHUR NIGHT", "SRIDEVI NIGHT", "RAJDHANI NIGHT", "MAIN BAZAR"];

            if (titlesToScrape.includes(title)) {
                const timings = gameTimings[id]?.textContent?.trim();
                const timeMatches = timings?.match(timeRegex);
                let openTime = null;
                let closeTime = null;
                if (timeMatches) {
                    let otime = timeMatches[1] || timeMatches[3] || timeMatches[5];
                    let ctime = timeMatches[2] || timeMatches[4] || timeMatches[6];
                    switch (title) {
                        case "SRIDEVI":
                            openTime = `${otime} AM`;
                            closeTime = `${ctime} PM`;
                            break;
                        case "MAIN BAZAR":
                            openTime = `${otime} PM`;
                            closeTime = `${ctime} AM`;
                            break;
                        default:
                            openTime = `${otime} PM`;
                            closeTime = `${ctime} PM`;
                            break;
                    }
                }


                let slug = title.replace(/\s+/g, '-').toLowerCase();

                // Check if the game already exists in the database
                // const existingGame = await prisma.game.findUnique({
                //     where: { slug: slug }
                // });

                // if (existingGame) {
                //     await prisma.game.update({
                //         where: {
                //             slug: slug
                //         },
                //         data: {
                //             // result: result?.textContent?.trim()?.split('\n')[0]?.trim()?.match(phoneRegex)?.[0] || "Loading...",
                //         }
                //     })
                // } else {
                //     gameData.push({
                //         title,
                //         openTime: openTime!,
                //         closeTime: closeTime!,
                //         slug: slug
                //     });
                // }
                gameData.push({
                    title,
                    openTime: openTime!,
                    closeTime: closeTime!,
                    slug: slug,
                    result,
                    date: format(new Date(), 'dd/MM/yyyy')
                });
            }
        }

        // if (gameData.length > 0) {
        //     await prisma.game.createMany({
        //         data: gameData
        //     });
        // }

        // revalidatePath("/admin/all-games");

        // return gameData;
        console.log(gameData)
    } catch (error) {
        console.log(error);
        return [];
    }
}

// export async function getPanelCharts(slug: string): Promise<any> {

//     console.log(`${baseUrl}record/${slug}-penal-chart.php`)
//     try {
//         const response = await axios.get(`${baseUrl}record/${slug}-penal-chart.php`);
//         const html = await response.data;
//         const dateRangeRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4})to(\d{1,2}\/\d{1,2}\/\d{2,4})/;

//         const dom = new JSDOM(html);
//         const document = dom.window.document;

//         const tbody = document.querySelector('tbody');

//         if (!tbody) {
//             throw new Error('tbody element not found');
//         }

//         const data: Record[] = [];
//         const rows = tbody.querySelectorAll('tr');

//         rows.forEach((row, rowIndex) => {
//             if (rowIndex === 0) return;

//             const cells = row.querySelectorAll("th, td");
//             for (let cellIndex = 0; cellIndex < cells.length; cellIndex += 3) {
//                 if (cellIndex + 2 < cells.length) {
//                     const dateRange = cells[cellIndex].innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').replace(/\s/g, '').match(dateRangeRegex);
//                     const leftPanel = cells[cellIndex + 1].innerHTML.replace(/<br\s*\/?>/gi || /<span\s*\/?>/gi, ' ').replace(/\s+/g, ' ').replace(/\s/g, '')!;
//                     const pair = cells[cellIndex + 2]?.textContent?.trim().replace(/\s+/g, '')!;
//                     const rightPanel = cells[cellIndex + 3].innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').replace(/\s/g, '')!;

//                     if (leftPanel.length !== 0 || rightPanel.length !== 0 || pair.length !== 0) {
//                         const rowData: Record = {
//                             leftPanel,
//                             pair,
//                             rightPanel,
//                             startDate: dateRange?.[1] || dateRange?.[3]!,
//                             endDate: dateRange?.[2] || dateRange?.[4]!,
//                         };

//                         data.push(rowData);
//                     }
//                 }
//             }
//         });

//         // Check if the game already exists in the database
//         const existingGame = await prisma.game.findUnique({
//             where: { slug: slug },
//             include: { records: true } // Include related records
//         });

//         // if (existingGame) {
//         //     // Update the existing game's records
//         //     await prisma.$transaction(async (prisma) => {
//         //         // Delete existing records
//         //         await prisma.record.deleteMany({
//         //             where: { gameId: existingGame.id }
//         //         });

//         //         // Create new records
//         //         await prisma.record.createMany({
//         //             data: data.map(record => ({
//         //                 ...record,
//         //                 gameId: existingGame.id
//         //             }))
//         //         });
//         //     });
//         // } else {
//         //     console.error(`Game with slug ${slug} does not exist in the database.`);
//         // }
//         console.log(data)
//         await fs.writeFile(`${slug}.json`, JSON.stringify(data, null, '\t'));
//         return data;
//     } catch (error) {
//         console.error('Error scraping the table:', error);
//         return [];
//     }
// }

export async function updateDatabase(slug: string, data: IRecord[]): Promise<void> {
    const existingGame = await prisma.game.findUnique({
        where: { slug },
        include: { records: true }
    });

    if (existingGame) {
        await prisma.$transaction(async (prisma) => {
            await prisma.record.deleteMany({
                where: { gameId: existingGame.id }
            });

            await prisma.record.createMany({
                data: data.map(record => ({
                    ...record,
                    // createdAt:new Date(),
                    gameId: existingGame.id,
                }))
            });
        });
        revalidatePath(`/admin/record/${slug}`);
    } else {
        console.error(`Game with slug ${slug} does not exist in the database.`);
    }
}

function cleanText(text: string): string {
    return text
        .replace(/<span\s*style\s*=\s*"(color:\s*#ff0000;|color:\s*rgb\(0,\s*0,\s*0\);)">/g, '')
        .replace(/<\/span>/g, '')
        .replace(/<br\s*\/?>/g, '')
        .replace(/<p[^>]*>/g, '') // remove all <p> tags including those with attributes
        .replace(/<\/p>/g, '')    // remove closing </p> tags
        .replace(/\s+/g, '')     // replace multiple spaces with a single space
        .replace(/\b(\d)\s+(\d)\b/g, '$1$2') // remove spaces between single digits
        .trim();
}

function extractData(document: Document): IRecord[] {
    const tbody = document.querySelector('tbody');
    if (!tbody) {
        throw new Error('tbody element not found');
    }

    const data: Record[] = [];
    const rows = tbody.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;

        const cells = row.querySelectorAll('th, td');
        for (let cellIndex = 0; cellIndex < cells.length; cellIndex += 3) {
            if (cellIndex + 2 < cells.length) {
                const dateRangeCell = cells[cellIndex].innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ');
                const dateRange = dateRangeCell.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/g);

                const leftPanel = cleanText(cells[cellIndex + 1].innerHTML);
                const pair = cleanText(cells[cellIndex + 2]?.innerHTML);
                const rightPanel = cleanText(cells[cellIndex + 3]?.innerHTML);

                if (leftPanel.length !== 0 || rightPanel.length !== 0 || pair.length !== 0) {
                    const startDate = dateRange?.[0] || '';
                    const endDate = dateRange?.[1] || '';

                    const rowData: Record = {
                        leftPanel,
                        pair,
                        rightPanel,
                        date: ""
                    };

                    // Set createdAt if startDate exists
                    data.push(rowData);
                }
            }
        }
    });
    console.log(data)
    return data;
}


export async function getPanelCharts(slug: string): Promise<any> {
    let url = ""
    switch (slug) {
        case "sridevi":
            url = `${baseUrl2}record/${slug}-satta-penal-chart.php`;
            break;
        case "kalyan":
            url = `${baseUrl2}record/${slug}-penal-chart.php`;
            break;
        case "madhur-day":
            url = `${baseUrl2}${slug}-panel-chart.php`;
            break;
        case "sridevi-night":
            url = `${baseUrl2}record/${slug}-satta-penal-chart.php`;
            break;
        case "madhur-night":
            url = `${baseUrl2}${slug}-panel-chart.php`;
            break;
        case "rajdhani-night":
            url = `${baseUrl2}record/${slug}-penal-chart.php`;
            break;
        case "main-bazar":
            url = `${baseUrl2}/${slug}-panel-chart.php`;
            break;
        default:
            break;
    }
    console.log(url);
    try {
        const html = await fetchHTML(url);
        const document = parseHTML(html);
        const data = extractData(document);

        await updateDatabase(slug, data);

        await fs.writeFile(`${slug}.json`, JSON.stringify(data, null, '\t'));
        return data;
    } catch (error) {
        console.error('Error scraping the table:', error);
        return [];
    }
}