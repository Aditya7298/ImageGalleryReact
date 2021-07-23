import React, { useEffect, useCallback } from "react";
import { SidebarPanel } from "../sidebarPanel/SidebarPanel";
import { ImageInfo } from "../../ts/interfaces/ImageInfo.interface";
import { eventDeboune } from "../../utils";

interface SidebarProps {
  images: ImageInfo[];
  selectedImageId: string;
  onSelectedImageIdChange: (newSelectedImageId: string) => void;
  onImageOrderChange: (imageId: string, newPos: number) => void;
}

interface ClosestPanelInfo {
  closestPanelBelow: HTMLDivElement | null;
  offset: number;
}

export const Sidebar = ({
  images,
  selectedImageId,
  onSelectedImageIdChange,
  onImageOrderChange,
}: SidebarProps) => {
  useEffect(() => {
    const selectImageFromKeyboard = (evt: KeyboardEvent) => {
      if (evt.key === "Enter" && document.activeElement) {
        const activeElement = document.activeElement;
        const sidebarPanelId = activeElement.getAttribute(
          "data-sidebar-panel-id"
        );

        if (sidebarPanelId) {
          onSelectedImageIdChange(sidebarPanelId);
        }
      }
    };

    document.addEventListener("keydown", selectImageFromKeyboard);

    return () => {
      document.removeEventListener("keydown", selectImageFromKeyboard);
    };
  }, [onSelectedImageIdChange]);

  const findClosestPanelBelow: (
    yPos: number,
    sidebarPanels: NodeListOf<HTMLDivElement>
  ) => ClosestPanelInfo = useCallback((yPos, sidebarPanels) => {
    return Array.from(sidebarPanels).reduce(
      (closest, sidebarPanel) => {
        const boundingBox = sidebarPanel.getClientRects()[0],
          midPoint = boundingBox.top + boundingBox.height / 2,
          offset = yPos - midPoint;
        return offset < 0 && offset > closest.offset
          ? { closestPanelBelow: sidebarPanel, offset }
          : closest;
      },
      {
        closestPanelBelow: null,
        offset: Number.NEGATIVE_INFINITY,
      } as ClosestPanelInfo
    );
  }, []);

  const handleDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    const draggingSidebarPanel = document.querySelector(
      '[data-sidebar-panel-dragging="true"]'
    ) as HTMLDivElement;
    if (draggingSidebarPanel) {
      const sidebarPanels = document.querySelectorAll(
        "[data-sidebar-panel-id]"
      ) as NodeListOf<HTMLDivElement>;

      const { closestPanelBelow } = findClosestPanelBelow(
        evt.clientY,
        sidebarPanels
      );

      if (closestPanelBelow && closestPanelBelow !== draggingSidebarPanel) {
        const draggingSidebarPanelId =
          draggingSidebarPanel.dataset.sidebarPanelId;
        const closestPanelBelowIndex = images.findIndex(
          (image) => image.id === closestPanelBelow.dataset.sidebarPanelId
        );
        if (draggingSidebarPanelId) {
          onImageOrderChange(draggingSidebarPanelId, closestPanelBelowIndex);
        }
      }
    }
  };

  return (
    <div
      onDragOver={(evt) => {
        eventDeboune(handleDragOver)(evt);
      }}
      className="sidebar"
    >
      {images &&
        images.map((image) => (
          <SidebarPanel
            key={image.id}
            image={image}
            onSelectedImageIdChange={onSelectedImageIdChange}
            isSelected={selectedImageId === image.id}
          />
        ))}
    </div>
  );
};
