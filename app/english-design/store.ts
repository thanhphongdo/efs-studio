import { uniq, uniqBy } from "lodash";
import { CSSProperties } from "react";
import { v4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export const tailwindBgColors = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

export const defaultColorPickerSwatches = [
  "#2e2e2e",
  "#868e96",
  "#fa5252",
  "#e64980",
  "#be4bdb",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
];

export const videoDemensions = {
  Long: {
    width: 1920,
    height: 1080,
  },
  Short: {
    width: 1080,
    height: 1920,
  },
};

export const basicShapeStyles: Array<{
  name: keyof CSSProperties;
  fullName: string;
  type: "text" | "checkbox" | "number" | "select" | "color" | "font";
  defaultValue?: any;
  options?: Array<string>;
  checkedValue?: string;
  config?: { [key: string]: any };
}> = [
  {
    name: "backgroundImage",
    fullName: "Background Image",
    type: "text",
    defaultValue: "",
  },
  {
    name: "backgroundSize",
    fullName: "Background Size",
    type: "text",
    defaultValue: "",
  },
  {
    name: "backgroundPositionX",
    fullName: "Bg Position X",
    type: "text",
    defaultValue: "center",
  },
  {
    name: "backgroundPositionY",
    fullName: "Bg Position Y",
    type: "text",
    defaultValue: "center",
  },
  {
    name: "backgroundColor",
    fullName: "Background Color",
    type: "color",
    defaultValue: "",
  },
  {
    name: "opacity",
    fullName: "Opacity",
    type: "number",
    defaultValue: 100,
    config: { step: 10, min: 0, max: 100 },
  },
  {
    name: "fontFamily",
    fullName: "Font Family",
    type: "font",
  },
  {
    name: "fontSize",
    fullName: "Font Size",
    type: "number",
    defaultValue: 32,
    config: { step: 4, min: 0 },
  },
  {
    name: "lineHeight",
    fullName: "Line Height",
    type: "text",
    defaultValue: "normal",
  },
  {
    name: "color",
    fullName: "Color",
    type: "color",
    defaultValue: "#f0f0f0",
  },
  {
    name: "fontStyle",
    fullName: "Font Style",
    type: "checkbox",
    checkedValue: "italic",
    defaultValue: false,
  },
  {
    name: "fontWeight",
    fullName: "Font Weight",
    type: "select",
    options: ["normal", "600", "700", "800", "900"],
    defaultValue: "normal",
  },
  {
    name: "justifyContent",
    fullName: "Justify Content",
    type: "select",
    options: [
      "flex-start",
      "flex-end",
      "center",
      "space-between",
      "space-around",
      "space-evenly",
    ],
    defaultValue: "center",
  },
  {
    name: "alignItems",
    fullName: "Align Items",
    type: "select",
    options: ["flex-start", "flex-end", "center", "baseline", "stretch"],
    defaultValue: "center",
  },
  {
    name: "padding",
    fullName: "Padding",
    type: "text",
    defaultValue: "0px 0px 0px 0px",
  },
  {
    name: "margin",
    fullName: "Margin",
    type: "text",
    defaultValue: "0px 0px 0px 0px",
  },
  {
    name: "textDecoration",
    fullName: "Text Decoration",
    type: "select",
    options: ["none", "underline"],
    defaultValue: "none",
  },
  {
    name: "borderRadius",
    fullName: "Border Radius",
    type: "text",
    defaultValue: "0px 0px 0px 0px",
  },
];

export const voices = [
  { voice: "en-US-AndrewMultilingualNeural", gender: "Male" },
  { voice: "en-US-AndrewNeural", gender: "Male" },
  { voice: "en-US-BrianMultilingualNeural", gender: "Male" },
  { voice: "en-US-BrianNeural", gender: "Male" },
  { voice: "en-US-ChristopherNeural", gender: "Male" },
  { voice: "en-US-EricNeural", gender: "Male" },
  { voice: "en-US-GuyNeural", gender: "Male" },
  { voice: "en-US-RogerNeural", gender: "Male" },
  { voice: "en-US-SteffanNeural", gender: "Male" },
  { voice: "vi-VN-NamMinhNeural", gender: "Male" },
  { voice: "en-US-AnaNeural", gender: "Female - Child" },
  { voice: "en-US-AriaNeural", gender: "Female" },
  { voice: "en-US-AvaMultilingualNeural", gender: "Female" },
  { voice: "en-US-AvaNeural", gender: "Female" },
  { voice: "en-US-EmmaMultilingualNeural", gender: "Female" },
  { voice: "en-US-EmmaNeural", gender: "Female" },
  { voice: "en-US-JennyNeural", gender: "Female" },
  { voice: "en-US-MichelleNeural", gender: "Female" },
  { voice: "vi-VN-HoaiMyNeural", gender: "Female" },
];

export type VideoType = "Long" | "Short";
export type SlidePosition = "Before" | "After" | "Main";

export type Shape = {
  uuid: string;
  key: string;
  type: "Normal" | "Conversation" | "Image" | "Paragraph" | "Hidden";
  exampleValue?: string;
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  styles: Array<{
    name: keyof CSSProperties;
    value: any;
  }>;
  classes?: string;
  isCollapse?: boolean;
  isFocus?: boolean;
  isActive?: boolean;
  hidden?: boolean;
  slideParts: Array<string>;
  difficultWordMode?: boolean;
};

export type VoiceItem = {
  voice: string;
  rate: string;
  character?: string;
};

export type VoiceScriptItem = {
  voiceId: string;
  id: string;
  key: string;
  voices: VoiceItem[];
};

export type SlideItem = {
  uuid: string;
  contentIndex: number;
  shapes: Array<Shape>;
  contents: Array<{ [key: string]: any }>;
  styles: Array<
    Record<string, { [name in keyof CSSProperties]: CSSProperties[name] }>
  >;
  difficultWords: Array<{
    en: string;
    vi: string;
  }>;
  voiceScriptItems: {
    [slidePartUUID: string]: Array<VoiceScriptItem>;
  };
  difficultWordStyles?: {
    fontFamily?: string;
    color?: string;
  };
  type: VideoType;
  position: SlidePosition;
  startIndex: number;
  endIndex: number | null;
  splitedContent: number | null;
  maxChars: number;
  isSelected: boolean;
  currentMaxIndex: number;
  currentActiveShape?: string;
  part?: number;
  contentTotal?: number;
  showIndicator?: boolean;
  slideParts: Array<string>;
  activePart: string;
};

export type EnglishVideoState = {
  showDesignWidget: boolean;
  isEditting?: boolean;
  videoTitle?: string;
  endVideoTitle?: string;
  videoThumbnail: string;
  endVideoThumbnail: string;
  configModalOpened: boolean;
  mainConfigModalOpened: boolean;
  copyConfigModalOpened: boolean;
  viewContentModalOpened: { opened: boolean; isFocusCurrentContent: boolean };
  voiceScriptModalOpened: boolean;
  configuationHistoryModalOpened: boolean;
  copyType: "Video" | "Speech";
  scale: number;
  voiceScriptItems: Array<VoiceScriptItem>;
  slides: Array<SlideItem>;
  music?: {
    name: string;
    volumex: number;
  };
  transparent?: boolean;
};

export type EnglishVideoActions = {
  reset: () => void;
  getAll: () => EnglishVideoState;
  setAll: (value: EnglishVideoState) => void;
  setShowDesignWidget: (value: boolean) => void;
  setVideoTitle: (title: string) => void;
  setEndVideoTitle: (title: string) => void;
  setVideoThumbnail: (thumbnail: string) => void;
  setEndVideoThumbnail: (thumbnail: string) => void;
  addShape: (shape: Shape) => void;
  getShape: (slideUUID: string | null, uuid: string) => Shape | undefined;
  getShapes: (slideUUID?: string) => Array<Shape>;
  updateShapeToCurrentSlide: (shape: Shape) => void;
  updateShape: (shape: Shape) => void;
  updateFocus: (uuid: string, isFocus?: boolean) => void;
  updateActive: (uuid: string, isActive?: boolean) => void;
  getFocus: (uuid: string) => boolean;
  clearFocus: () => void;
  getCollapseShape: () => Array<Shape>;
  getActiveShape: () => Shape;
  getFocusShape: () => Array<Shape>;
  getShapeStyles: (uuid: string) => { [name in keyof CSSProperties]: any };
  getShapeStylesComputed: (
    slideUUID: string,
    uuid: string
  ) => {
    [name in keyof CSSProperties]: any;
  };
  updateShapeStyles: (
    uuid: string,
    styleName: keyof CSSProperties,
    value: any
  ) => void;
  deleteShape: (uuid?: string) => void;
  deleteAllShapes: () => void;
  setIsEditting: (value: boolean) => void;
  getContent: (slideUUID: string) => { [key: string]: any };
  setContentIndex: (slideUUID: string, index: number) => void;
  getConvertedDifficultWords: (slideUUID: string) => {
    en: Array<string>;
    vi: Array<string>;
  };
  setMainConfigModalOpened: (value: boolean) => void;
  setConfigModalOpened: (value: boolean) => void;
  setCopyConfigModalOpened: (value: boolean) => void;
  setVoiceScriptModalOpened: (value: boolean) => void;
  setConfiguationHistoryModalOpened: (value: boolean) => void;
  setViewContentModalOpened: (
    opended: boolean,
    isFocusCurrentContent?: boolean
  ) => void;
  setCopyType: (value: "Video" | "Speech") => void;
  setMusic: (name: string, volumex: number) => void;
  zoom: (scale: number) => void;
  setVideoType: (slideUUID: string, type: VideoType) => void;
  setSlide: (slides: SlideItem) => void;
  getSlide: (uuid: string) => SlideItem | undefined;
  setSlides: (slides: Array<SlideItem>) => void;
  addSlide: (
    slide: SlideItem,
    option: {
      position: SlidePosition;
      relativeSlideId: string;
    }
  ) => void;
  removeSlide: (uuid: string) => void;
  selectSlide: (slide: SlideItem) => void;
  swapSlides: (slideIndex1: number, slideIndex2: number) => void;
  getBeforeSlide: () => Array<SlideItem>;
  getAfterSlide: () => Array<SlideItem>;
  getMainSlide: () => SlideItem;
  currentSlide: () => SlideItem | undefined;
  hasConversation: (slideUUID: string) => boolean;
  setTransparent: (value: boolean) => void;
};

export type EnglishVideo = EnglishVideoState & EnglishVideoActions;

const defaultMainSlideActivePart = v4();

export const defaultInitState: EnglishVideoState = {
  showDesignWidget: true,
  videoTitle: "",
  videoThumbnail: "",
  endVideoThumbnail: "",
  configModalOpened: false,
  mainConfigModalOpened: false,
  copyConfigModalOpened: false,
  voiceScriptModalOpened: false,
  configuationHistoryModalOpened: false,
  viewContentModalOpened: { opened: false, isFocusCurrentContent: false },
  copyType: "Video",
  scale: 0.5,
  voiceScriptItems: [],
  slides: [
    {
      uuid: "MAIN",
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
      type: "Long",
      position: "Main",
      startIndex: 0,
      endIndex: null,
      splitedContent: null,
      maxChars: 300,
      isSelected: true,
      currentMaxIndex: 0,
      part: 1,
      contentTotal: 1,
      slideParts: [defaultMainSlideActivePart],
      activePart: defaultMainSlideActivePart,
    },
  ],
};

export const initEnglishVideo = (): EnglishVideoState => {
  return {
    ...defaultInitState,
  };
};

export const createEnglishVideo = (
  initState: EnglishVideoState = defaultInitState
) => {
  const store = create<EnglishVideo>()(
    persist(
      (set, get) => ({
        ...initState,
        reset: () => set({ ...initState }),
        getAll: () => ({
          ...get(),
          scale: 1,
          mainConfigModalOpened: false,
          copyConfigModalOpened: false,
          configModalOpened: false,
          voiceScriptModalOpened: false,
          configuationHistoryModalOpened: false,
          viewContentModalOpened: {
            opened: false,
            isFocusCurrentContent: false,
          },
        }),
        setAll: (value) => set((state) => ({ ...state, ...value })),
        setShowDesignWidget: (value) =>
          set((state) => ({ ...state, showDesignWidget: value })),
        setVideoTitle: (title) =>
          set((state) => ({ ...state, videoTitle: title })),
        setEndVideoTitle: (title) =>
          set((state) => ({ ...state, endVideoTitle: title })),
        setVideoThumbnail: (thumbnail) =>
          set((state) => ({ ...state, videoThumbnail: thumbnail })),
        setEndVideoThumbnail: (thumbnail) =>
          set((state) => ({ ...state, endVideoThumbnail: thumbnail })),
        addShape: (shape, type: VideoType = "Long") => {
          const currentSlide = get().currentSlide()!;
          const shapes = [...currentSlide.shapes];
          shape.zIndex = currentSlide.currentMaxIndex + 100;
          if (!shape.classes) shape.classes = "";
          if (!shape.styles) shape.styles = [];
          if (
            !shape.styles.find(
              (s) =>
                s.name === "backgroundImage" || s.name === "backgroundColor"
            )
          ) {
            const color =
              tailwindBgColors[
                (currentSlide.currentMaxIndex % (tailwindBgColors.length - 4)) +
                  4
              ];
            const colorNum = (Math.ceil(Math.random() * 5) + 2) * 100;
            shape.classes += ` tw-bg-${color}-${colorNum}/${
              10 + (1000 - colorNum) / 10
            } tw-text-${color}-${colorNum + 200}`;
          }
          if (shape.left < 0) {
            shape.left = (videoDemensions[type].width - shape.width) / 2;
          }
          if (shape.top < 0) {
            shape.top = (videoDemensions[type].height - shape.height) / 2;
          }
          if (!shape.styles?.length) {
            shape.styles = basicShapeStyles.map((style) => ({
              name: style.name,
              value: style.defaultValue,
            }));
          }
          shapes.forEach((shape) => {
            shape.isCollapse = false;
            shape.isActive = false;
          });
          shape.isCollapse = true;
          shape.isActive = true;
          currentSlide.shapes = [...shapes, shape];
          currentSlide.currentMaxIndex += 100;
          currentSlide.currentActiveShape = shape.uuid;
          get().setSlide(currentSlide);
        },
        getShape: (slideUUID, uuid) =>
          get()
            .slides.find(
              (slide) => slide.uuid == (slideUUID ?? get().currentSlide()!.uuid)
            )
            ?.shapes.find((s) => s.uuid === uuid),
        getShapes: (slideUUID) =>
          get().slides.find(
            (slide) => slide.uuid == (slideUUID ?? get().currentSlide()!.uuid)
          )?.shapes ?? [],
        updateShapeToCurrentSlide: (shape) =>
          set((state) => {
            return {
              ...state,
            };
          }),
        updateShape: (shape) =>
          set((state) => {
            const currentSlide = state.currentSlide()!;
            currentSlide.shapes = currentSlide.shapes.map((item) =>
              item.uuid === shape.uuid ? shape : item
            );
            return {
              ...state,
              slides: state.slides.map((slide) =>
                slide.uuid === currentSlide.uuid ? currentSlide : slide
              ),
            };
          }),
        updateFocus: (uuid, isFocus) => {
          const currentSlide = get().currentSlide()!;
          currentSlide.shapes = currentSlide.shapes.map((item) =>
            item.uuid === uuid
              ? { ...item, isFocus }
              : { ...item, isFocus: false }
          );
          get().setSlide(currentSlide);
        },
        updateActive: (uuid, isActive) => {
          const currentSlide = get().currentSlide()!;
          currentSlide.shapes = currentSlide.shapes.map((item) =>
            item.uuid === uuid
              ? { ...item, isActive }
              : { ...item, isActive: false }
          );
          get().setSlide(currentSlide);
        },
        getFocus: (uuid) =>
          get()
            .currentSlide()!
            .shapes.find((s) => s.uuid === uuid)?.isFocus || false,
        clearFocus: () => {
          const currentSlide = get().currentSlide()!;
          currentSlide.shapes = currentSlide.shapes.map((item) => ({
            ...item,
            isFocus: false,
            isActive: false,
          }));
          get().setSlide(currentSlide);
        },
        getCollapseShape: () =>
          get()
            .currentSlide()!
            .shapes.filter((s) => s.isCollapse)!,
        getFocusShape: () =>
          get()
            .currentSlide()!
            .shapes.filter((s) => s.isFocus)!,
        getActiveShape: () =>
          get()
            .currentSlide()!
            .shapes.find((s) => s.isActive)!,
        getShapeStyles: (uuid) => {
          const styles = get()
            .currentSlide()!
            .shapes.find((s) => s.uuid === uuid)?.styles;
          return styles
            ? Object.fromEntries(styles.map((s) => [s.name, s.value]))
            : {};
        },
        getShapeStylesComputed: (slideUUID, uuid) => {
          const shape = get()
            .getShapes(slideUUID)
            .find((s) => s.uuid === uuid);
          const styles = shape?.styles;
          const style = styles
            ? Object.fromEntries(styles.map((s) => [s.name, s.value]))
            : {};
          const computedStyles = Object.keys(style)
            .map((styleName) => {
              let value = style[styleName];
              switch (styleName) {
                case "backgroundImage":
                  value = `url("${value}")`;
                  break;
                case "backgroundSize":
                  if (value) {
                    value = `auto ${value}%`;
                  }

                  break;
                case "backgroundPositionX":
                case "backgroundPositionY":
                  if (
                    value &&
                    ["left", "right", "top", "bottom", "center"].indexOf(
                      value
                    ) < 0
                  ) {
                    value = `${value}%`;
                  }
                  break;
                case "opacity":
                  value = value / 100;
                  break;
              }
              return {
                styleName,
                value,
              };
            })
            .reduce((style, item) => {
              return {
                ...style,
                [item.styleName]: item.value,
              };
            }, {});
          const contentIndex = get().getSlide(slideUUID)!.contentIndex;
          const customStyles: Record<string, any> =
            (get().getSlide(slideUUID)?.styles?.[contentIndex] ?? {})[
              shape?.key!
            ] ?? {};
          const customStylesComputed = Object.keys(customStyles).reduce(
            (style, item) => {
              return {
                ...style,
                [item.replace(/-([a-z])/g, (match, letter) =>
                  letter.toUpperCase()
                )]: customStyles[item],
              };
            },
            {}
          );
          if (
            shape?.styles.filter(
              (item) => item.name === "backgroundImage" && !item.value
            )?.length! >= 1
          ) {
            delete (computedStyles as any).backgroundImage;
            delete (customStylesComputed as any).backgroundImage;
          }
          return {
            ...computedStyles,
            ...customStylesComputed,
          };
        },
        updateShapeStyles: (uuid, styleName, value) => {
          const currentSlide = get().currentSlide()!;
          currentSlide.shapes = currentSlide.shapes.map((item) =>
            item.uuid === uuid
              ? {
                  ...item,
                  styles: item.styles.map((style) =>
                    style.name === styleName
                      ? { ...style, value: value }
                      : style
                  ),
                }
              : item
          );
          get().setSlide(currentSlide);
        },
        deleteShape: (uuid) => {
          if (!uuid) {
            return;
          }
          const currentSlide = get().currentSlide()!;
          currentSlide.shapes = currentSlide.shapes.filter(
            (item) => item.uuid !== uuid
          );
          get().setSlide(currentSlide);
        },
        deleteAllShapes: () => {
          const currentSlide = get().currentSlide()!;
          currentSlide.shapes = [];
          get().setSlide(currentSlide);
        },
        setIsEditting: (isEditting) =>
          set((state) => ({
            ...state,
            isEditting,
          })),
        getContent: (slideUUID) =>
          get().getSlide(slideUUID)!.contents[
            get().getSlide(slideUUID)!.contentIndex
          ],
        setContentIndex: (slideUUID, index) =>
          set((state) => ({
            ...state,
            slides: [
              ...state.slides.map((item) => {
                if (item.uuid == slideUUID) {
                  return {
                    ...item,
                    contentIndex: index,
                  };
                }
                return {
                  ...item,
                };
              }),
            ],
          })),
        getConvertedDifficultWords: (slideUUID) => {
          const difficultWords = uniqBy(
            get().getSlide(slideUUID)!.difficultWords,
            "en"
          );
          return {
            en: difficultWords.map((s) => s.en),
            vi: difficultWords.map((s) => s.vi),
          };
        },
        setMainConfigModalOpened: (opened) =>
          set((state) => ({ ...state, mainConfigModalOpened: opened })),
        setConfigModalOpened: (opened) =>
          set((state) => ({ ...state, configModalOpened: opened })),
        setCopyConfigModalOpened: (opened) =>
          set((state) => ({ ...state, copyConfigModalOpened: opened })),
        setVoiceScriptModalOpened: (opened) =>
          set((state) => ({ ...state, voiceScriptModalOpened: opened })),
        setConfiguationHistoryModalOpened: (opened) =>
          set((state) => ({
            ...state,
            configuationHistoryModalOpened: opened,
          })),
        setViewContentModalOpened: (opened, isFocusCurrentContent) =>
          set((state) => ({
            ...state,
            viewContentModalOpened: {
              opened,
              isFocusCurrentContent: isFocusCurrentContent ?? false,
            },
          })),
        setCopyType: (type) => set((state) => ({ ...state, copyType: type })),
        setMusic: (name, volumex) =>
          set((state) => ({ ...state, music: { name, volumex } })),
        zoom: (scale) => set((state) => ({ ...state, scale })),
        setVideoType: (slideUUID, type) =>
          set((state) => ({
            ...state,
            slides: state.slides.map((item) => ({
              ...item,
              type: item.uuid === slideUUID ? type : item.type,
            })),
          })),
        getSlide: (uuid) => get().slides.find((item) => item.uuid === uuid),
        setSlides: (slides) => set((state) => ({ ...state, slides })),
        addSlide: (slide, option) =>
          set((state) => {
            const relativeSlideIndex = state.slides.findIndex(
              (item) => item.uuid === option.relativeSlideId
            );
            const relativeSlide = state.slides.find(
              (item) => item.uuid === option.relativeSlideId
            );
            const beforeSlides = state.slides.filter(
              (slide, index) => index < relativeSlideIndex
            );
            const afterSlides = state.slides.filter(
              (slide, index) => index > relativeSlideIndex
            );
            if (option.position === "Before") {
              return {
                ...state,
                slides: [
                  ...beforeSlides,
                  slide,
                  relativeSlide!,
                  ...afterSlides,
                ],
              };
            } else if (option.position === "After") {
              return {
                ...state,
                slides: [
                  ...beforeSlides,
                  relativeSlide!,
                  slide,
                  ...afterSlides,
                ],
              };
            }
            return {
              ...state,
            };
          }),
        removeSlide: (uuid) => {
          const slides = [...get().slides];
          const slide = slides.find((item) => item.uuid === uuid);
          if (slide?.isSelected) {
            const slideIndex = slides.findIndex((item) => item.uuid === uuid);
            if (slideIndex > 0) {
              slides[slideIndex - 1].isSelected = true;
            } else {
              slides[slideIndex + 1].isSelected = true;
            }
          }
          set((state) => ({
            ...state,
            slides: [...slides.filter((item) => item.uuid != uuid)],
          }));
        },
        setSlide: (slide) =>
          set((state) => ({
            ...state,
            slides: [
              ...state.slides.map((item) =>
                item.uuid === slide.uuid ? slide : item
              ),
            ],
          })),
        selectSlide: (slide) =>
          set((state) => ({
            ...state,
            slides: [
              ...state.slides.map((item) => ({
                ...item,
                isSelected: item.uuid === slide.uuid,
              })),
            ],
          })),
        swapSlides: (slideIndex1, slideIndex2) => {
          const slides = [...get().slides];
          const bkSlide1 = slides[slideIndex1];
          slides[slideIndex1] = {
            ...slides[slideIndex2],
          };
          slides[slideIndex2] = {
            ...bkSlide1,
          };
          set((state) => ({ ...state, slides }));
        },
        getBeforeSlide: () =>
          get().slides.filter((slide) => slide.position === "Before"),
        getAfterSlide: () =>
          get().slides.filter((slide) => slide.position === "After"),
        getMainSlide: () =>
          get().slides.find((slide) => slide.position === "Main")!,
        currentSlide: () => get().slides.find((slide) => slide.isSelected),
        hasConversation: (slideUUID) =>
          get()
            .getSlide(slideUUID)!
            .shapes.findIndex((item) => item.type === "Conversation") >= 0,
        setTransparent: (value) =>
          set((state) => ({ ...state, transparent: value })),
      }),
      {
        name: "UpdateVesselScheduleStore",
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
  return store;
};
