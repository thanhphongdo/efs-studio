import { Menu, ScrollArea } from "@mantine/core";
import { useEnglishVideo } from "../store-provider";
import {
  IconCopyPlus,
  IconDotsVertical,
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
  } = useEnglishVideo((state) => state);

  return (
    // tw-w-[calc(100vw_-_496px)] tw-h-36
    <div
      className={`tw-p-2 tw-bg-slate-600 ${
        props.direcrion === "horizontal" ? "tw-h-36" : "tw-w-36"
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
              className={`tw-h-32 tw-w-32 tw-rounded-lg tw-cursor-pointer tw-relative ${
                slide.uuid === "MAIN"
                  ? "tw-bg-green-100/70"
                  : "tw-bg-yellow-100/50"
              }`}
              onClick={() => {
                selectSlide(slide);
              }}
            >
              {slide.type === "Long" && (
                <EnglishLongVideo
                  slideUUID={slide.uuid}
                  scale={"0.06"}
                  isView={true}
                  styles={{
                    position: "absolute",
                    left: `-${(1920 * 0.94) / 2 - (128 - 1920 * 0.06) / 2}px`,
                    top: `-${(1080 * 0.94) / 2 - (128 - 1080 * 0.06) / 2}px`,
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
                    left: `-${(1080 * 0.94) / 2 - (128 - 1080 * 0.06) / 2}px`,
                    top: `-${(1920 * 0.94) / 2 - (128 - 1920 * 0.06) / 2}px`,
                    pointerEvents: "none",
                  }}
                ></EnglishShortVideo>
              )}
              <div className="tw-w-full tw-h-full tw-flex tw-gap-1 tw-relative">
                <div className="tw-h-full tw-flex tw-flex-col tw-justify-start tw-p-2 tw-pr-0 tw-gap-2">
                  <IconSquareChevronLeft
                    onClick={() => swapSlides(slideIndex, slideIndex - 1)}
                    className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200"
                  />
                  <IconSquareChevronRight
                    onClick={() => swapSlides(slideIndex, slideIndex + 1)}
                    className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200"
                  />
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
                  <Menu width={200} shadow="md">
                    <Menu.Target>
                      <IconDotsVertical className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200" />
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={(e) => {
                          e.stopPropagation();
                          const newSlide: SlideItem = {
                            uuid: v4(),
                            contentIndex: 0,
                            shapes: [],
                            contents: [],
                            difficultWords: [],
                            voiceScriptItems: [],
                            type: "Long",
                            position: "Before",
                            startIndex: 0,
                            endIndex: null,
                            splitedContent: null,
                            maxChars: 500,
                            isSelected: false,
                            currentMaxIndex: 0,
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
                          const newSlide: SlideItem = {
                            uuid: v4(),
                            contentIndex: 0,
                            shapes: [],
                            contents: [],
                            difficultWords: [],
                            voiceScriptItems: [],
                            type: "Long",
                            position: "After",
                            startIndex: 0,
                            endIndex: null,
                            splitedContent: null,
                            maxChars: 500,
                            isSelected: false,
                            currentMaxIndex: 0,
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
                          const newSlide: SlideItem = {
                            uuid: v4(),
                            contentIndex: 0,
                            shapes,
                            contents: [...slide.contents],
                            difficultWords: [...slide.difficultWords],
                            voiceScriptItems: [
                              ...slide.voiceScriptItems.map((item) => ({
                                ...item,
                                voiceId: v4(),
                                id: shapes.find((s) => s.key === item.key)!
                                  .uuid,
                              })),
                            ],
                            type: "Long",
                            position: "Before",
                            startIndex: 0,
                            endIndex: null,
                            splitedContent: null,
                            maxChars: 500,
                            isSelected: false,
                            currentMaxIndex: 0,
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
                          const newSlide: SlideItem = {
                            uuid: v4(),
                            contentIndex: 0,
                            shapes,
                            contents: [...slide.contents],
                            difficultWords: [...slide.difficultWords],
                            voiceScriptItems: [
                              ...slide.voiceScriptItems.map((item) => ({
                                ...item,
                                voiceId: v4(),
                                id: shapes.find((s) => s.key === item.key)!
                                  .uuid,
                              })),
                            ],
                            type: "Long",
                            position: "After",
                            startIndex: 0,
                            endIndex: null,
                            splitedContent: null,
                            maxChars: 500,
                            isSelected: false,
                            currentMaxIndex: 0,
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
                          labels: { confirm: "Confirm", cancel: "Cancel" },
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
              {/* <div className="tw-flex tw-flex-col tw-justify-between tw-p-2 tw-w-full tw-h-full tw-relative">
                <div className="tw-w-full">
                  <div className="tw-flex tw-gap-2 tw-flex-col tw-h-full">
                    <IconSquarePlus
                      className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newSlide: SlideItem = {
                          uuid: v4(),
                          contentIndex: 0,
                          shapes: [],
                          contents: [],
                          difficultWords: [],
                          voiceScriptItems: [],
                          type: "Long",
                          position: "Before",
                          startIndex: 0,
                          endIndex: null,
                          splitedContent: null,
                          maxChars: 500,
                          isSelected: false,
                          currentMaxIndex: 0,
                        };
                        addSlide(newSlide, {
                          position: "Before",
                          relativeSlideId: slide.uuid,
                        });
                        selectSlide(newSlide);
                      }}
                    />
                    <IconSquareChevronLeft className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200" />
                  </div>
                  {slide.uuid === "MAIN" && (
                    <div className="tw-flex tw-items-end">
                      <div className="tw-bg-green-200 tw-px-1 tw-rounded-sm tw-text-[10px] tw-text-green-800 tw-font-bold">
                        Main Slide
                      </div>
                    </div>
                  )}
                  <div className="tw-flex tw-gap-2 tw-flex-col tw-h-full">
                    <IconSquarePlus
                      className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newSlide: SlideItem = {
                          uuid: v4(),
                          contentIndex: 0,
                          shapes: [],
                          contents: [],
                          difficultWords: [],
                          voiceScriptItems: [],
                          type: "Long",
                          position: "After",
                          startIndex: 0,
                          endIndex: null,
                          splitedContent: null,
                          maxChars: 500,
                          isSelected: false,
                          currentMaxIndex: 0,
                        };
                        addSlide(newSlide, {
                          position: "After",
                          relativeSlideId: slide.uuid,
                        });
                        selectSlide(newSlide);
                      }}
                    />
                    <IconSquareChevronRight className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200" />
                  </div>
                </div>
                <div className="tw-flex-1 tw-flex tw-items-end tw-w-full">
                  <IconX
                    className="tw-bg-[#424242] tw-rounded-[4px] tw-text-slate-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      openConfirmModal({
                        modalId: "delete-slide",
                        centered: true,
                        title: "Delete Slide",
                        children: <div>Do you want to delete this slide?</div>,
                        labels: { confirm: "Confirm", cancel: "Cancel" },
                        onConfirm: async () => {
                          removeSlide(slide.uuid);
                        },
                        confirmProps: { color: "red" },
                        closeOnConfirm: true,
                        closeOnCancel: true,
                      });
                    }}
                  />
                  {slide.uuid !== "MAIN" ? (
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
                          labels: { confirm: "Confirm", cancel: "Cancel" },
                          onConfirm: async () => {
                            removeSlide(slide.uuid);
                          },
                          confirmProps: { color: "red" },
                          closeOnConfirm: true,
                          closeOnCancel: true,
                        });
                      }}
                    />
                  ) : (
                    <span></span>
                  )}
                </div>
              </div> */}
              {slide.uuid === currentSlide()!.uuid && (
                <div className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-border-4 tw-border-solid tw-border-red-500 tw-rounded-lg tw-pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
