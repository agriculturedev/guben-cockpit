import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNextcloudGetImage } from "@/endpoints/gubenComponents";
import { BaseImgTag } from "@/components/ui/BaseImgTag";
import { cn } from "@/lib/utils";
import { FilesResponse } from "@/endpoints/gubenSchemas";

interface NextcloudImageGalleryProps {
  images?: FilesResponse[];
  className?: string;
}

export const NextcloudImageGallery = ({ images, className }: NextcloudImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4", className)}>
        {images?.map((image, index) => (
          <NextcloudImage
            key={image.filename}
            filename={image.filename}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>

      {selectedImageIndex !== null && images?.[selectedImageIndex] && (
        <ImageDialog
          filename={images[selectedImageIndex].filename}
          onClose={handleClose}
        />
      )}
    </>
  );
};

interface NextcloudImageProps {
  filename?: string;
  onClick?: () => void;
}

const NextcloudImage = ({ filename, onClick }: NextcloudImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: imageData, isLoading, isError } = useNextcloudGetImage({
    queryParams: { filename }
  });

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (imageData instanceof Blob) {
      const url = URL.createObjectURL(imageData);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageData]);

  if (isLoading || !imageUrl) {
    return (
      <div className="aspect-square bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        <span className="text-sm text-gray-400">{isLoading ? "Loading..." : "Failed to load"}</span>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer rounded-md overflow-hidden border hover:scale-102 transition-all duration-200"
      onClick={onClick}
    >
      <div className="mt-2 font-semibold text-lg">
        {decodeURIComponent(
          filename?.match(/\/Images\/[^/]+\/([^/.]+)/)?.[1] ?? ""
        )}
      </div>
      <BaseImgTag
        src={imageUrl}
        alt={filename || "Nextcloud image"}
        className="w-full h-full object-cover aspect-square"
      />
    </div>
  );
};

interface ImageDialogProps {
  filename: string;
  onClose: () => void;
}

const ImageDialog = ({ filename, onClose }: ImageDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: imageData } = useNextcloudGetImage({ queryParams: { filename } });

  useEffect(() => {
    if (imageData instanceof Blob) {
      const url = URL.createObjectURL(imageData);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageData]);

  return (
    <Transition show={true} as={Fragment}>
      <Dialog onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4 bg-black/70">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] p-4 overflow-auto shadow-xl relative">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                ✕
              </button>
              {imageUrl ? (
                <BaseImgTag
                  src={imageUrl}
                  alt={filename}
                  className="w-full h-auto max-h-[80vh] object-contain mx-auto"
                />
              ) : (
                <div className="text-center text-gray-500">Loading image...</div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
