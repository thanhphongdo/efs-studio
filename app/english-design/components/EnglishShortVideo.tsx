import { Button } from "@mantine/core";
import { CSSProperties, useEffect, useRef } from "react";
import { v4 } from "uuid";
import { useEnglishVideo } from "../store-provider";
import { Shape } from "./Shape";

export const EnglishShortVideo = (
  props: {} & {
    scale: string;
    slideUUID?: string;
    isView?: boolean;
    styles?: CSSProperties;
  }
) => {
  const { clearFocus, currentSlide, getShapes } = useEnglishVideo(
    (state) => state
  );

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      id="shape-container"
      className="tw-relative tw-w-[1080px] tw-h-[1920px] tw-bg-white tw-bg-cover tw-bg-center"
      style={{
        ...(props.styles ?? {}),
        transform: `scale(${props.scale})`,
      }}
      onClick={(e) => {
        const targetId = (e.target as HTMLElement).id;
        if (targetId === "shape-container") {
          clearFocus();
        }
      }}
    >
      {getShapes(props.slideUUID).map((shape) => (
        <Shape
          key={shape.uuid}
          uuid={shape.uuid}
          slideUUID={props.slideUUID ?? currentSlide()!.uuid}
          containerRef={containerRef}
          scale={parseFloat(props.scale)}
          isView={props.isView}
        ></Shape>
      ))}

      {currentSlide()!.uuid === "MAIN" && !currentSlide()!.splitedContent && (
        <span className="tw-absolute tw-right-4 tw-bottom-4 tw-z-[100000000] tw-text-4xl tw-bg-white tw-text-blue-500 tw-rounded-md tw-px-4 tw-font-bold">
          {currentSlide()!.contentIndex + 1 + (currentSlide()!.startIndex ?? 0)}
          /
          {currentSlide()!.endIndex ??
            currentSlide()!.contents?.length +
              (currentSlide()!.startIndex ?? 0)}
        </span>
      )}
      {currentSlide()!.uuid === "MAIN" && !!currentSlide()!.splitedContent && (
        <span className="tw-absolute tw-right-4 tw-bottom-4 tw-z-[100000000] tw-text-4xl tw-bg-white tw-text-blue-500 tw-rounded-md tw-px-4 tw-font-bold">
          {currentSlide()!.part ??
            0 * currentSlide()!.splitedContent! +
              (currentSlide()!.contentIndex + 1)}
          /{currentSlide()!.contentTotal ?? 0}
        </span>
      )}
    </div>
  );
};
