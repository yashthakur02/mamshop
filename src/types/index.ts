
import prisma from '@/lib/db';
import { ReactNode } from 'react';
// export type IconProps = React.HTMLAttributes<SVGElement>

type Base = {
    id?: string,
    createdAt?: Date
    updatedAt?: string
}


export interface Game extends Base {
    title: string,
    slug: string,
    daysCount?: string | null,
    openTime: string,
    closeTime: string,
}
export interface IRecord extends Partial<Game> {
    date: string
    leftPanel: string;
    pair?: string;
    rightPanel?: string;
    result?: string;
}

export interface AddGameInput {
    title: string,
    daysCount?: string,
    openTime: string,
    closeTime: string,
}
export interface IResult {
    gameTitle: string;
    result: string;
    slug: string;
    date: string;
}


export interface EditGameInput extends Partial<AddGameInput> { }


