import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NextCloudClickableImage } from "@/components/Images/NextcloudImageGallery";

export interface Image {
  filename: string;   //full url if external is set to true
  directory?: string;
  external?: boolean;
  previewUrl?: string;
}

interface IProps {
  images: Image[];
}

export function NextcloudImageCarousel({ images }: IProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images[currentIndex];

  const handlePrevious = () => setCurrentIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex(i => Math.min(images.length - 1, i + 1));

  if (!images.length) return <div>No images available</div>;

  const carouselProps = {
    currentIndex,
    totalImages: images.length,
    onPrevious: currentIndex > 0 ? handlePrevious : undefined,
    onNext: currentIndex < images.length - 1 ? handleNext : undefined,
    images: images.map(img => {
      const fullUrl = img.external
        ? img.filename : img.filename.includes("remote.php/webdav")
        ? img.filename : `${img.directory}/${img.filename}`;

      const previewUrl = img.external
        ? img.filename
        : `${import.meta.env.VITE_NEXTCLOUD_URL}/index.php/core/preview.png?file=Guben/Images/${img.directory}/${img.filename}&x=800&y=600&a=true`;

      return {
        filename: fullUrl,
        previewUrl,
        isExternal: img.external
      };
    })
  };

  return (
    <div className="block max-w-md mx-auto text-center relative" style={{ breakInside: "avoid" }}>
      {currentImage.external ? (
        <ExternalImageCarousel
          image={currentImage}
          currentIndex={currentIndex}
          total={images.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          carouselProps={carouselProps}
        />
      ) : (
        <InternalImageCarousel
          image={currentImage}
          currentIndex={currentIndex}
          total={images.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          carouselProps={carouselProps}
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
  carouselProps,
}: {
  image: Image;
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  carouselProps: any;
}) => {

  const previewImage = image.previewUrl ?? `${import.meta.env.VITE_NEXTCLOUD_URL}/index.php/core/preview.png?file=/Guben/Images/${image.directory}/${image.filename}&x=800&y=600&a=true`;

  const fullFilename = image.filename.includes("remote.php/webdav") 
    ? image.filename 
    : `${image.directory}/${image.filename}`;

  return (
    <>
      <NextCloudClickableImage 
        previewImage={previewImage}
        imageFilename={fullFilename}
        carouselProps={carouselProps}
      />

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
  carouselProps,
}: {
  image: Image;
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  carouselProps: any;
}) => {
  return (
    <>
      <NextCloudClickableImage 
        imageFilename={image.filename}
        previewImage="" //not used for external Images
        isExternal={true}
        carouselProps={carouselProps}
      />
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