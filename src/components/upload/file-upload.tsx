"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { CloudUploadIcon } from "lucide-react";
import { Label } from "../ui/label";
import { parseCSV } from "@/lib/utils";
import { onUpdateDatabase } from "@/actions/web-scrapper";

const ACCEPTED_FILE_TYPES = ["text/csv"];

const FormSchema = z.object({
    file: z.custom<FileList>((files) => files instanceof FileList && files.length === 1 && ACCEPTED_FILE_TYPES.includes(files[0].type), {
        message: "You can only upload one CSV file",
    })
});

const FileUpload = ({ slug }: { slug: string }) => {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            file: null,
        }
    });
    // async function handleFileChange(event) {
    //     const files = event.target.files;
    //     form.setValue('file', files);
    //     form.trigger('file');
    //     if (files.length === 1 && ACCEPTED_FILE_TYPES.includes(files[0].type)) {
    //         const formData = new FormData();
    //         formData.append("file", files[0]);
    //         await uploadFile(formData);
    //     }
    // }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const formData = new FormData();
            formData.append("file", files[0]);
            try {
                const text = await files[0].text();
                const records = parseCSV(text);
                await onUpdateDatabase(slug, records);
                console.log(records)
            } catch (error) {
                console.log("Function Error", error)
            }
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-6">
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center space-x-2">
                                    <Label
                                        htmlFor="file-upload"
                                        className="inline-flex h-10 cursor-pointer items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600/80 focus:outline-none focus:ring-2 focus:ring-orange-950 focus:ring-offset-2"
                                    >
                                        <CloudUploadIcon className="mr-2 h-5 w-5" />
                                        Import
                                    </Label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".csv"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form >
    );
}


export default FileUpload;