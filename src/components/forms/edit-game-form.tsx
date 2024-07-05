"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddGameFormSchema } from "@/schemas/gameSchema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { onUpdateGame } from "@/actions/games";
import { useToast } from "@/components/ui/use-toast";
import { CheckCheck, CheckCircle, CheckIcon, Loader2 } from "lucide-react";
import { Game } from "@/types";
import { useRouter } from "next/navigation";

type Props = {
    data: Game;
    slug: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditGameForm = ({ data, slug, setOpen }: Props) => {
    const [updating, setUpdating] = useState(false);
    const { toast } = useToast();
    const router = useRouter()

    const form = useForm<z.infer<typeof AddGameFormSchema>>({
        resolver: zodResolver(AddGameFormSchema),
        defaultValues: data,
    });

    async function handleFormSubmit(values: z.infer<typeof AddGameFormSchema>) {
        try {
            setUpdating(true);

            const updatedValues = {
                ...values,
                title: values.title.toUpperCase(),
                openTime: values.openTime.toUpperCase(),
                closeTime: values.closeTime.toUpperCase(),
            };

            const updatedGame = await onUpdateGame(slug, updatedValues);

            if (updatedGame) {
                toast({
                    title: "Game Updated Successfully",
                    icon: <CheckCheck size={18} className="text-white" />,
                    variant: "success"
                });
                setOpen(false);
                router.refresh()
            }
        } catch (error) {
            console.error("Failed to update game:", error);
            toast({
                title: "Error",
                description: "There was an error updating the game.",
            });
        } finally {
            setUpdating(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Game Title" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                            <FormLabel>Close Time</FormLabel>
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
                {updating ? (
                    <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating
                    </Button>
                ) : (
                    <Button type="submit">Update</Button>
                )}
            </form>
        </Form>
    );
};

export default EditGameForm;
