import { Button } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { useEnglishVideo } from "../store-provider";
import { Shape as ShapeType } from "../store";
import { useDebounceCallback } from "@mantine/hooks";
import Conversation from "./Conversation";
import { useSearchParams } from "next/navigation";

const useShapePosition = (props: { uuid: string }) => {
  const { currentSlide } = useEnglishVideo((state) => state);
  return currentSlide()!.shapes.find((shape) => shape.uuid === props.uuid);
};

export const Shape = (props: {
  slideUUID: string;
  uuid: string;
  containerRef: React.RefObject<HTMLDivElement>;
  scale: number;
  isView?: boolean;
}) => {
  const {
    isEditting,
    addShape,
    deleteShape,
    getShape,
    updateFocus,
    updateShape,
    getFocus,
    getShapeStylesComputed,
    updateActive,
    setIsEditting,
    currentSlide,
    getContent,
  } = useEnglishVideo((state) => state);

  const params = useSearchParams();
  const [isView, setIsView] = useState(
    JSON.parse(params.get("view") || "false")
  );
  const [shape, setShape] = useState<ShapeType>();
  const content = getContent(props.slideUUID);

  const [isDrag, setIsDrag] = useState(false);

  useEffect(() => {
    setShape(getShape(props.slideUUID, props.uuid));
  }, []);

  useEffect(() => {
    !isDrag &&
      shape &&
      updateShape({
        ...getShape(props.slideUUID, props.uuid)!,
        left: shape?.left || 0,
        top: shape?.top || 0,
        width: shape?.width || 0,
        height: shape?.height || 0,
      });
  }, [shape?.width, shape?.height, shape?.left, shape?.top, isDrag]);

  useEffect(() => {
    !isDrag && updateShapeState();
  }, [useShapePosition({ uuid: props.uuid })]);

  const dragItemRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const shapeRef = useRef<HTMLDivElement>(null);

  const updateShapeState = useDebounceCallback(() => {
    setShape(getShape(props.slideUUID, props.uuid));
  }, 100);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>, handle: string) => {
    e.stopPropagation();
    setIsDrag(true);
    setIsEditting(true);
    if (isEditting) return;
    const rect = dragItemRef.current?.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    };

    const onMouseMove = (e: MouseEvent) => {
      if (props.containerRef.current) {
        const containerRect =
          props.containerRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - containerRect.left) / props.scale;
        const mouseY = (e.clientY - containerRect.top) / props.scale;

        let newShapeState = {
          x: shape?.left || 0,
          y: shape?.top || 0,
          width: shape?.width || 0,
          height: shape?.height || 0,
        };

        if (handle === "move") {
          newShapeState.x = mouseX - dragOffset.current.x / props.scale;
          newShapeState.y = mouseY - dragOffset.current.y / props.scale;
          if (newShapeState.x < 0) newShapeState.x = 0;
          if (newShapeState.y < 0) newShapeState.y = 0;
          if (
            newShapeState.x + newShapeState.width >
            containerRect.width / props.scale
          )
            newShapeState.x =
              containerRect.width / props.scale - newShapeState.width;
          if (
            newShapeState.y + newShapeState.height >
            containerRect.height / props.scale
          )
            newShapeState.y =
              containerRect.height / props.scale - newShapeState.height;
        } else {
          if (handle.includes("right")) {
            newShapeState.width = mouseX - newShapeState.x;
          }
          if (handle.includes("bottom")) {
            newShapeState.height = mouseY - newShapeState.y;
          }
          if (handle.includes("left")) {
            const newWidth = newShapeState.width + (newShapeState.x - mouseX);
            newShapeState.width = newWidth;
            if (newWidth === 0) {
              return;
            }
            newShapeState.x = mouseX;
          }
          if (handle.includes("top")) {
            const newHeight = newShapeState.height + (newShapeState.y - mouseY);
            newShapeState.height = newHeight;
            if (newHeight === 0) {
              return;
            }
            newShapeState.y = mouseY;
          }

          if (newShapeState.width < 0) newShapeState.width = 0;
          if (newShapeState.height < 0) newShapeState.height = 0;
        }

        setShape({
          ...shape!,
          left: newShapeState.x,
          top: newShapeState.y,
          width: newShapeState.width,
          height: newShapeState.height,
        });
      }
    };

    const onMouseUp = () => {
      setIsDrag(false);
      setIsEditting(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const getHandleStyles = (handle: string) => {
    switch (handle) {
      case "top-left":
        return { top: "-16px", left: "-16px", cursor: "nwse-resize" };
      case "top-right":
        return { top: "-16px", right: "-16px", cursor: "nesw-resize" };
      case "bottom-left":
        return { bottom: "-16px", left: "-16px", cursor: "nesw-resize" };
      case "bottom-right":
        return { bottom: "-16px", right: "-16px", cursor: "nwse-resize" };
      default:
        return {};
    }
  };

  return (
    !!shape && (
      <>
        <div className="tw-text-[0px] tw-text-center">{shape.uuid}</div>
        <div
          ref={dragItemRef}
          className={`tw-absolute tw-select-none tw-cursor-grab`}
          style={{
            left: shape.left,
            top: shape.top,
            width: shape.width,
            height: shape.height,
            zIndex: shape.zIndex * 10,
          }}
        >
          {!shape.hidden && (
            <div
              ref={shapeRef}
              className={`tw-w-full tw-h-full tw-flex tw-bg-center tw-bg-cover tw-bg-no-repeat ${
                shape.classes || ""
              }`}
              style={{
                ...getShapeStylesComputed(props.slideUUID, shape.uuid),
                display: shape.hidden ? "none" : "block",
              }}
            >
              {shape.type === "Conversation" && content?.speechs && (
                <Conversation
                  speechs={content.speechs}
                  shape={shape}
                ></Conversation>
              )}
              {shape.type === "Normal" &&
                (content?.[shape.key] || shape?.exampleValue || shape.key)}
            </div>
          )}
        </div>
        {!props.isView && (
          <div
            className={`tw-absolute tw-select-none tw-cursor-grab`}
            style={{
              left: shape.left,
              top: shape.top,
              width: shape.width,
              height: shape.height,
              zIndex: shape.zIndex * 1000,
            }}
            onMouseDown={(e) => {
              onMouseDown(e, "move");
              updateActive(shape.uuid, true);
            }}
            onMouseEnter={() => !isEditting && updateFocus(shape.uuid, true)}
            onMouseLeave={() =>
              !isEditting && !isDrag && updateFocus(shape.uuid, false)
            }
          >
            {!isView && (getFocus(shape.uuid) || shape.isActive) && (
              <>
                {["top-left", "top-right", "bottom-left", "bottom-right"].map(
                  (handle) => (
                    <div
                      key={handle}
                      className="tw-absolute tw-rounded-full tw-w-8 tw-h-8 tw-bg-zinc-800/60 tw-border-2 tw-border-gray-800 tw-border-solid"
                      style={{
                        ...getHandleStyles(handle),
                      }}
                      onMouseDown={(e) => onMouseDown(e, handle)}
                      onMouseEnter={() => updateFocus(shape.uuid, true)}
                    ></div>
                  )
                )}
                <div
                  className="tw-absolute tw-bg-gray-800 tw-bg-transparent tw-border-2 tw-border-gray-900 tw-border-dashed focus-visible:tw-outline-none"
                  style={{
                    width: shape.width + 4,
                    height: shape.height + 4,
                    top: -2,
                    left: -2,
                  }}
                  tabIndex={1}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    switch (e.key) {
                      case "ArrowUp":
                        updateShape({
                          ...shape,
                          top: shape.top - 2,
                        });
                        break;
                      case "ArrowDown":
                        updateShape({
                          ...shape,
                          top: shape.top + 2,
                        });
                        break;
                      case "ArrowLeft":
                        updateShape({
                          ...shape,
                          left: shape.left - 2,
                        });
                        break;
                      case "ArrowRight":
                        updateShape({
                          ...shape,
                          left: shape.left + 2,
                        });
                        break;
                      case "Backspace":
                        deleteShape(shape.uuid);
                        break;
                      case "d":
                        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                          deleteShape(shape.uuid);
                          return;
                        }
                        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
                          addShape({
                            ...shape,
                            uuid: v4(),
                            left: shape.left + 20,
                            top: shape.top + 20,
                          });
                          return;
                        }
                        break;
                      default:
                        break;
                    }
                  }}
                  onKeyUp={(e) => {
                    e.preventDefault();
                  }}
                ></div>
              </>
            )}
          </div>
        )}
      </>
    )
  );
};
