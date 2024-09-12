import {
  Accordion,
  Button,
  Checkbox,
  Collapse,
  ColorInput,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { memo, useEffect, useRef, useState } from "react";
import { useEnglishVideo } from "../store-provider";
import {
  basicShapeStyles,
  defaultColorPickerSwatches,
  Shape,
  videoDemensions,
} from "../store";
import {
  IconArrowBarBoth,
  IconArrowBarDown,
  IconArrowBarToDown,
  IconArrowBarToUp,
  IconArrowBarUp,
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconChevronUp,
  IconLayoutAlignBottom,
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignMiddle,
  IconLayoutAlignRight,
  IconLayoutAlignTop,
} from "@tabler/icons-react";
import { SelectFont } from "@/app/components/SelectFont";

const useGetActiveShape = () => {
  const { currentSlide } = useEnglishVideo((state) => state);
  return currentSlide()
    ?.shapes.filter((shape) => shape.isActive || shape.isCollapse)
    .map((shape) => shape.uuid);
};

export const DesignWidget = () => {
  const {
    getShapes,
    getShape,
    updateShape,
    updateActive,
    getShapeStyles,
    updateShapeStyles,
    getCollapseShape,
    getActiveShape,
    currentSlide,
  } = useEnglishVideo((state) => state);

  const [activeShape, setActiveShape] = useState<Array<string>>([]);

  useEffect(() => {
    const activeShape = getShapes().filter((shape) => shape.isActive);
    setActiveShape(activeShape.map((shape) => shape.uuid));
    activeShape.forEach((shape) => {
      if (shape.isActive) {
        setTimeout(() => {
          document
            .getElementById(shape.uuid)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    });
  }, [currentSlide()?.currentActiveShape]);

  const maxZIndex = () => {
    const value = Math.max(...getShapes().map((s) => s.zIndex));
    return value;
  };

  const minZIndex = () => {
    const value = Math.min(...getShapes().map((s) => s.zIndex));
    return value;
  };

  const maxClosedZIndex = () => {
    const value = Math.min(
      ...getShapes()
        .filter((item) => item.zIndex > getActiveShape().zIndex)
        .map((s) => s.zIndex)
    );
    console.log(value);
    if (!isFinite(value)) return getActiveShape().zIndex;
    return value;
  };

  const minClosedZIndex = () => {
    const value = Math.max(
      ...getShapes()
        .filter((item) => item.zIndex < getActiveShape().zIndex)
        .map((s) => s.zIndex)
    );
    console.log(value);
    if (!isFinite(value)) return getActiveShape().zIndex;
    return value;
  };

  return (
    <div
      onKeyUp={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {getShapes().length > 0 &&
        getShapes().map((shape) => (
          <div className="tw-flex tw-flex-col tw-gap-2" key={shape.uuid}>
            <div
              className="tw-cursor-pointer tw-bg-slate-800 tw-w-full tw-p-2 tw-flex tw-gap-2 tw-select-none"
              onClick={() => updateActive(shape.uuid, !shape.isActive)}
            >
              <div
                className={`tw-relative tw-font-bold tw-flex-1 ${
                  getActiveShape()?.uuid === shape.uuid
                    ? "tw-text-yellow-500"
                    : "tw-text-blue-500"
                }`}
              >
                <div className="tw-absolute -tw-top-8" id={shape.uuid}></div>
                {shape.key || shape.uuid}
              </div>
              {!shape.isActive && <IconChevronDown />}
              {!!shape.isActive && <IconChevronUp />}
            </div>
            <Collapse in={!!shape.isActive}>
              {!!shape.isActive && (
                <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                  <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pt-1 tw-col-span-2">
                    <div className="tw-grid tw-grid-cols-7 tw-gap-2">
                      <div className="tw-col-span-4 tw-flex tw-flex-col tw-gap-2">
                        <div className="tw-text-sm">Key</div>
                        <div className="tw-flex tw-gap-4 tw-items-end">
                          <TextInput
                            className="tw-flex-1"
                            step={10}
                            placeholder="Key"
                            value={getShape(null, shape.uuid)?.key}
                            defaultValue={getShape(null, shape.uuid)?.key}
                            onChange={(event) => {
                              updateShape({
                                ...shape,
                                key: event.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="tw-col-span-2 tw-flex tw-flex-col tw-gap-2">
                        <div className="tw-text-sm">Type</div>
                        <Select
                          defaultValue={shape.type || "Normal"}
                          data={[
                            "Normal",
                            "Conversation",
                            "Image",
                            "Paragraph",
                            "Hidden",
                          ]}
                          onChange={(value: any) => {
                            updateShape({
                              ...shape,
                              type: value,
                            });
                          }}
                        ></Select>
                      </div>
                      <div className="tw-flex tw-flex-col tw-gap-2">
                        <div className="tw-text-sm tw-text-center">Hidden</div>
                        <div className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                          <Checkbox
                            defaultChecked={shape.hidden}
                            onChange={(e) =>
                              updateShape({
                                ...shape,
                                hidden: e.currentTarget.checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pt-1 tw-col-span-2">
                    <div className="tw-text-sm">Example Value</div>
                    <div>
                      <Textarea
                        autosize
                        rows={1}
                        placeholder="Example Value"
                        value={getShape(null, shape.uuid)?.exampleValue}
                        defaultValue={getShape(null, shape.uuid)?.exampleValue}
                        onChange={(event) => {
                          updateShape({
                            ...shape,
                            exampleValue: event.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pt-1 tw-col-span-2">
                    <div className="tw-text-sm">Shape Align</div>
                    <div className="tw-flex tw-gap-4">
                      <div>
                        <Button.Group>
                          <Button
                            variant="default"
                            onClick={() => {
                              updateShape({
                                ...shape,
                                left: 0,
                              });
                            }}
                          >
                            <IconLayoutAlignLeft />
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              updateShape({
                                ...shape,
                                left:
                                  (videoDemensions[currentSlide()!.type].width -
                                    shape.width) /
                                  2,
                              });
                            }}
                          >
                            <IconLayoutAlignCenter />
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              updateShape({
                                ...shape,
                                left:
                                  videoDemensions[currentSlide()!.type].width -
                                  shape.width,
                              });
                            }}
                          >
                            <IconLayoutAlignRight />
                          </Button>
                        </Button.Group>
                      </div>
                      <div>
                        <Button.Group>
                          <Button
                            variant="default"
                            onClick={() => {
                              updateShape({
                                ...shape,
                                top: 0,
                              });
                            }}
                          >
                            <IconLayoutAlignTop />
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              updateShape({
                                ...shape,
                                top:
                                  (videoDemensions[currentSlide()!.type]
                                    .height -
                                    shape.height) /
                                  2,
                              });
                            }}
                          >
                            <IconLayoutAlignMiddle />
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              updateShape({
                                ...shape,
                                top:
                                  videoDemensions[currentSlide()!.type].height -
                                  shape.height,
                              });
                            }}
                          >
                            <IconLayoutAlignBottom />
                          </Button>
                        </Button.Group>
                      </div>
                    </div>
                  </div>
                  <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pt-1 tw-col-span-2">
                    <div className="tw-text-sm">Layout</div>
                    <div className="tw-flex tw-gap-4">
                      <div>
                        <Button.Group>
                          <Button
                            variant="default"
                            onClick={() => {
                              updateShape({
                                ...shape,
                                zIndex: maxClosedZIndex() + 1,
                              });
                            }}
                          >
                            <IconArrowUp />
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              updateShape({
                                ...shape,
                                zIndex: minClosedZIndex() - 1,
                              });
                            }}
                          >
                            <IconArrowDown />
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              updateShape({
                                ...shape,
                                zIndex: maxZIndex() + 1,
                              });
                            }}
                          >
                            <IconArrowBarToUp />
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              updateShape({
                                ...shape,
                                zIndex: minZIndex() - 1,
                              });
                            }}
                          >
                            <IconArrowBarToDown />
                          </Button>
                        </Button.Group>
                      </div>
                    </div>
                  </div>
                  <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pt-1">
                    <div className="tw-text-sm">Width</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-flex-1"
                        step={10}
                        placeholder="Width"
                        value={getShape(null, shape.uuid)?.width}
                        defaultValue={getShape(null, shape.uuid)?.width}
                        startValue={getShape(null, shape.uuid)?.width}
                        onChange={(value) => {
                          updateShape({
                            ...shape,
                            width: parseInt(value as string),
                          });
                        }}
                      />
                      <Button
                        className="!tw-p-1"
                        onClick={() => {
                          updateShape({
                            ...shape,
                            width: videoDemensions[currentSlide()!.type].width,
                          });
                        }}
                      >
                        <IconArrowBarBoth />
                      </Button>
                    </div>
                  </div>
                  <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pt-1">
                    <div className="tw-text-sm">Height</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-flex-1"
                        step={10}
                        placeholder="Height"
                        value={getShape(null, shape.uuid)?.height}
                        defaultValue={getShape(null, shape.uuid)?.height}
                        startValue={getShape(null, shape.uuid)?.height}
                        onChange={(value) => {
                          updateShape({
                            ...shape,
                            height: parseInt(value as string),
                          });
                        }}
                      />
                      <Button
                        className="!tw-p-1"
                        onClick={() => {
                          updateShape({
                            ...shape,
                            height:
                              videoDemensions[currentSlide()!.type].height,
                          });
                        }}
                      >
                        <IconArrowBarBoth className="tw-rotate-90" />
                      </Button>
                    </div>
                  </div>
                  <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pt-1">
                    <div className="tw-text-sm">X</div>
                    <div>
                      <NumberInput
                        step={10}
                        placeholder="X"
                        value={getShape(null, shape.uuid)?.left}
                        defaultValue={getShape(null, shape.uuid)?.left}
                        startValue={getShape(null, shape.uuid)?.left}
                        onChange={(value) => {
                          updateShape({
                            ...shape,
                            left: parseInt(value as string),
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pt-1">
                    <div className="tw-text-sm">Y</div>
                    <div>
                      <NumberInput
                        step={10}
                        placeholder="Y"
                        value={getShape(null, shape.uuid)?.top}
                        defaultValue={getShape(null, shape.uuid)?.top}
                        startValue={getShape(null, shape.uuid)?.top}
                        onChange={(value) => {
                          updateShape({
                            ...shape,
                            top: parseInt(value as string),
                          });
                        }}
                      />
                    </div>
                  </div>

                  {basicShapeStyles.map((style) => (
                    <div
                      key={style.name + shape.uuid}
                      className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pt-1"
                    >
                      <div className="tw-text-sm">{style.fullName}</div>
                      <div>
                        {style.type === "text" && (
                          <TextInput
                            placeholder={style.fullName}
                            defaultValue={
                              getShapeStyles(shape.uuid)[style.name]
                            }
                            onChange={(event) => {
                              updateShapeStyles(
                                shape.uuid,
                                style.name,
                                event.target.value
                              );
                            }}
                          />
                        )}
                        {style.type === "number" && (
                          <NumberInput
                            placeholder={style.fullName}
                            startValue={getShapeStyles(shape.uuid)[style.name]}
                            defaultValue={
                              getShapeStyles(shape.uuid)[style.name]
                            }
                            step={style?.config?.["step"] ?? 1}
                            min={style?.config?.["min"] ?? -1e10}
                            max={style?.config?.["max"] ?? 1e10}
                            onChange={(value) => {
                              updateShapeStyles(
                                shape.uuid,
                                style.name,
                                parseInt(value as string)
                              );
                            }}
                          />
                        )}
                        {style.type === "select" && (
                          <Select
                            data={style.options}
                            defaultValue={
                              getShapeStyles(shape.uuid)[style.name]
                            }
                            placeholder={style.fullName}
                            onChange={(value) => {
                              updateShapeStyles(shape.uuid, style.name, value);
                            }}
                          ></Select>
                        )}
                        {style.type === "color" && (
                          <ColorInput
                            placeholder={style.fullName}
                            swatches={defaultColorPickerSwatches}
                            format="rgba"
                            defaultValue={
                              getShapeStyles(shape.uuid)[style.name]
                            }
                            onChange={(value) => {
                              updateShapeStyles(shape.uuid, style.name, value);
                            }}
                          />
                        )}
                        {style.type === "font" && (
                          <SelectFont
                            type=""
                            value={getShapeStyles(shape.uuid)[style.name]}
                            onChange={({ value }) => {
                              console.log(value);
                              updateShapeStyles(shape.uuid, style.name, value);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pt-1 tw-col-span-2">
                    <div className="tw-text-sm">Classes</div>
                    <div>
                      <Textarea
                        minRows={2}
                        autosize
                        placeholder="Classes"
                        value={getShape(null, shape.uuid)?.classes}
                        defaultValue={getShape(null, shape.uuid)?.classes}
                        onChange={(event) => {
                          updateShape({
                            ...shape,
                            classes: event.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Collapse>
          </div>
        ))}
    </div>
  );
};
