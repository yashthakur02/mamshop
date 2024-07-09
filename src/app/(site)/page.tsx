
import { onFetchAndUpdateResult } from "@/actions/satta-matka-scrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SpadeIcon } from "lucide-react";
import Link from "next/link";
export const revalidate = 0


export default async function Home() {

    const games = await onFetchAndUpdateResult()

    console.log(games)
    return (
        <main className="min-h-screen my-4 mx-3 space-y-4">
            <Card className=" border-orange-400 overflow-hidden">
                <CardHeader className="items-center justify-center text-center">
                    <CardTitle className="leading-8 text-lg md:text-xl xl:text-2xl">Welcome to <span className="text-orange-500 underline underline-offset-2 font-extrabold"><b className="text-black">Mam</b>Shop</span> Matka Official Site</CardTitle>
                    <CardDescription className="text-xs  md:text-sm">Get Official and Fastest Mamshop Results and Mamshop Charts</CardDescription>
                </CardHeader>
            </Card>
            <Card className=" border-yellow-300 overflow-hidden">
                <CardHeader className="items-center justify-center text-center">
                    <CardDescription className="text-xs md:text-sm font-medium">
                        Mamshop Matka is the ultimate destination for Satta Matka, Kalyan Matka, Satta Market and SattaMatka game lovers. With our experience in the field, we can assist you through every step of Satta Market to maximize your winnings. Find {`India's`} best Matka Result website here! Get weeklylines game updates along with Date Repair and free Matka Number Guessing Formula. We also provide Morning Syndicate Matka Bazar Syndicate Night Results directly from the Matka industry. Visit us daily for the fastest Matka tips & tricks in our Matka Guessing forum. {`Don't`} forget to bookmark this site for easy access. Thankyou!
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card className=" overflow-hidden border-pink-300">
                <CardHeader className="items-center justify-center p-2 border-b border-b-pink-300 bg-pink-200">
                    <CardTitle className="sm:text-lg text-base italic [text-shadow:_0_1px_0_rgb(255_0_0_/_40%)] font-semibold">Today Satta Matka Lucky Number</CardTitle>
                </CardHeader>
                <CardContent className="py-3 grid grid-cols-2 italic font-bold">
                    <div className="flex flex-col items-center justify-center border-r border-r-pink-300 ">
                        <h4 className="text-red-500 [text-shadow:_0_2px_2px_rgb(0_0_0_/_40%)] sm:text-lg text-base">Shubh Ank</h4>
                        <span className="[text-shadow:_0_1px_0_rgb(255_0_0_/_40%)] sm:text-base text-sm">2-5-8-9</span>
                    </div>
                    <div className="flex flex-col items-center justify-center [text-shadow:_0_2px_2px_rgb(0_0_0_/_40%)] ">
                        <h3 className="text-red-500 *:italic sm:text-lg text-base font-bold ">Final Ank</h3>
                        <span className="[text-shadow:_0_1px_0_rgb(255_0_0_/_40%)] sm:text-base text-sm">K-2, M-6</span>
                    </div>
                </CardContent>
            </Card>
            <Card className=" border-sky-500 overflow-hidden">
                <CardHeader className="items-center justify-center p-2 border-b border-b-sky-300 bg-sky-200">
                    <CardTitle className="sm:text-lg text-base font-bold uppercase">Results Board</CardTitle>
                </CardHeader>
                <CardContent className=" p-0 bg-slate-200/50">
                    {games ? (
                        games.map((game, idx) => {
                            const isLastItem = idx === games.length - 1;
                            return (
                                <div className={`flex items-center justify-between p-3 
              ${isLastItem ? "" : "border-b"} border-sky-300
              ${game?.title?.includes("MAMSHOP") ? "bg-lime-200" : "bg-white"}
              `} key={game.slug}>
                                    <Link
                                        href={`/records/${game.slug}-jodi-chart`}
                                        className="bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 p-1 px-5 text-xs  rounded-se-xl rounded-bl-xl text-white md:text-sm"
                                    >
                                        Jodi
                                    </Link>
                                    <div className="flex items-center justify-center flex-col gap-1">
                                        <h3 className="font-medium text-red-600  text-sm md:text-lg [text-shadow:_0_1px_1px_rgb(0_0_0_/_49%)] md:italic ">{game.title}</h3>
                                        <span className="font-semibold md:text-lg md:italic text-base">
                                            {game.result ? game.result : "Loading..."}
                                        </span>
                                    </div>
                                    <Link href={`/records/${game.slug}-panel-chart`} className="bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 p-1 px-5 text-xs  rounded-se-xl rounded-bl-xl text-white md:text-sm">
                                        Panel
                                    </Link>
                                </div>
                            )
                        })
                    ) : (
                        <div></div>
                    )}
                </CardContent>
            </Card>
            <Card className=" overflow-hidden border-orange-300">
                <CardHeader className="items-center justify-center p-2 border-b border-b-orange-300 bg-orange-200">
                    <CardTitle className="sm:text-lg text-base [text-shadow:_0_1px_0_rgb(255_0_0_/_40%)] font-semibold">All Matka Time Table</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className='w-full'>
                        <thead className='bg-yellow-600 text-white md:text-base text-sm'>
                            <tr>
                                <th className='p-2' >Market</th>
                                <th className='p-2' >Open</th>
                                <th className='p-2' >Close</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map((game, idx) => {
                                const isLastItem = idx === games.length - 1;
                                return (
                                    <tr className="py-2 text-center text-xs md:text-sm uppercase" key={game.slug}>
                                        <td className={`py-2 text-red-600 font-semibold uppercase ${isLastItem ? "" : "border-b-2"} border-r-2`}>{game?.title}</td>
                                        <td className={`py-2  ${isLastItem ? "" : "border-b-2"} border-r-2 font-medium`}>{game?.openTime}</td>
                                        <td className={`py-2  ${isLastItem ? "" : "border-b-2"} font-medium`}>{game?.closeTime}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </CardContent>
            </Card>
            {/* Panel Chart Section */}
            <Card className=" overflow-hidden border-green-300">
                <CardHeader className="items-center justify-center p-2 border-b border-b-green-300 bg-green-200">
                    <CardTitle className="sm:text-lg text-base [text-shadow:_0_1px_0_rgb(255_0_0_/_40%)] font-semibold">All Matka All Matka Panel Charts</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-center flex flex-col items-center justify-center">
                    {games.map((game, idx) => {
                        const isLastItem = idx === games.length - 1;
                        return (
                            <div className={`${isLastItem ? "" : "border-b border-b-teal-300"} md:text-center  w-full p-4`} key={game.slug}>
                                <Link href={`/records/${game.slug}-panel-chart`} className="uppercase text-indigo-700  font-semibold sm:text-base text-sm flex items-center md:justify-center gap-2">
                                    <SpadeIcon className="text-red-500 fill-red-500" size={16} /> {game.title} Panel Chart
                                </Link>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
            {/* Jodi Chart Section */}
            <Card className=" overflow-hidden border-teal-300">
                <CardHeader className="items-center justify-center p-2 border-b border-b-teal-300 bg-teal-200">
                    <CardTitle className="sm:text-lg text-base [text-shadow:_0_1px_0_rgb(255_0_0_/_40%)] font-semibold">All Matka All Matka Jodi Charts</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-center flex flex-col items-center justify-center">
                    {games.map((game, idx) => {
                        const isLastItem = idx === games.length - 1;
                        return (
                            <div className={`${isLastItem ? "" : "border-b border-b-teal-300"} text-start md:text-center w-full p-4`} key={game.slug}>
                                <Link href={`/records/${game.slug}-jodi-chart`} className="uppercase text-indigo-700  font-semibold sm:text-base text-sm flex items-center md:justify-center gap-2">
                                    <SpadeIcon className="text-red-500 fill-red-500" size={16} /> {game.title} Jodi Chart
                                </Link>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </main>
    );
}

{/* <>
    <span className="color:red;font-size:21px;">MILAN DAY</span>
    <span className="color:red;font-size:21px;">RAJDHANI DAY</span>
    <span className="color:red;font-size:21px;">MORNING SYNDICATE</span>
    <span className="color:red;font-size:21px;">BOMBAY BAZAR DAY</span>
    <span className="color:blue;font-size:23px;">237-2</span>
    <span className="color:blue;font-size:23px;">236-1</span>
    <span className="color:blue;font-size:23px;">680-4</span>
    <span className="color:blue;font-size:23px;">Loading…</span>
</> */}
