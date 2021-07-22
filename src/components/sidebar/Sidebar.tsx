import React from "react";
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

export class Sidebar extends React.Component<SidebarProps> {
  componentDidMount() {
    document.addEventListener("keydown", this.handlePanelSelectionFromKeyboard);
  }

  componentWillUnmount() {
    document.removeEventListener(
      "keydown",
      this.handlePanelSelectionFromKeyboard
    );
  }

  handlePanelSelectionFromKeyboard = (evt: KeyboardEvent) => {
    if (evt.key === "Enter" && document.activeElement) {
      const activeElement = document.activeElement;
      const sidebarPanelId = activeElement.getAttribute(
        "data-sidebar-panel-id"
      );

      if (sidebarPanelId) {
        this.props.onSelectedImageIdChange(sidebarPanelId);
      }
    }
  };

  findClosestPanelBelow = (
    yPos: number,
    sidebarPanels: NodeListOf<HTMLDivElement>
  ): ClosestPanelInfo => {
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
  };

  handleDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    const draggingSidebarPanel = document.querySelector(
      '[data-sidebar-panel-dragging="true"]'
    ) as HTMLDivElement;
    const sidebarPanels = document.querySelectorAll(
      "[data-sidebar-panel-id]"
    ) as NodeListOf<HTMLDivElement>;

    const { closestPanelBelow } = this.findClosestPanelBelow(
      evt.clientY,
      sidebarPanels
    );

    if (
      draggingSidebarPanel &&
      closestPanelBelow &&
      closestPanelBelow !== draggingSidebarPanel
    ) {
      const draggingSidebarPanelId =
        draggingSidebarPanel.dataset.sidebarPanelId;
      const closestPanelBelowIndex = this.props.images.findIndex(
        (image) => image.id === closestPanelBelow.dataset.sidebarPanelId
      );
      if (draggingSidebarPanelId) {
        this.props.onImageOrderChange(
          draggingSidebarPanelId,
          closestPanelBelowIndex
        );
      }
    }
  };

  render() {
    const { images, selectedImageId } = this.props;

    return (
      <div
        onDragOver={(evt) => {
          eventDeboune(this.handleDragOver)(evt);
        }}
        className="sidebar"
      >
        {images &&
          images.map((image) => (
            <SidebarPanel
              key={image.id}
              image={image}
              onSelectedImageIdChange={this.props.onSelectedImageIdChange}
              isSelected={selectedImageId === image.id}
            />
          ))}
      </div>
    );
  }
}
