import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

type SideSheetProps = {
    trigger: React.ReactNode
    title?: string
    description?: string
    children: React.ReactNode
    className?: string
}

export const SideSheet = ({
    trigger,
    title,
    description,
    children,
    className,
}: SideSheetProps) => {
    return (
        <Sheet >
            <SheetTrigger className={className} asChild>{trigger}</SheetTrigger>
            <SheetContent side={"left"}>
                <SheetHeader>
                    <SheetTitle>One</SheetTitle>
                    <SheetDescription>I am Cone</SheetDescription>
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    )
}
