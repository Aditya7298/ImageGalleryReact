import React, { useRef, useEffect } from "react";
import { ImageInfo } from "../../ts/interfaces/ImageInfo.interface";
import { truncateInnerText } from "../../utils";
import "./SidebarPanel.css";

interface SidebarPanelProps {
  image: ImageInfo;
  isSelected: boolean;
  onSelectedImageIdChange: (newSelectedImageId: string) => void;
}

export const SidebarPanel = ({
  image,
  isSelected,
  onSelectedImageIdChange,
}: SidebarPanelProps) => {
  const captionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (captionRef.current) {
      truncateInnerText(captionRef.current, image.caption, 2, "100%");
    }
  });

  const handleDragStart = (evt: React.DragEvent<HTMLDivElement>) => {
    const sidebarElement = evt.target as HTMLDivElement;
    sidebarElement.classList.toggle("sidebar-panel-dragging");
    sidebarElement.dataset.sidebarPanelDragging = "true";
  };

  const handleDragEnd = (evt: React.DragEvent<HTMLDivElement>) => {
    const sidebarElement = evt.target as HTMLDivElement;
    sidebarElement.classList.toggle("sidebar-panel-dragging");
    sidebarElement.dataset.sidebarPanelDragging = "false";
  };

  return (
    <div
      className={`sidebar-panel ${isSelected ? "sidebar-panel-selected" : ""}`}
      tabIndex={0}
      data-sidebar-panel-id={image.id}
      onClick={() => {
        onSelectedImageIdChange(image.id);
      }}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <img
        className="sidebar-panel_image"
        height="40px"
        width="40px"
        src={image.src}
        alt={image.caption}
      />
      <span ref={captionRef} className="sidebar-panel_caption">
        {image.caption}
      </span>
    </div>
  );
};
