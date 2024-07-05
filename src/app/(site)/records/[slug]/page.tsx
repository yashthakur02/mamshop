import { onGetRecord } from '@/actions/records';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDaysOfWeek, parseDate } from '@/lib/utils';
import { IRecord } from '@/types';
import { addDays, format } from 'date-fns';
import React from 'react';

type Props = {};

const chunkArray = (arr: IRecord[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

const isRed = (pair: string | null) => {
    const [firstDigit, secondDigit] = pair?.split('')!;
    // Check if either firstDigit or secondDigit is "*"
    if (firstDigit === '*' || secondDigit === '*') {
        return true;
    }
    // Check if pair has two identical digits
    if (firstDigit === secondDigit) {
        return true;
    }
    // Check if the first digit is 5 less than the second digit or vice versa
    if (Math.abs(Number(firstDigit) - Number(secondDigit)) === 5) {
        return true;
    }
    return false;
};

const Record = async ({ params }: { params: { slug: string } }) => {
    const isPanelChart = params.slug.includes('panel-chart');
    const slug = params.slug.replace(isPanelChart ? '-panel-chart' : '-jodi-chart', '');
    const data: IRecord | any = await onGetRecord(slug);


    if (!data) {
        return (
            <div className='max-w-2xl mx-auto my-3'>
                <Card className="overflow-hidden border-pink-300">
                    <CardContent className="py-3 grid grid-cols-2 italic font-bold">
                        <div>No Results Found</div>
                    </CardContent>
                </Card>
            </div>

        )
    }

    const noRecords = !data || !data.records || data.records.length === 0;

    const startDate = data.records.reverse()[0].date;
    const days = startDate ? getDaysOfWeek(data.records?.[0].date, data.daysCount) : [];
    console.log(startDate, data.records?.[0].date, data.records.reverse()[0])
    const chunkedData = chunkArray(data.records.reverse() || [], days.length);
    console.log(startDate, data.records?.[0].date)
    const generateDate = (datestr: string) => {
        const startDate = parseDate(datestr);
        const endDate = addDays(startDate!, data.daysCount - 1)
        const date = format(endDate!, 'dd/MM/yyyy');
        return date;
    }

    // console.log(chunkedData)

    return (
        <div className='max-w-4xl md:mx-auto min-h-screen space-y-4 my-4'>
            <div className='mx-3 lg:mx-0'>
                <Card className="overflow-hidden border-pink-300">
                    <CardHeader className="items-center justify-center p-2 border-b border-b-pink-300 bg-pink-200">
                        <CardTitle className="text-xl italic [text-shadow:_0_1px_0_rgb(255_0_0_/_40%)] font-semibold">Today Satta Matka Lucky Number</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 grid grid-cols-2 italic font-bold">
                        <div className="flex flex-col items-center justify-center border-r border-r-pink-300">
                            <h4 className="text-red-500 [text-shadow:_0_2px_2px_rgb(0_0_0_/_40%)] text-lg">Shubh Ank</h4>
                            <span className="[text-shadow:_0_1px_0_rgb(255_0_0_/_40%)]">1-2-3-4</span>
                        </div>
                        <div className="flex flex-col items-center justify-center [text-shadow:_0_2px_2px_rgb(0_0_0_/_40%)]">
                            <h3 className="text-red-500 italic text-lg font-bold">Final Ank</h3>
                            <span className="[text-shadow:_0_1px_0_rgb(255_0_0_/_40%)]">K-2, M-6</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {noRecords ? (
                <Card className="overflow-hidden border-red-300">
                    <CardContent className='p-5 text-center font-semibold text-red-500'>No Record Found</CardContent>
                </Card>
            ) : (
                <>
                    <table className='w-full'>
                        <thead className='bg-yellow-600 text-white md:text-base text-[12px]'>
                            <tr>
                                {isPanelChart && <th className='p-3 px-0'>Date</th>}
                                {days.map((day, idx) => (
                                    <th className='p-2' key={idx}>{day.slice(0, 3)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {chunkedData.map((chunk, chunkIndex) => {
                                return (
                                    <tr className='border-2' key={chunkIndex}>
                                        {isPanelChart && (
                                            <td className="text-red text-[10px] md:text-sm text-center font-semibold py-2 flex md:block w-full px-0 justify-center">
                                                {chunk[0].date} <br /> to <br /> {generateDate(chunk[0].date!)}
                                            </td>
                                        )}
                                        {chunk.map((data: IRecord, idx: number) => (
                                            <td className={`${isRed(data?.pair!) ? "text-red" : ""} border-2 ${isPanelChart ? "" : "p-3"}`} key={idx}>
                                                <div className="flex items-center justify-around">
                                                    {isPanelChart && (
                                                        <>
                                                            <span className="text-upright writing-vertical-lr text-[8px] md:text-sm xs:text-[10px] font-medium">{data.leftPanel.replace(/\s+/g, '')}</span>
                                                            <span className=' font-bold'>{data.pair}</span>
                                                            <span className="text-upright writing-vertical-lr text-[10px] md:text-sm font-medium">{data.rightPanel!.replace(/\s+/g, '')}</span>
                                                        </>
                                                    )}
                                                    {!isPanelChart && <div>{data.pair}</div>}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Record;
