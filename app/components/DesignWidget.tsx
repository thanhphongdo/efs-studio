"use client";
import { useCallback, useEffect, useState } from "react";
import { StyleProps } from "../types/style";
import {
  Accordion,
  Button,
  Checkbox,
  ColorInput,
  Input,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { SelectFont, loadFont } from "../components/SelectFont";
import { useDebouncedState } from "@mantine/hooks";
import { colors } from "../consts/colors";
import { BackgroundModal } from "./BackgroundModal";

enum SettingTabKey {
  GENERAL,
  TITLE,
  AUTHOR,
  CHAP,
  GENRE,
  SLOGAN,
  BACKGROUND,
  AVATAR,
}

export const defaultTemplate = `
<div class="tw-text-center">
    <div class="">TITLE_1</div>
    <div class="">TITLE_2</div>
    <div class="">TITLE_3</div>
</div>
`;

export function formatTemplate(template: string) {
  return template
    .split("\n")
    .filter((item) => !!item.trim())
    .join("\n");
}

export function applyTemplate(template: string, value: string) {
  const [TITLE_1, TITLE_2, TITLE_3, TITLE_4, TITLE_5] = value
    .split("\n")
    .map((item) => item.trim());
  console.log(template);
  template = template
    .replace("TITLE_1", TITLE_1 || "")
    .replace("TITLE_2", TITLE_2 || "")
    .replace("TITLE_3", TITLE_3 || "")
    .replace("TITLE_4", TITLE_4 || "")
    .replace("TITLE_5", TITLE_5 || "");
  return template;
}

export default function (
  props: StyleProps & { changeStyle: (styleChanged: StyleProps) => void }
) {
  const [style, setStyle] = useDebouncedState<StyleProps>(props, 0);
  const [fonts, setFonts] = useState({
    title: "",
    author: "",
    chap: "",
    genre: "",
  });

  const [texts, setTexts] = useDebouncedState<{
    title: string;
    author: string;
    chap: string;
    genre: string;
    slogan: string;
  }>(
    {
      title: props.title.value || "",
      author: props.author.value || "",
      chap: props.chap.value || "",
      genre: props.genre?.value || "",
      slogan: props.slogan?.value || "",
    },
    200
  );

  useEffect(() => {
    if (style) {
      props.changeStyle(style);
    }
  }, [style]);

  useEffect(() => {
    !!style &&
      setStyle({
        ...style,
        title: {
          ...style.title,
          family: fonts.title || style.title.family,
        },
        author: {
          ...style.author,
          family: fonts.author || style.author.family,
        },
        chap: {
          ...style.chap,
          family: fonts.chap || style.chap.family,
        },
        genre: {
          ...(style.genre! || {}),
          family: fonts.genre || style.genre?.family || "",
        },
      });
  }, [fonts]);

  useEffect(() => {
    setStyle({
      ...style,
      title: {
        ...style.title,
        value: texts.title,
      },
      author: {
        ...style.author,
        value: texts.author,
      },
      chap: {
        ...style.chap,
        value: texts.chap,
      },
      genre: {
        ...(style.genre! || {}),
        value: texts.genre,
      },
      slogan: {
        ...(style.slogan! || {}),
        value: texts.slogan,
      },
    });
  }, [texts]);

  const [storyURL, setStoryURL] = useState(
    style?.general?.url || "https://truyenfull.vn/"
  );
  const [avatarURL, setAvatarURL] = useState(style?.avatar?.url || "");
  const [bgURL, setBgURL] = useState(style?.background?.url || "");
  const [bgModalOpened, setBgModalOpened] = useState(false);

  const applyBackground = (bg?: string) => {
    setStyle({
      ...style,
      background: {
        ...style.background,
        url: bg || bgURL,
      },
    });
  };

  const zoom = (value: number) => {
    setStyle({
      ...style,
      scale: value,
    });
  };

  const changeTitleFont = useCallback(
    (font: { value?: string; type: keyof typeof fonts }) => {
      setFonts({
        ...fonts,
        [font.type]: font.value || fonts.title,
      });
    },
    []
  );

  return (
    <>
      <Accordion
        styles={{
          content: { padding: 8 },
          control: { padding: 8 },
          label: { padding: 4 },
        }}
        multiple
        defaultValue={[SettingTabKey.TITLE.toString()]}
      >
        <Accordion.Item
          key={SettingTabKey.TITLE}
          value={SettingTabKey.TITLE.toString()}
        >
          <Accordion.Control>
            <div className="tw-font-bold tw-text-blue-500">
              Setting Title Info
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
              <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-6">
                    <div className="tw-text-xs">Font Family:</div>
                    <div className="tw-flex tw-gap-2">
                      <SelectFont
                        type="title"
                        onChange={changeTitleFont}
                      ></SelectFont>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Margin X:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.title.margin?.left}
                        value={style.title.margin?.left}
                        step={10}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            title: {
                              ...style.title,
                              margin: {
                                ...style.title.margin,
                                left: parseInt(value.toString()),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Margin Y:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.title.margin?.top}
                        value={style.title.margin?.top}
                        step={10}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            title: {
                              ...style.title,
                              margin: {
                                ...style.title.margin,
                                top: parseInt(value.toString()),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Size:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.title.size}
                        value={style.title.size}
                        step={5}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            title: {
                              ...style.title,
                              size: parseInt(value.toString()),
                            },
                          })
                        }
                      ></NumberInput>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-4">
                    <div className="tw-text-xs">Color:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={style.title.color}
                        value={style.title.color}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            title: { ...style.title, color: value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-4">
                    <div className="tw-text-xs">Shadow:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={style.title.shadow.value}
                        value={style.title.shadow.value}
                        disabled={!style.title.shadow?.enable}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            title: {
                              ...style.title,
                              shadow: { ...style.title.shadow, value: value },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1">
                    <div className="tw-text-xs tw-h-4"></div>
                    <div className="tw-flex tw-gap-2 tw-items-center tw-justify-end tw-h-full tw-pt-1">
                      <Checkbox
                        defaultChecked={!!style.title.shadow?.enable}
                        checked={!!style.title.shadow?.enable}
                        onChange={(e) =>
                          setStyle({
                            ...style,
                            title: {
                              ...style.title,
                              shadow: {
                                ...style.title.shadow,
                                enable: e.currentTarget.checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-w-full">
                  <div className="tw-text-xs">Title:</div>
                  <div className="tw-flex tw-gap-2 tw-w-full">
                    <Textarea
                      className="tw-w-full"
                      defaultValue={texts.title}
                      autosize
                      onChange={(e) =>
                        setTexts({ ...texts, title: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-w-full">
                  <div className="tw-text-xs">Title Design Template:</div>
                  <div className="tw-flex tw-gap-2 tw-w-full">
                    <Textarea
                      className="tw-w-full"
                      defaultValue={style.title.template}
                      onChange={(e) =>
                        setStyle({
                          ...style,
                          title: { ...style.title, template: e.target.value },
                        })
                      }
                      autosize
                    />
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          key={SettingTabKey.CHAP}
          value={SettingTabKey.CHAP.toString()}
        >
          <Accordion.Control>
            <div className="tw-font-bold tw-text-blue-500">
              Setting Chap Info
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
              <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-6">
                    <div className="tw-text-xs">Font Family:</div>
                    <div className="tw-flex tw-gap-2">
                      <SelectFont
                        type="chap"
                        onChange={changeTitleFont}
                      ></SelectFont>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Margin X:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.chap.margin?.left}
                        value={style.chap.margin?.left}
                        step={10}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            chap: {
                              ...style.chap,
                              margin: {
                                ...style.chap.margin,
                                left: parseInt(value.toString()),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Margin Y:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.chap.margin?.top}
                        value={style.chap.margin?.top}
                        step={10}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            chap: {
                              ...style.chap,
                              margin: {
                                ...style.chap.margin,
                                top: parseInt(value.toString()),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Size:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.chap.size}
                        value={style.chap.size}
                        step={5}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            chap: {
                              ...style.chap,
                              size: parseInt(value.toString()),
                            },
                          })
                        }
                      ></NumberInput>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-4">
                    <div className="tw-text-xs">Color:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={style.chap.color}
                        value={style.chap.color}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            chap: { ...style.chap, color: value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-4">
                    <div className="tw-text-xs">Shadow:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={style.chap.shadow.value}
                        value={style.chap.shadow.value}
                        disabled={!style.chap.shadow?.enable}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            chap: {
                              ...style.chap,
                              shadow: { ...style.chap.shadow, value: value },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1">
                    <div className="tw-text-xs tw-h-4"></div>
                    <div className="tw-flex tw-gap-2 tw-items-center tw-justify-end tw-h-full tw-pt-1">
                      <Checkbox
                        defaultChecked={!!style.chap.shadow?.enable}
                        checked={!!style.chap.shadow?.enable}
                        onChange={(e) =>
                          setStyle({
                            ...style,
                            chap: {
                              ...style.chap,
                              shadow: {
                                ...style.chap.shadow,
                                enable: e.currentTarget.checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          key={SettingTabKey.AUTHOR}
          value={SettingTabKey.AUTHOR.toString()}
        >
          <Accordion.Control>
            <div className="tw-font-bold tw-text-blue-500">
              Setting Author Info
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
              <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-6">
                    <div className="tw-text-xs">Font Family:</div>
                    <div className="tw-flex tw-gap-2">
                      <SelectFont
                        type="author"
                        onChange={changeTitleFont}
                      ></SelectFont>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Margin X:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.author.margin?.left}
                        value={style.author.margin?.left}
                        step={10}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            author: {
                              ...style.author,
                              margin: {
                                ...style.author.margin,
                                left: parseInt(value.toString()),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Margin Y:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.author.margin?.top}
                        value={style.author.margin?.top}
                        step={10}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            author: {
                              ...style.author,
                              margin: {
                                ...style.author.margin,
                                top: parseInt(value.toString()),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Size:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.author.size}
                        value={style.author.size}
                        step={5}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            author: {
                              ...style.author,
                              size: parseInt(value.toString()),
                            },
                          })
                        }
                      ></NumberInput>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-4">
                    <div className="tw-text-xs">Color:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={style.author.color}
                        value={style.author.color}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            author: { ...style.author, color: value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-4">
                    <div className="tw-text-xs">Shadow:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={style.author.shadow.value}
                        value={style.author.shadow.value}
                        disabled={!style.author.shadow?.enable}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            author: {
                              ...style.author,
                              shadow: { ...style.author.shadow, value: value },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1">
                    <div className="tw-text-xs tw-h-4"></div>
                    <div className="tw-flex tw-gap-2 tw-items-center tw-justify-end tw-h-full tw-pt-1">
                      <Checkbox
                        defaultChecked={!!style.author.shadow?.enable}
                        checked={!!style.author.shadow?.enable}
                        onChange={(e) =>
                          setStyle({
                            ...style,
                            author: {
                              ...style.author,
                              shadow: {
                                ...style.author.shadow,
                                enable: e.currentTarget.checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-w-full">
                  <div className="tw-text-xs">author:</div>
                  <div className="tw-flex tw-gap-2 tw-w-full">
                    <Textarea
                      className="tw-w-full"
                      defaultValue={style.author.value}
                      onChange={(e) =>
                        setStyle({
                          ...style,
                          author: { ...style.author, value: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw">
                  <Checkbox defaultChecked label="I agree to sell my privacy" />
                </div>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          key={SettingTabKey.GENRE}
          value={SettingTabKey.GENRE.toString()}
        >
          <Accordion.Control>
            <div className="tw-font-bold tw-text-blue-500">Genre Info</div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
              <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-6">
                    <div className="tw-text-xs">Font Family:</div>
                    <div className="tw-flex tw-gap-2">
                      <SelectFont
                        type="genre"
                        onChange={changeTitleFont}
                      ></SelectFont>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Margin X:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.genre?.margin?.left}
                        value={style.genre?.margin?.left}
                        step={10}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            genre: {
                              ...(style.genre! || {}),
                              margin: {
                                ...style.genre?.margin,
                                left: parseInt(value.toString()),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Margin Y:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.genre?.margin?.top}
                        value={style.genre?.margin?.top}
                        step={10}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            genre: {
                              ...(style.genre! || {}),
                              margin: {
                                ...style.genre?.margin,
                                top: parseInt(value.toString()),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Size:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.genre?.size}
                        value={style.genre?.size}
                        step={5}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            genre: {
                              ...(style.genre! || {}),
                              size: parseInt(value.toString()),
                            },
                          })
                        }
                      ></NumberInput>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-4">
                    <div className="tw-text-xs">Color:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={style.genre?.color}
                        value={style.genre?.color}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            genre: { ...(style.genre! || {}), color: value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-4">
                    <div className="tw-text-xs">Shadow:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={style.genre?.shadow.value}
                        value={style.genre?.shadow.value}
                        disabled={!style.genre?.shadow?.enable}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            genre: {
                              ...(style.genre! || {}),
                              shadow: {
                                ...(style.genre?.shadow! || { enable: false }),
                                value: value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1">
                    <div className="tw-text-xs tw-h-4"></div>
                    <div className="tw-flex tw-gap-2 tw-items-center tw-justify-end tw-h-full tw-pt-1">
                      <Checkbox
                        defaultChecked={!!style.genre?.shadow?.enable}
                        checked={!!style.genre?.shadow?.enable}
                        onChange={(e) =>
                          setStyle({
                            ...style,
                            genre: {
                              ...(style.genre! || {}),
                              shadow: {
                                ...(style.genre?.shadow! || { enable: false }),
                                enable: e.currentTarget.checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-w-full">
                  <div className="tw-text-xs">Genre: {style.genre?.value}</div>
                  <div className="tw-flex tw-gap-2 tw-w-full">
                    <Textarea
                      className="tw-w-full"
                      defaultValue={texts.genre}
                      onChange={(e) =>
                        setTexts({ ...texts, genre: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          key={SettingTabKey.SLOGAN}
          value={SettingTabKey.SLOGAN.toString()}
        >
          <Accordion.Control>
            <div className="tw-font-bold tw-text-blue-500">Slogan</div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
              <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-6">
                    <div className="tw-text-xs">Font Family:</div>
                    <div className="tw-flex tw-gap-2">
                      <SelectFont
                        type="slogan"
                        onChange={changeTitleFont}
                      ></SelectFont>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Margin X:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.slogan?.margin?.left}
                        value={style.slogan?.margin?.left}
                        step={10}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            slogan: {
                              ...(style.slogan! || {}),
                              margin: {
                                ...style.slogan?.margin,
                                left: parseInt(value.toString()),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Margin Y:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.slogan?.margin?.top}
                        value={style.slogan?.margin?.top}
                        step={10}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            slogan: {
                              ...(style.slogan! || {}),
                              margin: {
                                ...style.slogan?.margin,
                                top: parseInt(value.toString()),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-3">
                    <div className="tw-text-xs">Size:</div>
                    <div className="tw-flex tw-gap-2">
                      <NumberInput
                        className="tw-w-full"
                        defaultValue={style.slogan?.size}
                        value={style.slogan?.size}
                        step={5}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            slogan: {
                              ...(style.slogan! || {}),
                              size: parseInt(value.toString()),
                            },
                          })
                        }
                      ></NumberInput>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-4">
                    <div className="tw-text-xs">Color:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={style.slogan?.color}
                        value={style.slogan?.color}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            slogan: { ...(style.slogan! || {}), color: value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-col-span-4">
                    <div className="tw-text-xs">Shadow:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={style.slogan?.shadow?.value}
                        value={style.slogan?.shadow?.value}
                        disabled={!style.slogan?.shadow?.enable}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            slogan: {
                              ...(style.slogan! || {}),
                              shadow: {
                                ...(style.slogan?.shadow! || { enable: false }),
                                value: value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1">
                    <div className="tw-text-xs tw-h-4"></div>
                    <div className="tw-flex tw-gap-2 tw-items-center tw-justify-end tw-h-full tw-pt-1">
                      <Checkbox
                        defaultChecked={!!style.slogan?.shadow?.enable}
                        checked={!!style.slogan?.shadow?.enable}
                        onChange={(e) =>
                          setStyle({
                            ...style,
                            slogan: {
                              ...(style.slogan! || {}),
                              shadow: {
                                ...(style.slogan?.shadow! || { enable: false }),
                                enable: e.currentTarget.checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-w-full">
                  <div className="tw-text-xs">
                    Slogan: {style.slogan?.value}
                  </div>
                  <div className="tw-flex tw-gap-2 tw-w-full">
                    <Textarea
                      className="tw-w-full"
                      defaultValue={texts.slogan}
                      onChange={(e) =>
                        setTexts({ ...texts, slogan: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          key={SettingTabKey.AVATAR}
          value={SettingTabKey.AVATAR.toString()}
        >
          <Accordion.Control>
            <div className="tw-font-bold tw-text-blue-500">Setting Avatar</div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
              <div className="tw-flex tw-gap-2 tw-w-full">
                <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-w-full">
                  <div className="tw-text-xs">URL:</div>
                  <div className="tw-flex tw-gap-2">
                    <Input
                      className="tw-flex-1"
                      type="url"
                      value={avatarURL}
                      onChange={(e) => setAvatarURL(e.target.value)}
                    ></Input>
                    <Button
                      onClick={() => {
                        setStyle({
                          ...style,
                          avatar: {
                            ...style.avatar,
                            url: avatarURL,
                          },
                        });
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
              <div className="tw-grid tw-gap-4 tw-grid-cols-2 tw-w-full">
                <div className="tw-flex tw-flex-col tw-gap-2">
                  <div className="tw-text-xs">Background Scale (%):</div>
                  <div>
                    <NumberInput
                      className="tw-w-full"
                      step={10}
                      defaultValue={100}
                      value={style.avatar.bgScale}
                      onChange={(value: any) => {
                        setStyle({
                          ...style,
                          avatar: {
                            ...style.avatar,
                            bgScale: value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-2">
                  <div className="tw-text-xs">Frame Scale (%):</div>
                  <div>
                    <NumberInput
                      className="tw-w-full"
                      step={10}
                      defaultValue={120}
                      value={style.avatar.frameScale}
                      onChange={(value: any) => {
                        setStyle({
                          ...style,
                          avatar: {
                            ...style.avatar,
                            frameScale: value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-2">
                  <div className="tw-text-xs">Posion X (px):</div>
                  <div>
                    <NumberInput
                      className="tw-w-full"
                      step={10}
                      defaultValue={200}
                      value={style.avatar.position?.x}
                      onChange={(value: any) => {
                        setStyle({
                          ...style,
                          avatar: {
                            ...style.avatar,
                            position: {
                              ...style.avatar.position,
                              x: value,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-2">
                  <div className="tw-text-xs">Posion Y (px):</div>
                  <div>
                    <NumberInput
                      className="tw-w-full"
                      step={10}
                      defaultValue={100}
                      value={style.avatar.position?.y}
                      onChange={(value: any) => {
                        setStyle({
                          ...style,
                          avatar: {
                            ...style.avatar,
                            position: {
                              ...style.avatar.position,
                              y: value,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          key={SettingTabKey.BACKGROUND}
          value={SettingTabKey.BACKGROUND.toString()}
        >
          <Accordion.Control>
            <div className="tw-font-bold tw-text-blue-500">
              Setting Background
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
              <div className="tw-flex tw-gap-2 tw-w-full">
                <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-w-full">
                  <div className="tw-text-xs">URL:</div>
                  <div className="tw-flex tw-gap-2">
                    <Input
                      className="tw-flex-1"
                      type="url"
                      value={bgURL}
                      onChange={(e) => setBgURL(e.target.value)}
                    ></Input>
                    <Button
                      variant="default"
                      onClick={() => {
                        setBgModalOpened(true);
                      }}
                    >
                      <IconPhoto size={14} />
                    </Button>
                    <Button onClick={() => applyBackground()}>Apply</Button>
                  </div>
                </div>
              </div>
              <div className="tw-grid tw-gap-4 tw-grid-cols-7 tw-w-full">
                <div className="tw-flex tw-flex-col tw-gap-2 tw-col-span-3">
                  <div className="tw-text-xs">Background Scale (%):</div>
                  <div>
                    <NumberInput
                      className="tw-w-full"
                      step={10}
                      defaultValue={100}
                      value={style.background.bgScale}
                      onChange={(value: any) => {
                        setStyle({
                          ...style,
                          background: {
                            ...style.background,
                            bgScale: value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-2 tw-col-span-2">
                  <div className="tw-text-xs">Posion X (px):</div>
                  <div>
                    <NumberInput
                      className="tw-w-full"
                      step={10}
                      defaultValue={0}
                      value={style.background.position?.x}
                      onChange={(value: any) => {
                        setStyle({
                          ...style,
                          background: {
                            ...style.background,
                            position: {
                              ...style.background.position,
                              x: value,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-2 tw-col-span-2">
                  <div className="tw-text-xs">Posion Y (px):</div>
                  <div>
                    <NumberInput
                      className="tw-w-full"
                      step={10}
                      defaultValue={0}
                      value={style.background.position?.y}
                      onChange={(value: any) => {
                        setStyle({
                          ...style,
                          background: {
                            ...style.background,
                            position: {
                              ...style.background.position,
                              y: value,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <BackgroundModal
        opened={bgModalOpened}
        onClose={(bg) => {
          setBgModalOpened(false);
          if (bg) {
            setBgURL(bg);
            applyBackground(bg);
          }
        }}
      ></BackgroundModal>
    </>
  );
}
