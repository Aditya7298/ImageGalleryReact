import React from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { DisplayContainer } from "../displayContainer/DisplayContainer";
import { Model } from "../../model";
import { ImageInfo } from "../../ts/interfaces/ImageInfo.interface";
import "./ImageGallery.css";

interface ImageGalleryProps {
  model: Model;
}

interface ImageGalleryState {
  images: ImageInfo[];
  selectedImageId: string;
}

export class ImageGallery extends React.Component<
  ImageGalleryProps,
  ImageGalleryState
> {
  state: ImageGalleryState;

  constructor(props: ImageGalleryProps) {
    super(props);
    this.state = {
      images: [],
      selectedImageId: "",
    };
  }

  componentDidMount() {
    const images = this.props.model.getAllImages();
    const selectedImageId = this.props.model.getSelectedImageId();
    this.setState({ images, selectedImageId });
  }

  handleSelectedImageIdChange = (newSelectedImageId: string) => {
    this.setState({ selectedImageId: newSelectedImageId });
    this.props.model.editSelectedImageId(newSelectedImageId);
  };

  handleImageCaptionChange = (imageId: string, newCaption: string) => {
    this.setState((prevState) => ({
      images: prevState.images.map((image) =>
        image.id !== imageId ? image : { ...image, caption: newCaption }
      ),
    }));

    this.props.model.editCaption(imageId, newCaption);
  };

  handleImageOrderChange = (imageId: string, newPos: number) => {
    const imageToBeInserted = this.state.images.find(
      (image) => image.id === imageId
    );

    if (imageToBeInserted) {
      const insertElement = (filteredList: ImageInfo[]): ImageInfo[] => {
        return [
          ...filteredList.slice(0, newPos),
          imageToBeInserted,
          ...filteredList.slice(newPos),
        ];
      };

      this.setState((prevState) => ({
        images: insertElement(
          prevState.images.filter((image) => image.id !== imageId)
        ),
      }));
    }
  };

  render() {
    const selectedImage = this.state.images.find(
      (image) => image.id === this.state.selectedImageId
    );

    return (
      <div className="image-gallery">
        {this.state.images.length > 0 && (
          <Sidebar
            images={this.state.images}
            selectedImageId={this.state.selectedImageId}
            onSelectedImageIdChange={this.handleSelectedImageIdChange}
            onImageOrderChange={this.handleImageOrderChange}
          />
        )}
        {selectedImage && (
          <DisplayContainer
            image={selectedImage}
            onImageCaptionChange={this.handleImageCaptionChange}
          />
        )}
      </div>
    );
  }
}
