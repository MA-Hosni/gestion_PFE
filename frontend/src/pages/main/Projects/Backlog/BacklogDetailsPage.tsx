import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Check } from "lucide-react";
import TaskTable from "@/components/project/backlog/tasks/task-table";

interface BacklogDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userStoryTitle?: string;
  userStoryDescription?: string;
  userStoryPriority?: string;
  userStoryStartDate?: string;
  userStoryEndDate?: string;
  userStoryStoryPoints?: number;
  userStorySprintName?: string;
}

export function BacklogDetailsDrawer({ 
  open, 
  onOpenChange,
  userStoryTitle,
  userStoryDescription,
  userStoryPriority,
  userStoryStartDate,
  userStoryEndDate,
  userStoryStoryPoints,
  userStorySprintName,
}: BacklogDetailsDrawerProps) {
  const [width, setWidth] = useState(800);
  const isResizing = useRef(false);
  const [title, setTitle] = useState(userStoryTitle ?? "")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [description, setDescription] = useState(userStoryDescription ?? "")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [priority, setPriority] = useState(userStoryPriority ?? "")
  const [startDate, setStartDate] = useState(userStoryStartDate ?? "")
  const [endDate, setEndDate] = useState(userStoryEndDate ?? "")
  const [storyPoints, setStoryPoints] = useState(userStoryStoryPoints ?? 0)

  // Sync state when a different story is selected
  useEffect(() => {
    setTitle(userStoryTitle ?? "")
    setDescription(userStoryDescription ?? "")
    setPriority(userStoryPriority ?? "")
    setStartDate(userStoryStartDate ?? "")
    setEndDate(userStoryEndDate ?? "")
    setStoryPoints(userStoryStoryPoints ?? 0)
    setIsEditingTitle(false)
    setIsEditingDescription(false)
    setIsEditingDetails(false)
  }, [userStoryTitle, userStoryDescription, userStoryPriority, userStoryStartDate, userStoryEndDate, userStoryStoryPoints])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = document.documentElement.clientWidth - e.clientX;
      if (newWidth > 384) {
        setWidth(newWidth);
      } else {
        setWidth(384);
      }
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent style={{ maxWidth: '100vw', width: `${width}px` }}>
        {/* Resize Handle */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-primary/20 transition-all z-50 flex items-center justify-center group"
          onMouseDown={handleMouseDown}
        >
           <div className="h-8 w-1 rounded-full bg-border group-hover:bg-primary transition-colors" />
        </div>
        <div className="no-scrollbar overflow-y-auto p-4">
            <DrawerHeader>
                <DrawerTitle>
                    {isEditingTitle ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => setIsEditingTitle(false)}
                            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                            autoFocus
                            className="text-2xl font-bold h-auto py-2 px-1 w-auto"
                        />
                        ) : (
                        <h1 
                            onClick={() => setIsEditingTitle(true)}
                            className="text-2xl font-bold hover:bg-muted/50 p-1 -ml-1 rounded cursor-pointer transition-colors"
                        >
                            {title}
                        </h1>
                    )}
                </DrawerTitle>
                <DrawerDescription>
                    {isEditingDescription ? (
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={() => setIsEditingDescription(false)}
                            autoFocus
                            className="min-h-25 w-full"
                        />
                        ) : (
                        <p 
                            onClick={() => setIsEditingDescription(true)}
                            className="text-muted-foreground hover:bg-muted/50 p-2 -ml-2 rounded cursor-pointer transition-colors whitespace-pre-wrap"
                        >
                            {description || "Add a description..."}
                        </p>
                    )}
                </DrawerDescription>
            </DrawerHeader>
            <div className="mt-2 border rounded-xl overflow-hidden shadow-sm">
                {/* Details header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b">
                    <span className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">Details</span>
                    <div className="flex items-center gap-1">
                        {isEditingDetails ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1.5 h-7 text-xs text-muted-foreground"
                                    onClick={() => {
                                        setPriority(userStoryPriority ?? "")
                                        setStartDate(userStoryStartDate ?? "")
                                        setEndDate(userStoryEndDate ?? "")
                                        setStoryPoints(userStoryStoryPoints ?? 0)
                                        setIsEditingDetails(false)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1.5 h-7 text-xs"
                                    onClick={() => setIsEditingDetails(false)}
                                >
                                    <Check className="h-3.5 w-3.5" /> Save
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 h-7 text-xs"
                                onClick={() => setIsEditingDetails(true)}
                            >
                                <Edit2 className="h-3.5 w-3.5" /> Edit
                            </Button>
                        )}
                    </div>
                </div>
                {/* Fields */}
                <div className="divide-y">
                    {/* Sprint Name — always disabled */}
                    <div className="flex items-center gap-3 px-4 py-3">
                        <span className="text-xs font-medium text-muted-foreground w-32 shrink-0">Sprint</span>
                        <Input value={userStorySprintName ?? ""} disabled className="h-8 text-sm bg-muted/30 cursor-not-allowed" />
                    </div>
                    {/* Priority */}
                    <div className="flex items-center gap-3 px-4 py-3">
                        <span className="text-xs font-medium text-muted-foreground w-32 shrink-0">Priority</span>
                        <Select value={priority} onValueChange={setPriority} disabled={!isEditingDetails}>
                            <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Lowest">Lowest</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Highest">Highest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Start Date */}
                    <div className="flex items-center gap-3 px-4 py-3">
                        <span className="text-xs font-medium text-muted-foreground w-32 shrink-0">Start Date</span>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            disabled={!isEditingDetails}
                            className="h-8 text-sm"
                        />
                    </div>
                    {/* Due Date */}
                    <div className="flex items-center gap-3 px-4 py-3">
                        <span className="text-xs font-medium text-muted-foreground w-32 shrink-0">Due Date</span>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            disabled={!isEditingDetails}
                            className="h-8 text-sm"
                        />
                    </div>
                    {/* Story Points */}
                    <div className="flex items-center gap-3 px-4 py-3">
                        <span className="text-xs font-medium text-muted-foreground w-32 shrink-0">Story Points</span>
                        <Input
                            type="number"
                            min={0}
                            value={storyPoints}
                            onChange={(e) => setStoryPoints(Number(e.target.value))}
                            disabled={!isEditingDetails}
                            className="h-8 text-sm"
                        />
                    </div>
                </div>
            </div>
            <TaskTable />
        </div>
      </DrawerContent>
    </Drawer>
  )
}