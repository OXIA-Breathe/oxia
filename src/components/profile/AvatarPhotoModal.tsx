
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Image, X } from "lucide-react";

interface AvatarPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelected: (photoUrl: string) => void;
}

const AvatarPhotoModal = ({ isOpen, onClose, onPhotoSelected }: AvatarPhotoModalProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setShowCamera(true);
      
      // Create video element to show camera preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // For demo purposes, we'll simulate photo capture after 3 seconds
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        const photoUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(photoUrl);
        
        // Stop camera stream
        stream.getTracks().forEach(track => track.stop());
        setShowCamera(false);
      }, 3000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const handleGallerySelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const photoUrl = e.target?.result as string;
          onPhotoSelected(photoUrl);
          onClose();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleUsePhoto = () => {
    if (capturedPhoto) {
      onPhotoSelected(capturedPhoto);
      onClose();
      setCapturedPhoto(null);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    handleTakePhoto();
  };

  const handleCancel = () => {
    setCapturedPhoto(null);
    setShowCamera(false);
    onClose();
  };

  if (capturedPhoto) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preview Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={capturedPhoto}
                alt="Captured photo"
                className="w-48 h-48 object-cover rounded-full border-4 border-gray-200"
              />
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRetakePhoto} variant="outline">
                Take Again
              </Button>
              <Button onClick={handleUsePhoto}>
                Use This Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showCamera) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Taking Photo...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 text-breath animate-pulse" />
              <p className="text-muted-foreground">Get ready! Photo will be taken in 3 seconds...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Photo Option</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Button
            onClick={handleTakePhoto}
            variant="outline"
            className="w-full flex items-center gap-3 h-12"
          >
            <Camera className="w-5 h-5" />
            Take New Photo
          </Button>
          
          <Button
            onClick={handleGallerySelect}
            variant="outline"
            className="w-full flex items-center gap-3 h-12"
          >
            <Image className="w-5 h-5" />
            Use Photo from Gallery
          </Button>
          
          <Button
            onClick={handleCancel}
            variant="ghost"
            className="w-full flex items-center gap-3 h-12"
          >
            <X className="w-5 h-5" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarPhotoModal;
