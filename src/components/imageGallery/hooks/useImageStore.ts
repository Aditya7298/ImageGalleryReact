import { useCallback, useState } from "react";
import { ImageStore } from "../../../ts/interfaces/ImageStore.interface";
import { ImageInfo } from "../../../ts/interfaces/ImageInfo.interface";

export const useImageStore = (
  initialImageStore: ImageInfo[],
  initialSelectedImageId: string
) => {
  const [imageStore, setImageStore] = useState(() =>
    initialImageStore.reduce(
      (imageStoreObj, imageInfo) => ({
        ...imageStoreObj,
        [imageInfo.id]: imageInfo,
      }),
      {} as ImageStore
    )
  );

  const [selectedImageId, setSelectedImageId] = useState(
    initialSelectedImageId
  );

  const [imageOrder, setImageOrder] = useState(
    initialImageStore.map((imageInfo) => imageInfo.id)
  );

  const getAllImages: () => ImageInfo[] = useCallback(() => {
    return imageOrder.reduce((imageList, id) => {
      const image = imageStore[id];
      if (image) {
        imageList = [...imageList, image];
      }

      return imageList;
    }, [] as ImageInfo[]);
  }, [imageStore, imageOrder]);

  const getSelectedImageId = () => selectedImageId;

  const editCaption: (id: string, newCaption: string) => ImageInfo | undefined =
    useCallback(
      (id, newCaption) => {
        const image = imageStore[id];
        if (image) {
          const newImage = { ...image, caption: newCaption };
          setImageStore((prevImageStore) => ({
            ...prevImageStore,
            [id]: newImage,
          }));
          return image;
        }
      },
      [imageStore]
    );

  const editSelectedImage: (newSelectedImageId: string) => void = useCallback(
    (newSelectedImageId) => {
      setSelectedImageId(newSelectedImageId);
    },
    []
  );

  const editImageOrder: (imageId: string, newPos: number) => void = useCallback(
    (imageId, newPos) => {
      const idToBeInserted = imageOrder.find((id) => id === imageId);

      if (idToBeInserted) {
        const insertElement = (filteredList: string[]): string[] => {
          return [
            ...filteredList.slice(0, newPos),
            idToBeInserted,
            ...filteredList.slice(newPos),
          ];
        };

        setImageOrder((prevImageOrder) =>
          insertElement(prevImageOrder.filter((id) => id !== imageId))
        );
      }
    },
    [imageOrder]
  );

  return {
    getAllImages,
    getSelectedImageId,
    editCaption,
    editSelectedImage,
    editImageOrder,
  };
};
