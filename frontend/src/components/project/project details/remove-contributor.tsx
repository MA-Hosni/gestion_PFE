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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner" // Assuming you have toast, if not I will use alert or just simple logic

interface RemoveContributorDialogProps {
    contributor: { id: string; name: string };
    onConfirm: (id: string) => void;
}

export function RemoveContributorDialog({ contributor, onConfirm }: RemoveContributorDialogProps) {
    const [name, setName] = useState("")
    const [open, setOpen] = useState(false)

    const handleConfirm = () => {
        if (name === contributor.name) {
            onConfirm(contributor.id)
            setOpen(false)
            setName("")
            toast.success("Contributor removed successfully")
        } else {
            toast.error("Name does not match")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8">
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Remove Contributor</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. To confirm, please type <span className="font-bold text-foreground">"{contributor.name}"</span> below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-name">
                            Full Name
                        </Label>
                        <Input
                            id="confirm-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={contributor.name}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleConfirm}
                        disabled={name !== contributor.name}
                    >
                        Remove
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
