"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "../ui/use-toast"
import { useState } from "react"
import { LoginSchema } from "@/schemas/auth.schema"
import { Loader2 } from "lucide-react"

type Props = {}

const LoginForm = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const handleLogin = async () => {

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input id="email" type="email" className="focus-visible:ring-orange-300 focus-visible:outline-none transition duration-300" placeholder="someone@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input id="password" type="password" className="focus-visible:ring-orange-300 focus-visible:outline-none transition duration-300" placeholder="**********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {loading ? (
                    <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating
                    </Button>
                ) : (
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-600/80 transition duration-300">SignIn</Button>
                )}
            </form>
        </Form>
    )
}

export default LoginForm;
