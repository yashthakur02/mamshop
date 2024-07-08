import * as React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import LoginForm from "@/components/forms/login-form"

type Props = {}

const Auth = (props: Props) => {
    return (
        <div className='bg-gradient-to-br from-red-300 via-orange-300 to-red-300 min-h-screen flex items-center justify-center'>
            <Card className="w-96 bg-white/50 backdrop-blur-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">
                        <span className='text-orange-500'>Mam</span>Shop
                    </CardTitle>
                    <CardDescription>
                        Please Login to access dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <LoginForm />
                </CardContent>
            </Card>

        </div>
    )
}

export default Auth