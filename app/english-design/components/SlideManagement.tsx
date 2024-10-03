import { Menu, Popover, ScrollArea } from "@mantine/core";
import { useEnglishVideo } from "../store-provider";
import {
  IconCopyPlus,
  IconDotsVertical,
  IconPlus,
  IconSquareChevronLeft,
  IconSquareChevronRight,
  IconSquarePlus,
  IconX,
} from "@tabler/icons-react";
import { v4 } from "uuid";
import { SlideItem } from "../store";
import { EnglishLongVideo } from "./EnglishLongVideo";
import { openConfirmModal } from "@mantine/modals";
import { EnglishShortVideo } from "./EnglishShortVideo";
import { useRef } from "react";

const defaultSlideWidth = 128;

export const SlideManagement = (props: {
  isView: boolean;
  direcrion: "vertical" | "horizontal";
  align?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
}) => {
  const {
    slides,
    currentSlide,
    addSlide,
    removeSlide,
    selectSlide,
    swapSlides,
    setSlide,
    updateShape,
  } = useEnglishVideo((state) => state);

  const slidePartsRefs = useRef<Array<HTMLDivElement>>([]);

  return (
    // tw-w-[calc(100vw_-_496px)] tw-h-36
    <div
      className={`tw-p-2 ${
        props.direcrion === "horizontal" ? "tw-h-36 tw-bg-gray-900" : "tw-w-36"
      } ${props.isView ? "tw-hidden" : ""}`}
      style={{
        width:
          props.direcrion === "horizontal"
            ? `calc(100vw - ${
                (props.align?.left || 0) + (props.align?.right || 0)
              }px)`
            : "auto",
        height:
          props.direcrion === "vertical"
            ? `calc(100vh - ${
                (props.align?.top || 0) + (props.align?.bottom || 0)
              }px)`
            : "auto",
      }}
    >
      <ScrollArea type="never" className="tw-w-full tw-h-full" scrollbars="xy">
        <div
          className={`tw-flex tw-gap-2 tw-h-full ${
            props.direcrion === "vertical" ? "tw-flex-col" : ""
          }`}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slide.uuid}
              onClick={() => {
                selectSlide(slide);
              }}
            >
              <Popover
                width={Math.min(
                  32 +
                    (slide.slideParts.length + 1) * defaultSlideWidth +
                    slide.slideParts.length * 8,
                  568
                )}
                position={props.direcrion === "horizontal" ? "top" : "right"}
                withArrow
                shadow="md"
                onOpen={() => {
                  setTimeout(() => {
                    const activeIndex =
                      currentSlide()!.slideParts.findIndex(
                        (item) => item === currentSlide()!.activePart
                      ) ?? 0;
                    slidePartsRefs.current?.[slideIndex]?.scrollTo({
                      left: (activeIndex - 1) * (defaultSlideWidth + 8),
                    });
                  }, 0);
                }}
              >
                <Popover.Target>
                  <div
                    className={`tw-h-32 tw-w-32 tw-rounded-lg tw-cursor-pointer tw-relative ${
                      slide.uuid === "MAIN"
                        ? "tw-bg-green-100/70"
                        : "tw-bg-yellow-100/50"
                    }`}
                  >
                    {slide.type === "Long" && (
                      <EnglishLongVideo
                        slideUUID={slide.uuid}
                        scale={"0.06"}
                        isView={true}
                        styles={{
                          position: "absolute",
                          left: `-${
                            (1920 * 0.94) / 2 -
                            (defaultSlideWidth - 1920 * 0.06) / 2
                          }px`,
                          top: `-${
                            (1080 * 0.94) / 2 -
                            (defaultSlideWidth - 1080 * 0.06) / 2
                          }px`,
                          pointerEvents: "none",
                        }}
                      ></EnglishLongVideo>
                    )}
                    {slide.type === "Short" && (
                      <EnglishShortVideo
                        slideUUID={slide.uuid}
                        scale={"0.06"}
                        isView={true}
                        styles={{
                          position: "absolute",
                          left: `-${
                            (1080 * 0.94) / 2 -
                            (defaultSlideWidth - 1080 * 0.06) / 2
                          }px`,
                          top: `-${
                            (1920 * 0.94) / 2 -
                            (defaultSlideWidth - 1920 * 0.06) / 2
                          }px`,
                          pointerEvents: "none",
                        }}
                      ></EnglishShortVideo>
                    )}
                    <div className="tw-w-full tw-h-full tw-flex tw-gap-1 tw-relative">
                      <div className="tw-h-full tw-flex tw-flex-col tw-justify-between tw-p-2 tw-pr-0 tw-gap-2">
                        <div className="tw-flex tw-flex-col tw-gap-1 tw-flex-1">
                          <IconSquareChevronLeft
                            onClick={() =>
                              slideIndex > 0 &&
                              swapSlides(slideIndex, slideIndex - 1)
                            }
                            className={`tw-bg-[#424242] tw-rounded-[4px] ${
                              slideIndex === 0
                                ? "tw-text-slate-400"
                                : "tw-text-slate-200"
                            }`}
                          />
                          <IconSquareChevronRight
                            onClick={() =>
                              slideIndex < slides.length - 1 &&
                              swapSlides(slideIndex, slideIndex + 1)
                            }
                            className={`tw-bg-[#424242] tw-rounded-[4px] ${
                              slideIndex === slides.length - 1
                                ? "tw-text-slate-400"
                                : "tw-text-slate-200"
                            }`}
                          />
                        </div>
                        <div className="tw-p-1 tw-bg-slate-300/50 tw-text-slate-800 tw-rounded-md tw-text-xs tw-flex tw-items-center tw-justify-center">
                          {slideIndex + 1}
                        </div>
                      </div>
                      <div className="tw-flex-1 tw-h-full tw-flex tw-items-end tw-pb-2 tw-px-1">
                        {slide.uuid === "MAIN" && (
                          <div className="tw-flex tw-items-end">
                            <div className="tw-bg-green-200 tw-rounded-sm tw-text-[9px] tw-text-green-800 tw-font-bold">
                              Main Slide
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="tw-h-full tw-flex tw-flex-col tw-justify-between tw-p-2 tw-pl-0">
                        <Menu width={200} shadow="md" zIndex={10000}>
                          <Menu.Target>
                            <IconDotsVertical
                              className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              onClick={(e) => {
                                e.stopPropagation();
                                const defaultMainSlideActivePart = v4();
                                const newSlide: SlideItem = {
                                  uuid: v4(),
                                  contentIndex: 0,
                                  shapes: [],
                                  contents: [],
                                  styles: [],
                                  difficultWords: [],
                                  voiceScriptItems: {
                                    defaultMainSlideActivePart: [],
                                  },
                                  type: "Long",
                                  position: "Before",
                                  startIndex: 0,
                                  endIndex: null,
                                  splitedContent: null,
                                  maxChars: 500,
                                  isSelected: false,
                                  currentMaxIndex: 0,
                                  slideParts: [defaultMainSlideActivePart],
                                  activePart: defaultMainSlideActivePart,
                                };
                                addSlide(newSlide, {
                                  position: "Before",
                                  relativeSlideId: slide.uuid,
                                });
                                selectSlide(newSlide);
                              }}
                            >
                              <div className="tw-flex tw-items-center tw-gap-1">
                                <IconSquarePlus size={14} />
                                <span>New Slide Left</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item
                              onClick={(e) => {
                                e.stopPropagation();
                                const defaultMainSlideActivePart = v4();
                                const newSlide: SlideItem = {
                                  uuid: v4(),
                                  contentIndex: 0,
                                  shapes: [],
                                  contents: [],
                                  styles: [],
                                  difficultWords: [],
                                  voiceScriptItems: {
                                    defaultMainSlideActivePart: [],
                                  },
                                  type: "Long",
                                  position: "After",
                                  startIndex: 0,
                                  endIndex: null,
                                  splitedContent: null,
                                  maxChars: 500,
                                  isSelected: false,
                                  currentMaxIndex: 0,
                                  slideParts: [defaultMainSlideActivePart],
                                  activePart: defaultMainSlideActivePart,
                                };
                                addSlide(newSlide, {
                                  position: "After",
                                  relativeSlideId: slide.uuid,
                                });
                                selectSlide(newSlide);
                              }}
                            >
                              <div className="tw-flex tw-items-center tw-gap-1">
                                <IconSquarePlus size={14} />
                                <span>New Slide Right</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item
                              onClick={(e) => {
                                e.stopPropagation();
                                const shapes = [
                                  ...slide.shapes.map((item) => ({
                                    ...item,
                                    uuid: v4(),
                                  })),
                                ];
                                const voiceScriptItems = {
                                  ...slide.voiceScriptItems,
                                };
                                Object.keys(voiceScriptItems).forEach(
                                  (partSlideUUID) => {
                                    voiceScriptItems[partSlideUUID] = [
                                      ...(
                                        voiceScriptItems[partSlideUUID] ?? []
                                      ).map((item) => ({
                                        ...item,
                                        voiceId: v4(),
                                        id: shapes.find(
                                          (s) => s.key === item.key
                                        )!.uuid,
                                      })),
                                    ];
                                  }
                                );
                                const newSlide: SlideItem = {
                                  uuid: v4(),
                                  contentIndex: 0,
                                  shapes,
                                  contents: [...(slide.contents ?? [])],
                                  styles: [...(slide.styles ?? [])],
                                  difficultWords: [
                                    ...(slide.difficultWords ?? []),
                                  ],
                                  voiceScriptItems,
                                  type: "Long",
                                  position: "Before",
                                  startIndex: 0,
                                  endIndex: null,
                                  splitedContent: null,
                                  maxChars: 500,
                                  isSelected: false,
                                  currentMaxIndex: 0,
                                  slideParts: [...slide.slideParts],
                                  activePart: slide.activePart,
                                };
                                addSlide(newSlide, {
                                  position: "Before",
                                  relativeSlideId: slide.uuid,
                                });
                                selectSlide(newSlide);
                              }}
                            >
                              <div className="tw-flex tw-items-center tw-gap-1">
                                <IconCopyPlus size={14} />
                                <span>Duplicate Left</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item
                              onClick={(e) => {
                                e.stopPropagation();
                                const shapes = [
                                  ...slide.shapes.map((item) => ({
                                    ...item,
                                    uuid: v4(),
                                  })),
                                ];
                                const voiceScriptItems = {
                                  ...slide.voiceScriptItems,
                                };
                                Object.keys(voiceScriptItems).forEach(
                                  (partSlideUUID) => {
                                    voiceScriptItems[partSlideUUID] = [
                                      ...(
                                        voiceScriptItems[partSlideUUID] ?? []
                                      ).map((item) => ({
                                        ...item,
                                        voiceId: v4(),
                                        id: shapes.find(
                                          (s) => s.key === item.key
                                        )!.uuid,
                                      })),
                                    ];
                                  }
                                );
                                const newSlide: SlideItem = {
                                  uuid: v4(),
                                  contentIndex: 0,
                                  shapes,
                                  contents: [...(slide.contents ?? [])],
                                  styles: [...(slide.styles ?? [])],
                                  difficultWords: [
                                    ...(slide.difficultWords ?? []),
                                  ],
                                  voiceScriptItems,
                                  type: "Long",
                                  position: "After",
                                  startIndex: 0,
                                  endIndex: null,
                                  splitedContent: null,
                                  maxChars: 500,
                                  isSelected: false,
                                  currentMaxIndex: 0,
                                  slideParts: [...slide.slideParts],
                                  activePart: slide.activePart,
                                };
                                addSlide(newSlide, {
                                  position: "After",
                                  relativeSlideId: slide.uuid,
                                });
                                selectSlide(newSlide);
                              }}
                            >
                              <div className="tw-flex tw-items-center tw-gap-1">
                                <IconCopyPlus size={14} />
                                <span>Duplicate Right</span>
                              </div>{" "}
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                        {slide.uuid !== "MAIN" && (
                          <IconX
                            className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              openConfirmModal({
                                modalId: "delete-slide",
                                centered: true,
                                title: "Delete Slide",
                                children: (
                                  <div>Do you want to delete this slide?</div>
                                ),
                                labels: {
                                  confirm: "Confirm",
                                  cancel: "Cancel",
                                },
                                onConfirm: async () => {
                                  removeSlide(slide.uuid);
                                },
                                confirmProps: { color: "red" },
                                closeOnConfirm: true,
                                closeOnCancel: true,
                              });
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {slide.uuid === currentSlide()!.uuid && (
                      <div className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-border-4 tw-border-solid tw-border-red-500 tw-rounded-lg tw-pointer-events-none"></div>
                    )}
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <>
                    <div className="tw-w-full tw-h-32 tw-flex tw-gap-2">
                      <ScrollArea
                        viewportRef={(el) =>
                          (slidePartsRefs.current[slideIndex] = el!)
                        }
                        w={Math.min(
                          400,
                          slide.slideParts.length * (defaultSlideWidth + 8)
                        )}
                        scrollbars="x"
                        type={slide.slideParts.length <= 3 ? "never" : "always"}
                      >
                        <div className="tw-w-full tw-flex tw-gap-2 ">
                          {slide.slideParts.map((part, partIndex) => (
                            <div
                              className={`tw-h-32 tw-w-32 tw-rounded-lg tw-cursor-pointer tw-relative ${
                                slide.activePart === part
                                  ? "tw-bg-red-300/70"
                                  : "tw-bg-yellow-100/50"
                              }`}
                              key={part}
                              onClick={() => {
                                setSlide({
                                  ...slide,
                                  activePart: part,
                                });
                              }}
                            >
                              {slide.type === "Long" && (
                                <EnglishLongVideo
                                  slideUUID={slide.uuid}
                                  scale={"0.06"}
                                  isView={true}
                                  styles={{
                                    position: "absolute",
                                    left: `-${
                                      (1920 * 0.94) / 2 -
                                      (128 - 1920 * 0.06) / 2
                                    }px`,
                                    top: `-${
                                      (1080 * 0.94) / 2 -
                                      (128 - 1080 * 0.06) / 2
                                    }px`,
                                    pointerEvents: "none",
                                  }}
                                  activeSlidePart={part}
                                ></EnglishLongVideo>
                              )}
                              {slide.type === "Short" && (
                                <EnglishShortVideo
                                  slideUUID={slide.uuid}
                                  scale={"0.06"}
                                  isView={true}
                                  styles={{
                                    position: "absolute",
                                    left: `-${
                                      (1080 * 0.94) / 2 -
                                      (128 - 1080 * 0.06) / 2
                                    }px`,
                                    top: `-${
                                      (1920 * 0.94) / 2 -
                                      (128 - 1920 * 0.06) / 2
                                    }px`,
                                    pointerEvents: "none",
                                  }}
                                  activeSlidePart={part}
                                ></EnglishShortVideo>
                              )}
                              <div className="tw-w-full tw-h-full tw-flex tw-gap-1 tw-relative">
                                <div className="tw-h-full tw-flex tw-flex-col tw-justify-between tw-p-2 tw-pr-0 tw-gap-2">
                                  <div className="tw-flex tw-flex-col tw-gap-1 tw-flex-1">
                                    <IconSquareChevronLeft
                                      onClick={() =>
                                        slideIndex > 0 &&
                                        swapSlides(slideIndex, slideIndex - 1)
                                      }
                                      className={`tw-bg-[#424242] tw-rounded-[4px] ${
                                        slideIndex === 0
                                          ? "tw-text-slate-400"
                                          : "tw-text-slate-200"
                                      }`}
                                    />
                                  </div>
                                  <div className="tw-p-1 tw-bg-slate-300/50 tw-text-slate-800 tw-rounded-md tw-text-xs tw-flex tw-items-center tw-justify-center">
                                    {partIndex + 1}
                                  </div>
                                </div>
                                <div className="tw-flex-1 tw-h-full tw-flex tw-items-end tw-pb-2 tw-px-1">
                                  {slide.activePart === part && (
                                    <div className="tw-flex tw-items-end tw-justify-center tw-w-full">
                                      <div className="tw-bg-green-200 tw-rounded-sm tw-text-[9px] tw-text-green-800 tw-font-bold">
                                        Active
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="tw-h-full tw-flex tw-flex-col tw-justify-between tw-p-2 tw-pl-0">
                                  <IconSquareChevronRight
                                    onClick={() =>
                                      slideIndex < slides.length - 1 &&
                                      swapSlides(slideIndex, slideIndex + 1)
                                    }
                                    className={`tw-bg-[#424242] tw-rounded-[4px] ${
                                      slideIndex === slides.length - 1
                                        ? "tw-text-slate-400"
                                        : "tw-text-slate-200"
                                    }`}
                                  />
                                  {slide.slideParts?.length > 1 && (
                                    <IconX
                                      className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newSlidePart =
                                          slide.slideParts.filter(
                                            (item) => item !== part
                                          );
                                        if (!newSlidePart) {
                                          return;
                                        }
                                        setSlide({
                                          ...slide,
                                          slideParts: newSlidePart,
                                          activePart:
                                            slide.activePart === part
                                              ? newSlidePart[0]
                                              : slide.activePart,
                                        });
                                        slide.shapes.forEach((shape) => {
                                          updateShape({
                                            ...shape,
                                            slideParts:
                                              shape.slideParts?.filter(
                                                (item) => item !== part
                                              ),
                                          });
                                        });
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div
                        className="tw-h-32 tw-w-32 tw-rounded-lg tw-cursor-pointer tw-relative tw-border-2 tw-border-dotted tw-border-slate-400 tw-flex tw-items-center tw-justify-center"
                        onClick={() => {
                          const partUUID = v4();
                          setSlide({
                            ...slide,
                            slideParts: [...slide.slideParts, partUUID],
                            activePart: partUUID,
                          });
                          setTimeout(() => {
                            const activeIndex =
                              currentSlide()!.slideParts.findIndex(
                                (item) => item === currentSlide()!.activePart
                              ) ?? 0;
                            slidePartsRefs.current?.[slideIndex]?.scrollTo({
                              left: (activeIndex - 1) * (defaultSlideWidth + 8),
                            });
                          }, 0);
                        }}
                      >
                        <IconPlus size={48} />
                      </div>
                    </div>
                  </>
                </Popover.Dropdown>
              </Popover>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
