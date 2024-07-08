"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddGameFormSchema } from "@/schemas/gameSchema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useState } from "react"
import { onCreateGame } from "@/actions/games"
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react"
import { format } from "date-fns"


type Props = {}

const AddGameForm = (props: Props) => {

    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof AddGameFormSchema>>({
        resolver: zodResolver(AddGameFormSchema),
        defaultValues: {
            title: "",
            openTime: "",
            closeTime: "",
            daysCount: ""
        },
    })

    async function handleFormSubmit(values: z.infer<typeof AddGameFormSchema>) {

        try {
            const title = values.title.toUpperCase();
            const openTime = values.openTime.toUpperCase();
            const closeTime = values.closeTime.toUpperCase();

            setLoading(true)
            const game = await onCreateGame({ ...values, title, openTime, closeTime })
            if (game) {
                toast({
                    title: "Game Added Successfully",
                    description: format(Date.now(), "EEE dd MMM, yyyy"),
                    variant: "success"
                })
                form.reset()
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Game Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="openTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Open Time</FormLabel>
                            <FormControl>
                                <Input placeholder="Open Time" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="closeTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CLose Time</FormLabel>
                            <FormControl>
                                <Input placeholder="Close Time" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="daysCount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Days Count</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select days count" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="6">6</SelectItem>
                                    <SelectItem value="7">7</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {loading ?
                    <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </Button>
                    :
                    <Button type="submit">Add Game</Button>
                }
            </form>
        </Form>
    )
}

export default AddGameForm