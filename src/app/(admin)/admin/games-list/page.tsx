import { getGames, onGetGame } from '@/actions/games'
import BreadCrumb from '@/components/dashboard/BreadCrumb'
import React from 'react'
import { columns } from './column'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Modal from '@/components/modal'
import AddGameForm from '@/components/forms/add-game-form'
import SectionHeader from '@/components/header/sextion-header'
import { Game } from '@/types'
import { DataTable } from '@/components/table/data-table'
import UpdateGame from '@/components/action/update-games'

type Props = {}


const AllGames = async (props: Props) => {
    const games: Game[] | any = await getGames()

    console.log(games)

    return (
        <div className='flex flex-col gap-4'>
            <BreadCrumb />
            <SectionHeader title='Games List'>
                <UpdateGame />
                <Modal
                    title="Add new Game"
                    trigger={
                        <Button size={"sm"} ><PlusIcon size={18} /></Button>
                    }
                >
                    <AddGameForm />
                </Modal>
            </SectionHeader>
            <DataTable columns={columns} data={games} />
        </div>
    )
}

export default AllGames