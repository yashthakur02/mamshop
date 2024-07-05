"use server"

import { cleanText } from "@/lib/scrapper-utils";
import { formatSpecificDate, parseDate } from "@/lib/utils";
import { IRecord } from "@/types";
import { addDays, format, isValid } from "date-fns";
import { fetchHTML, getDocument, onUpdateDatabase, parseHTML } from "./web-scrapper";
import { promises as fs } from 'fs';

function extractDataFromDBBOSS(document: Document): IRecord[] {
    const tbody = document.querySelector('.panel-body, .pchart');
    if (!tbody) {
        throw new Error('tbody element not found');
    }

    const data: IRecord[] = [];
    const rows = tbody.querySelectorAll('tr');
    let lastStartDate: Date | null = null;

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

export async function onUpdateRecordsFromDPBoss(slug: string): Promise<IRecord[]> {
    const url = `https://dpbossss.services/panel-chart-record/${slug}.php?full_chart`;

    try {
        const document = await getDocument("https://sattamatka777.in/record/sridevi-satta-penal-chart.php")
        const records: IRecord[] = extractDataFromDBBOSS(document);

        await onUpdateDatabase(slug, records);

        const dataCSV = records.reduce((acc, record) => {
            return acc + `${record.date}, ${record.leftPanel}, ${record.pair},${record.rightPanel}\n`;
        }, `date, leftPanel, pair, rightPanel\n`); // corrected column name

        await fs.writeFile(`${slug}.csv`, dataCSV, 'utf8');

        return records;
    } catch (error) {
        console.error('Error scraping the table:', error);
        return [];
    }
}