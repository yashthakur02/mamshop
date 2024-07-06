"use client"

import React, { useEffect, useState } from 'react';
import { EyeIcon, Loader2, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import Modal from '../modal';
import { onDeleteGame, onGetGame } from '@/actions/games';
import EditGameForm from '../forms/edit-game-form';
import { Game } from '@/types';


type Props = {
    slug: string;
}

const GamesAction = ({ slug }: Props) => {
    const [game, setGame] = useState<Game | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const handleUpdate = async (id: string) => {
        try {
            const fetchedGame: Game | any = await onGetGame(id);
            if (fetchedGame) {
                setGame(fetchedGame);
            }
        } catch (error) {
            console.error("Failed to fetch game:", error);
        }
    };

    const handleDeleteGame = async (slug: string) => {
        await onDeleteGame(slug)
    }


    useEffect(() => {
        if (open) {
            handleUpdate(slug);
        }
    }, [open, slug]);

    return (
        <div className="flex items-center gap-4">
            <Modal
                open={open}
                setOpen={setOpen}
                title="Update Game"
                trigger={
                    <Button onClick={() => setOpen(true)} size={'icon'} className="w-8 h-8">
                        <PencilIcon size={14} />
                    </Button>
                }
            >
                {game ? (
                    <EditGameForm slug={slug} data={game} setOpen={setOpen} />
                ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                        <Loader2 className='mr-2 animate-spin' />
                    </div>
                )}
            </Modal>
            <Button onClick={() => handleDeleteGame(slug)} size={'icon'} variant={'destructive'} className="w-8 h-8">
                <Trash2Icon size={14} />
            </Button>
        </div>
    );
};

export default GamesAction;
