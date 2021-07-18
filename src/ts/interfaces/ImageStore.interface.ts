import { ImageInfo } from "./ImageInfo.interface";

export interface ImageStore {
    [id: string]: undefined | ImageInfo;
}