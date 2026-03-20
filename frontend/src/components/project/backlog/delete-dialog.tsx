import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

interface DeleteDialogProps {
    itemType: string;
    itemName: string;
    onConfirm?: () => void;
    variant?: "ghost" | "outline";
}

export function DeleteDialog({ itemType, itemName, onConfirm, variant = "ghost" }: DeleteDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={variant} size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8">
                    <Trash2 className="size-4" />
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
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button 
                            variant="destructive" 
                            onClick={onConfirm}
                        >
                            Confirm
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
