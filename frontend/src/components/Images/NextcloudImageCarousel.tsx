import { useState, useEffect } from "react";
import { useNextcloudGetImage } from "@/endpoints/gubenComponents";
import { BaseImgTag } from "../ui/BaseImgTag";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NextCloudClickableImage } from "@/components/Images/NextcloudImageGallery";

export interface Image {
  filename: string;
  directory?: string;
}

interface IProps {
  images: Image[];
}

export function NextcloudImageCarousel({ images }: IProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images[currentIndex];

  const fullFilename = currentImage.directory + "/" + currentImage.filename;

  const { data: imageData, isLoading, isError } = useNextcloudGetImage({
    queryParams: { filename: currentImage.filename, directory: currentImage.directory },
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageData instanceof Blob) {
      const url = URL.createObjectURL(imageData);
      setImageUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [imageData]);

  if (!images.length) return <div>No images available</div>;

  const onPrevious = () => setCurrentIndex(i => Math.max(0, i - 1));
  const onNext = () => setCurrentIndex(i => Math.min(images.length - 1, i + 1));

  return (
    <div className="block max-w-md mx-auto text-center relative"
      style={{ breakInside: "avoid" }}>
      <div className="relative">
        {isLoading && <div>Loading image...</div>}
        {isError && <div>Failed to load image</div>}

        {!isLoading && !isError && imageUrl && (
          <NextCloudClickableImage imageFilename={fullFilename} />
        )}

        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="group absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-300 bg-opacity-70 rounded-full p-2 disabled:opacity-50"
          aria-label="Previous Image">
          <ChevronLeft className="w-6 h-6 text-gray-800 group-hover:text-red-500" />
        </button>

        <button
          onClick={onNext}
          disabled={currentIndex === images.length - 1}
          className="group absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-300 bg-opacity-70 rounded-full p-2 disabled:opacity-50"
          aria-label="Next Image">
          <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-red-500" />
        </button>
      </div>
      <div className="mt-2 font-semibold text-lg">
        {decodeURIComponent(
          currentImage.filename?.match(/\/Images\/[^/]+\/([^/.]+)/)?.[1] ?? ""
        )}
      </div>

      <div className="mt-1 text-sm text-gray-600">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
