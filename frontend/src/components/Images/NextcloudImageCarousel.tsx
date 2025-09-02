import { useState, useEffect } from "react";
import { useNextcloudGetImage } from "@/endpoints/gubenComponents";
import { BaseImgTag } from "../ui/BaseImgTag";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NextCloudClickableImage } from "@/components/Images/NextcloudImageGallery";

export interface Image {
  filename: string;   //full url if external is set to true
  directory?: string;
  external?: boolean;
}

interface IProps {
  images: Image[];
}

export function NextcloudImageCarousel({ images }: IProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images[currentIndex];

  if (!images.length) return <div>No images available</div>;

  return (
    <div className="block max-w-md mx-auto text-center relative" style={{ breakInside: "avoid" }}>
      {currentImage.external ? (
        <ExternalImageCarousel
          image={currentImage}
          currentIndex={currentIndex}
          total={images.length}
          onPrevious={() => setCurrentIndex(i => Math.max(0, i - 1))}
          onNext={() => setCurrentIndex(i => Math.min(images.length - 1, i + 1))}
        />
      ) : (
        <InternalImageCarousel
          image={currentImage}
          currentIndex={currentIndex}
          total={images.length}
          onPrevious={() => setCurrentIndex(i => Math.max(0, i - 1))}
          onNext={() => setCurrentIndex(i => Math.min(images.length - 1, i + 1))}
        />
      )}
    </div>
  );
}

const InternalImageCarousel = ({
  image,
  currentIndex,
  total,
  onPrevious,
  onNext,
}: {
  image: Image;
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { data: imageData, isLoading, isError } = useNextcloudGetImage({
    queryParams: { filename: image.filename, directory: image.directory },
  });

  useEffect(() => {
    if (imageData instanceof Blob) {
      const url = URL.createObjectURL(imageData);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageData]);

  const fullFilename = image.filename.includes("remote.php/webdav") ? image.filename : `${image.directory}/${image.filename}`;

  return (
    <>
      {isLoading && <div>Loading image...</div>}
      {isError && <div>Failed to load image</div>}

      {!isLoading && !isError && imageUrl && (
        <NextCloudClickableImage imageFilename={fullFilename} />
      )}

      <CarouselControls
        currentIndex={currentIndex}
        total={total}
        onPrevious={onPrevious}
        onNext={onNext}
        filename={image.filename}
      />
    </>
  );
};

const ExternalImageCarousel = ({
  image,
  currentIndex,
  total,
  onPrevious,
  onNext,
}: {
  image: Image;
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  return (
    <>
      <NextCloudClickableImage imageFilename={image.filename} isExternal={true} />
      <CarouselControls
        currentIndex={currentIndex}
        total={total}
        onPrevious={onPrevious}
        onNext={onNext}
        filename={image.filename}
      />
    </>
  );
};

const CarouselControls = ({
  currentIndex,
  total,
  onPrevious,
  onNext,
  filename,
}: {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  filename: string;
}) => (
  <>
    <button
      onClick={onPrevious}
      disabled={currentIndex === 0}
      className="group absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-300 bg-opacity-70 rounded-full p-2 disabled:opacity-50"
      aria-label="Previous Image"
    >
      <ChevronLeft className="w-6 h-6 text-gray-800 group-hover:text-red-500" />
    </button>

    <button
      onClick={onNext}
      disabled={currentIndex === total - 1}
      className="group absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-300 bg-opacity-70 rounded-full p-2 disabled:opacity-50"
      aria-label="Next Image"
    >
      <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-red-500" />
    </button>

    <div className="mt-2 font-semibold text-lg">
      {decodeURIComponent(filename?.match(/\/Images\/[^/]+\/([^/.]+)/)?.[1] ?? "")}
    </div>
    <div className="mt-1 text-sm text-gray-600">
      {currentIndex + 1} / {total}
    </div>
  </>
);