"use client";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@mantine/core";
import { loadFont } from "../../components/SelectFont";
import { useSearchParams } from "next/navigation";
import { EnglishLongVideo } from "./EnglishLongVideo";
import { useEnglishVideo } from "../store-provider";
import { flatten, uniq } from "lodash";
import { SetConfigModal } from "./SetConfigModal";
import { CopyConfigModal } from "./CopyConfigModal";
import { ActionButton } from "./ActionButton";
import { EnglishShortVideo } from "./EnglishShortVideo";
import { VoiceScriptModal } from "./VoiceScriptModal";
import { ViewContentModal } from "./ViewContentModal";
import { SlideManagement } from "./SlideManagement";
import { SetMainConfigModal } from "./SetMainConfigModal";
import { v4 } from "uuid";

export default function HomePage() {
  const {
    getAll,
    // contentIndex,
    slides,
    viewContentModalOpened,
    showDesignWidget,
    setContentIndex,
    scale,
    zoom,
    setConfigModalOpened,
    setCopyConfigModalOpened,
    currentSlide,
    setSlides,
    setSlide,
    addShape,
    updateShape,
    deleteShape,
    setViewContentModalOpened,
    hasConversation,
  } = useEnglishVideo((state) => state);
  const params = useSearchParams();
  const [isView, setIsView] = useState<boolean>(
    JSON.parse(params.get("view") || "false")
  );
  const [copyValue, setCopyValue] = useState("");
  const screenEle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const styleData = localStorage.getItem("style");
      const isView = JSON.parse(params.get("view") || "false");
      if (styleData) {
        zoom(isView ? 1 : 0.5);
      } else {
        zoom(isView ? 1 : 0.5);
      }
    }
    setContentIndex(currentSlide()!.uuid, parseInt(params.get("index") ?? "0"));
    const fonts: Array<string> = [];
    flatten(slides.map((item) => item.shapes)).forEach((shape) => {
      shape.styles.forEach((item) => {
        if (item.name === "fontFamily" && item.value) {
          fonts.push(item.value);
        }
      });
    });
    slides.forEach((slide) =>
      fonts.push(slide.difficultWordStyles?.fontFamily ?? "")
    );
    uniq(fonts).forEach((font) => {
      !!font && loadFont(`https://fonts.googleapis.com/css?family=${font}`);
    });
    setConfigModalOpened(false);
    setCopyConfigModalOpened(false);
    if (!slides?.length) {
      const defaultMainSlideActivePart = v4();
      setSlides([
        {
          uuid: "MAIN",
          type: "Long",
          position: "Main",
          contentIndex: 0,
          shapes: [],
          contents: [],
          styles: [],
          difficultWords: [],
          difficultWordStyles: {
            fontFamily: "Playpen Sans",
            color: "#78350f",
          },
          voiceScriptItems: { defaultMainSlideActivePart: [] },
          startIndex: 0,
          endIndex: null,
          splitedContent: null,
          isSelected: true,
          maxChars: 500,
          currentMaxIndex: 0,
          slideParts: [defaultMainSlideActivePart],
          activePart: defaultMainSlideActivePart,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    (window as any).nextContent = function () {
      setContentIndex(currentSlide()!.uuid, currentSlide()!.contentIndex + 1);
    };
    (window as any).gotoContent = function (contentIndex: number) {
      setContentIndex(currentSlide()!.uuid, contentIndex);
    };
    (window as any).gotoSlidePart = function (slidePartIndex: number) {
      setSlide({
        ...currentSlide()!,
        activePart: currentSlide()!.slideParts[slidePartIndex],
      });
    };
  }, [slides]);

  useEffect(() => {
    setCopyValue(
      btoa(
        encodeURIComponent(
          JSON.stringify({
            state: getAll(),
            version: 0,
          })
        )
      )
    );
  }, [currentSlide()]);

  return (
    !!currentSlide() && (
      <>
        <SetMainConfigModal copyValue={copyValue}></SetMainConfigModal>
        <SetConfigModal copyValue={copyValue}></SetConfigModal>
        <CopyConfigModal copyValue={copyValue}></CopyConfigModal>
        <VoiceScriptModal></VoiceScriptModal>
        {viewContentModalOpened.opened && <ViewContentModal></ViewContentModal>}
        <div
          ref={screenEle}
          className="tw-flex tw-flex-1 tw-w-screen tw-h-screen focus-visible:!tw-outline-none !tw-bg-transparent"
          tabIndex={0}
          onKeyDown={(e) => {
            const shape = currentSlide()!.shapes.find(
              (item) => item.isActive == true
            );
            if (!shape) {
              return;
            }
            switch (e.key) {
              case "ArrowUp":
                e.preventDefault();
                updateShape({
                  ...shape,
                  top: shape.top - 2,
                });
                break;
              case "ArrowDown":
                e.preventDefault();
                updateShape({
                  ...shape,
                  top: shape.top + 2,
                });
                break;
              case "ArrowLeft":
                e.preventDefault();
                updateShape({
                  ...shape,
                  left: shape.left - 2,
                });
                break;
              case "ArrowRight":
                e.preventDefault();
                updateShape({
                  ...shape,
                  left: shape.left + 2,
                });
                break;
              case "Backspace":
                e.preventDefault();
                deleteShape(shape.uuid);
                break;
              case "e":
                e.preventDefault();
                if (!hasConversation(currentSlide()!.uuid)) {
                  setViewContentModalOpened(true, true);
                }
                break;
              case "d":
                e.preventDefault();
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
            screenEle.current?.focus();
          }}
          onKeyUp={(e) => {
            e.preventDefault();
          }}
        >
          <div
            className={`${
              isView ? "!tw-w-full" : "tw-w-[calc(100vw_-400px)]"
            } tw-h-full tw-flex tw-flex-col tw-bg-transparent`}
            style={{
              width: showDesignWidget ? "calc(100vw - 400px)" : "100%",
            }}
          >
            {!isView && (
              <ScrollArea
                type="never"
                className="tw-w-full tw-h-full tw-flex-1 tw-bg-transparent"
              >
                {currentSlide()!.type === "Long" && (
                  <EnglishLongVideo
                    scale={scale.toString()}
                    isView={isView}
                  ></EnglishLongVideo>
                )}
                {currentSlide()!.type === "Short" && (
                  <EnglishShortVideo
                    scale={scale.toString()}
                    isView={isView}
                  ></EnglishShortVideo>
                )}
              </ScrollArea>
            )}
            {isView && (
              <>
                {currentSlide()!.type === "Long" && (
                  <EnglishLongVideo
                    scale={scale.toString()}
                    isView={isView}
                  ></EnglishLongVideo>
                )}
                {currentSlide()!.type === "Short" && (
                  <EnglishShortVideo
                    scale={scale.toString()}
                    isView={isView}
                  ></EnglishShortVideo>
                )}
              </>
            )}
            <SlideManagement
              isView={isView}
              direcrion="horizontal"
              align={{ left: 0, right: showDesignWidget ? 400 : 0 }}
            ></SlideManagement>
          </div>
          <ActionButton isView={isView}></ActionButton>
        </div>
      </>
    )
  );
}
