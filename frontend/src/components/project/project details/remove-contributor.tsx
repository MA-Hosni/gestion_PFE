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
import { Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface RemoveContributorDialogProps {
    contributor: { id: string; name: string };
    onConfirm: (id: string) => Promise<void>;
}

export function RemoveContributorDialog({ contributor, onConfirm }: RemoveContributorDialogProps) {
    const [name, setName] = useState("")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        if (name !== contributor.name) {
            toast.error("Name does not match")
            return
        }
        setLoading(true)
        try {
            await onConfirm(contributor.id)
            setOpen(false)
            setName("")
        } finally {
            setLoading(false)
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
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleConfirm}
                        disabled={name !== contributor.name || loading}
                    >
                        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                        Remove
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
