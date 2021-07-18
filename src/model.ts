import { ImageStore } from "./ts/interfaces/ImageStore.interface";
import { ImageInfo } from "./ts/interfaces/ImageInfo.interface";

class Model {

    imageStore: ImageStore;
    selectedImageId: string;

    constructor(imageList: ImageInfo[], selectedImageId: string) {

        this.imageStore = imageList.reduce((imageStoreObj: ImageStore, image: ImageInfo) => (
            { ...imageStoreObj, [image.id]: { ...image } }
        ), {} as ImageStore);

        this.selectedImageId = selectedImageId;
    }

    getAllImages = (): ImageInfo[] => {
        return Object.keys(this.imageStore).reduce(
            (imageList, id) => {
              const image = this.imageStore[id];
              if (image) {
                imageList = [...imageList, image];
              }
      
              return imageList;
            },
            [] as ImageInfo[]
          );
    }

    getSelectedImageId = (): string => this.selectedImageId;

    editCaption = (id: string, newCaption: string): [boolean, ImageInfo | null] => {
        let image = this.imageStore[id];
        if (image) {
            image = { ...image, caption: newCaption };
            this.imageStore[id] = image;
            return [true, image];
        } else {
            return [false, null];
        }
    }

    editSelectedImageId = (newId: string): void => {
        this.selectedImageId = newId;
    }

}

export { Model };