import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2, Loader2 } from "lucide-react"

interface DeleteDialogProps {
    itemType: string;
    itemName: string;
    onConfirm?: () => void | Promise<void>;
    varient?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function DeleteDialog({ varient = "outline", itemType, itemName, onConfirm }: DeleteDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        setLoading(true)
        try {
            await onConfirm?.()
            setOpen(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={varient} size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8">
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete {itemType}</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {itemType.toLowerCase()} <span className="font-bold text-foreground">"{itemName}"</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
