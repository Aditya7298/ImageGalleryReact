import { useMemo } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { DisplayContainer } from "../displayContainer/DisplayContainer";
import { fakeImageData, fakeSelectedImageId } from "../../fakeData";
import { useImageStore } from "./hooks/useImageStore";
import "./ImageGallery.css";

export const ImageGallery = () => {
  const {
    getAllImages,
    getSelectedImageId,
    editCaption,
    editSelectedImage,
    editImageOrder,
  } = useImageStore(fakeImageData, fakeSelectedImageId);

  const images = useMemo(() => getAllImages(), [getAllImages]),
    selectedImageId = getSelectedImageId(),
    selectedImage = useMemo(
      () => images.find((image) => image.id === selectedImageId),
      [images, selectedImageId]
    );

  return (
    <div className="image-gallery">
      {images.length > 0 && (
        <Sidebar
          images={images}
          selectedImageId={selectedImageId}
          onSelectedImageIdChange={editSelectedImage}
          onImageOrderChange={editImageOrder}
        />
      )}
      {selectedImage && (
        <DisplayContainer
          image={selectedImage}
          onImageCaptionChange={editCaption}
        />
      )}
    </div>
  );
};
