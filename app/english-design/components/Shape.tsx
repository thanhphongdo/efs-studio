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

function replaceKeywords(text: string, keyWords: string[]): string {
  let regex = new RegExp(keyWords.join("|"), "gi");

  let replacedText = text.replace(regex, (match: string) => {
    let isUpperCase = match[0] === match[0]?.toUpperCase();
    let replacement = match.toLowerCase().replace(/\s+/g, "_");
    if (isUpperCase) {
      replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  });
  return replacedText;
}

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
    getConvertedDifficultWords,
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

  const shapeStyles = !!shape
    ? getShapeStylesComputed(props.slideUUID, shape.uuid)
    : {};

  const difficultWords = getConvertedDifficultWords(props.slideUUID);

  let prevIndex = -1;
  let hasMargin = false;
  let forceMargin = false;

  return (
    !!shape && (
      <>
        <div className="tw-text-[0px] tw-text-center">{shape.uuid}</div>
        <div
          ref={dragItemRef}
          className={`tw-absolute tw-select-none tw-cursor-grab tw-bg-transparent`}
          style={{
            // left: shape.left,
            // top: shape.top,
            width: shape.width,
            height: shape.height,
            zIndex: shape.zIndex * 10,
            left: shapeStyles.left ?? shape.left,
            top: shapeStyles.top ?? shape.top,
          }}
        >
          {!shape.hidden && (
            <div
              ref={shapeRef}
              className={`tw-w-full tw-h-full tw-flex tw-bg-center tw-bg-cover tw-bg-no-repeat ${
                shape.classes || ""
              }`}
              style={{
                ...shapeStyles,
                display: shape.hidden ? "none" : "block",
              }}
            >
              {shape.type === "Conversation" && content?.speechs && (
                <Conversation
                  slideUUID={props.slideUUID}
                  speechs={content.speechs}
                  shape={shape}
                ></Conversation>
              )}
              {shape.type === "Normal" &&
                !shape.difficultWordMode &&
                (content?.[shape.key] || shape?.exampleValue || shape.key)}
              {!!content &&
                shape.type === "Normal" &&
                !!shape.difficultWordMode && (
                  <div className="tw-leading-[1.6em]">
                    {replaceKeywords(
                      content?.[shape.key] ?? "",
                      getConvertedDifficultWords(props.slideUUID).en
                    )
                      .split(" ")
                      .map((word, wIndex) => {
                        const findWord = word
                          .replace(/[_\.\,\:\!\?\"\“\”]/g, " ")
                          .trim()
                          .toLowerCase();
                        const index = difficultWords.en.indexOf(findWord);
                        if (
                          difficultWords.en
                            .map((item) => item?.toLowerCase())
                            .includes(findWord)
                        ) {
                          let applyMargin = false;
                          const wordVn = difficultWords.vi[index] ?? "";
                          if (
                            wordVn &&
                            word &&
                            wordVn.length >= word.length * 2 - 2
                          ) {
                            forceMargin = true;
                          }
                          if (wIndex == prevIndex + 1) {
                            hasMargin = !hasMargin;
                          } else {
                            hasMargin = false;
                          }
                          if (
                            hasMargin &&
                            wordVn &&
                            word &&
                            (wordVn.length >= word.length * 2 || forceMargin)
                          ) {
                            forceMargin = false;
                            applyMargin = true;
                          }
                          prevIndex = wIndex;
                          return (
                            <>
                              <span className="tw-relative">
                                <span className="tw-font-bold tw-italic tw-underline tw-inline-block tw-mr-[0.3em]">
                                  {word.replace(/_/g, " ")}{" "}
                                </span>
                                <div
                                  className={`tw-absolute !tw-font-bold tw-top-[-1.5em] tw-text-[0.6em] tw-left-[-150%] tw-w-[400%] tw-text-center tw-text-amber-900 ${
                                    wordVn.length >= word.length * 1.8 - 2
                                      ? "tw-text-[0.45em] !tw-top-[-1.6em]"
                                      : ""
                                  }`}
                                  //applyMargin ? "!tw-top-[0.4em]" : ""
                                  style={{
                                    fontFamily:
                                      currentSlide()?.difficultWordStyles
                                        ?.fontFamily,
                                    color:
                                      currentSlide()?.difficultWordStyles
                                        ?.color,
                                  }}
                                >
                                  {difficultWords.vi[index]}
                                </div>
                              </span>
                            </>
                          );
                        }
                        return <span>{word} </span>;
                      })}
                  </div>
                )}
              {shape.type === "Image" && (
                <div
                  className={`tw-w-full tw-h-full tw-text-blue-900 tw-flex tw-items-center tw-justify-center tw-bg-cover !tw-bg-no-repeat ${
                    shape.classes || ""
                  }`}
                  style={{
                    background: content?.[shape.key]
                      ? `url("${content?.[shape.key]}")`
                      : "rgba(34, 139, 230, 0.5)",
                    borderRadius: shapeStyles.borderRadius,
                    backgroundPositionX: shapeStyles.backgroundPositionX,
                    backgroundPositionY: shapeStyles.backgroundPositionY,
                    backgroundSize: shapeStyles.backgroundSize,
                  }}
                >
                  {content?.[shape.key] ? "" : "NO IMAGE"}
                </div>
              )}
            </div>
          )}
        </div>
        {!props.isView && (
          <div
            className={`tw-absolute tw-select-none tw-cursor-grab tw-bg-transparent`}
            style={{
              // left: shape.left,
              // top: shape.top,
              left: shapeStyles.left ?? shape.left,
              top: shapeStyles.top ?? shape.top,
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
                ></div>
              </>
            )}
          </div>
        )}
      </>
    )
  );
};
