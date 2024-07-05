"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditRecordFormSchema } from "@/schemas/gameSchema"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { onUpdateRecord } from "@/actions/records"
import { IRecord } from "@/types"
import { revalidatePath } from "next/cache"
import { useRouter } from "next/navigation"


type Props = {
    record: IRecord
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditRecordForm = ({ record, setOpen }: Props) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof EditRecordFormSchema>>({
        resolver: zodResolver(EditRecordFormSchema),
        defaultValues: record
    })

    async function handleFormSubmit(values: z.infer<typeof EditRecordFormSchema>) {
        try {
            setLoading(true)
            const updatedRecord = await onUpdateRecord(record.id!, { ...values, })
            if (updatedRecord) {
                toast({
                    title: "Record Updated Succefully",
                })
                form.reset()
            }
            setLoading(false)
            setOpen(false)
            router.refresh()
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
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted"
                                    )}
                                    disabled
                                >
                                    {formatDate(field.value)}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
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
                                <Input placeholder="Enter Game Title" {...field} />
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
                                <Input placeholder="Close Time" {...field} value={"36"} disabled />
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
                        Updating...
                    </Button>
                    :
                    <Button type="submit" className="w-full">Update</Button>
                }
            </form>
        </Form>
    )
}

export default EditRecordForm