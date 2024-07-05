"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddRecordFormSchema } from "@/schemas/gameSchema"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { cn, genAnk } from "@/lib/utils"
import { onCreateRecord } from "@/actions/records"


type Props = {
    gameId: string
}

const AddRecordForm = ({ gameId }: Props) => {

    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof AddRecordFormSchema>>({
        resolver: zodResolver(AddRecordFormSchema),
        defaultValues: {
            leftPanel: "",
            rightPanel: "",
            pair: "",
            date: new Date(),
        },
    })

    async function handleFormSubmit(values: z.infer<typeof AddRecordFormSchema>) {
        console.log(values)
        const formattedDate = values.date ? format(values.date, "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy");
        try {
            setLoading(true)
            const record = await onCreateRecord(gameId, { ...values, date: formattedDate })
            if (record) {
                toast({
                    title: "Record Created Succefully",
                })
                form.reset()
            }
            setLoading(false)
        } catch (error: any) {
            toast({
                title: error.message,
                variant: "danger"
            })
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Select Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Your date of birth is used to calculate your age.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="leftPanel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Left Panel</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter Game Title"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pair"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jodi</FormLabel>
                            <FormControl>
                                <Input placeholder="Close Time" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rightPanel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Right Panel</FormLabel>
                            <FormControl>
                                <Input placeholder="Open Time" {...field} />
                            </FormControl>
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
                    <Button type="submit">Submit</Button>
                }
            </form>
        </Form>
    )
}

export default AddRecordForm