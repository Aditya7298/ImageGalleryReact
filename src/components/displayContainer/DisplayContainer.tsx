import { ImageInfo } from "../../ts/interfaces/ImageInfo.interface";
import "./DisplayContainer.css";

interface DisplayContainerProps {
  image: ImageInfo;
  onImageCaptionChange: (imageId: string, newCaption: string) => void;
}

export const DisplayContainer = ({
  image,
  onImageCaptionChange,
}: DisplayContainerProps) => {
  const { id, src, caption } = image;

  const handleImageCaptionChange = (
    evt: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newCaption = evt.target.value;
    onImageCaptionChange(id, newCaption);
  };

  return (
    <div className="display-container">
      <img
        className="display-container_image"
        height="400px"
        width="200px"
        src={src}
        alt={caption}
      />
      <textarea
        className="display-container_caption"
        value={caption}
        onChange={handleImageCaptionChange}
      ></textarea>
    </div>
  );
};
