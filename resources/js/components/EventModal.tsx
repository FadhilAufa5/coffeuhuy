"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  date: string;
  description: string;
  image: string;
}

export default function EventModal({
  open,
  onClose,
  title,
  date,
  description,
  image,
}: EventModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{date}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <img src={image} alt={title} className="w-full h-52 object-cover rounded-lg" />
          <p className="text-gray-700 dark:text-gray-300">{description}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
