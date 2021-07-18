import React from "react";
import { ImageInfo } from "../../ts/interfaces/ImageInfo.interface";
import { truncateInnerText } from "../../utils";
import "./SidebarPanel.css";

interface SidebarPanelProps {
  image: ImageInfo;
  isSelected: boolean;
  onSelectedImageIdChange: (newSelectedImageId: string) => void;
}

export class SidebarPanel extends React.Component<SidebarPanelProps> {
  captionRef: React.RefObject<HTMLSpanElement>;

  constructor(props: SidebarPanelProps) {
    super(props);
    this.captionRef = React.createRef<HTMLSpanElement>();
  }

  componentDidMount() {
    this.truncateCaption();
  }

  componentDidUpdate() {
    this.truncateCaption();
  }

  truncateCaption = () => {
    if (this.captionRef.current) {
      truncateInnerText(
        this.captionRef.current,
        this.props.image.caption,
        2,
        "100%"
      );
    }
  };

  handleDragStart = (evt: React.DragEvent<HTMLDivElement>) => {
    const sidebarElement = evt.target as HTMLDivElement;
    sidebarElement.classList.toggle("sidebar-panel-dragging");
    sidebarElement.dataset.sidebarPanelDragging = "true";
  };

  handleDragEnd = (evt: React.DragEvent<HTMLDivElement>) => {
    const sidebarElement = evt.target as HTMLDivElement;
    sidebarElement.classList.toggle("sidebar-panel-dragging");
    sidebarElement.dataset.sidebarPanelDragging = "false";
  };

  render() {
    const { id, caption, src } = this.props.image,
      isSelected = this.props.isSelected;
    return (
      <div
        className={`sidebar-panel ${
          isSelected ? "sidebar-panel-selected" : ""
        }`}
        tabIndex={0}
        data-sidebar-panel-id={id}
        onClick={() => {
          this.props.onSelectedImageIdChange(id);
        }}
        draggable="true"
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      >
        <img
          className="sidebar-panel_image"
          height="40px"
          width="40px"
          src={src}
          alt={caption}
        />
        <span ref={this.captionRef} className="sidebar-panel_caption">
          {caption}
        </span>
      </div>
    );
  }
}
