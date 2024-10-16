import {
  Button,
  Checkbox,
  ColorInput,
  JsonInput,
  Modal,
  NumberInput,
  Tabs,
  Textarea,
  Title,
} from "@mantine/core";
import { useEnglishVideo } from "../store-provider";
import { uniq } from "lodash";
import { memo, useEffect, useState } from "react";
import { IconScanEye } from "@tabler/icons-react";
import { SlideManagement } from "./SlideManagement";
import { SlideVoiceScriptConfig } from "./VoiceScriptModal";
import JsonEditor from "@/app/components/JsonEditor";
import { loadFont, SelectFont } from "@/app/components/SelectFont";
import { colors } from "@/app/consts/colors";

export const SlideContentConfig = memo(() => {
  const { currentSlide, setSlide, setViewContentModalOpened, hasConversation } =
    useEnglishVideo((state) => state);

  const [conversation, setConversation] = useState<string>("");

  const [contents, setContents] = useState(
    JSON.stringify(currentSlide()!.contents, null, 4)
  );

  const [styles, setStyles] = useState(
    JSON.stringify(currentSlide()!.styles, null, 4)
  );

  const convertConversation = (conversation: string = "") => {
    function splitCharacters(conversation: string) {
      return uniq(
        conversation
          .split("\n")
          .map((item) =>
            item.split(":").length >= 2 ? item.split(":").shift() : ""
          )
          .filter((item) => !!item?.trim())
          .map((item) => item?.trim())
      );
    }

    function splitSpeeches(conversation: string) {
      return conversation.split("\n").map((item) => {
        const [character, speech] = item.split(":");
        if (character && speech) {
          return {
            character: character?.trim(),
            speech: speech?.trim(),
          };
        }
        if (!speech) {
          return {
            character: null,
            speech: character?.trim(),
          };
        }
      });
    }
    conversation = conversation
      .split("\n")
      .filter((item) => !!item.trim())
      .join("\n");
    const speechs = splitSpeeches(conversation);
    const groupSpeechs: Array<typeof speechs> = [];
    speechs.forEach((item, index) => {
      const currentGroup = groupSpeechs[groupSpeechs.length - 1];
      if (!currentGroup) {
        groupSpeechs.push([item]);
      } else {
        const currentGroupLength = currentGroup.reduce((length, item) => {
          return length + (item?.speech.length ?? 0);
        }, 0);
        if (
          currentGroupLength + (item?.speech.length ?? 0) <
          currentSlide()!.maxChars
        ) {
          groupSpeechs[groupSpeechs.length - 1].push(item);
        } else {
          groupSpeechs.push([item]);
        }
      }
    });
    const contents = groupSpeechs.map((item) => ({
      characters: splitCharacters(conversation),
      speechs: item,
    }));
    setSlide({
      ...currentSlide()!,
      contents,
    });
  };

  return (
    <div className="tw-flex tw-flex-col tw-flex-1 tw-gap-4 tw-max-h-full tw-relative tw-h-full">
      <div className="tw-flex tw-flex-col tw-gap-4 tw-flex-1 tw-overflow-auto tw-h-full">
        <div className="tw-grid tw-grid-cols-4 tw-gap-2">
          <NumberInput
            label="Start Index"
            defaultValue={currentSlide()!.startIndex}
            onChange={(value) =>
              setSlide({
                ...currentSlide()!,
                startIndex: parseFloat(value.toString()),
              })
            }
          />
          <NumberInput
            label="End Index"
            defaultValue={currentSlide()!.endIndex ?? undefined}
            onChange={(value) =>
              setSlide({
                ...currentSlide()!,
                endIndex: value ? parseFloat(value.toString()) : null,
              })
            }
          />
          <NumberInput
            label={
              <div className="tw-flex tw-gap-2 tw-relative tw-w-48">
                <Checkbox
                  label={
                    <span className="tw-cursor-pointer">Split Content</span>
                  }
                  className="tw-absolute -tw-top-4 tw-w-full"
                  defaultChecked={!!currentSlide()!.splitedContent}
                  onChange={(e) =>
                    setSlide({
                      ...currentSlide()!,
                      splitedContent: e.currentTarget.checked ? 1 : null,
                    })
                  }
                />
              </div>
            }
            value={currentSlide()!.splitedContent ?? 0}
            disabled={!currentSlide()!.splitedContent}
            onChange={(value) =>
              setSlide({
                ...currentSlide()!,
                splitedContent: value ? parseFloat(value.toString()) : null,
              })
            }
          />
          <Checkbox
            label="Show Indicator"
            defaultChecked={currentSlide()!.showIndicator ?? false}
            onChange={(e) =>
              setSlide({
                ...currentSlide()!,
                showIndicator: e.currentTarget.checked ? true : false,
              })
            }
          />
        </div>
        {!hasConversation(currentSlide()!.uuid) && (
          <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-h-full tw-pb-4">
            <div className="tw-w-full tw-relative">
              <div className="tw-flex tw-flex-col tw-h-full">
                <div className="tw-text-sm">Edit Contents</div>
                <div className="tw-flex-1">
                  <JsonEditor
                    value={JSON.parse(contents ?? "[]")}
                    onChange={(value) => {
                      setSlide({
                        ...currentSlide()!,
                        contents: value as any,
                      });
                    }}
                  ></JsonEditor>
                </div>
              </div>
              <div
                className="tw-absolute tw-bottom-6 tw-right-2 tw-cursor-pointer tw-p-1"
                onClick={() => setViewContentModalOpened(true, false)}
              >
                <IconScanEye />
              </div>
            </div>
            <div className="tw-w-full tw-relative">
              <div className="tw-flex tw-flex-col tw-h-full">
                <div className="tw-text-sm">Edit Styles</div>
                <div className="tw-flex-1">
                  <JsonEditor
                    value={JSON.parse(styles ?? "[]")}
                    onChange={(value) => {
                      setSlide({
                        ...currentSlide()!,
                        styles: value as any,
                      });
                    }}
                  ></JsonEditor>
                </div>
              </div>
            </div>
          </div>
        )}
        {hasConversation(currentSlide()!.uuid) && (
          <>
            <div className="tw-flex tw-gap-2 tw-items-end">
              <NumberInput
                className="tw-flex-1"
                label={`Max Chars`}
                step={50}
                defaultValue={currentSlide()!.maxChars}
                onChange={(vallue) => {
                  setSlide({
                    ...currentSlide()!,
                    maxChars: parseInt(vallue.toString()),
                  });
                }}
              />
              <Button
                onClick={() => {
                  let value = conversation;
                  if (!conversation) {
                    value = currentSlide()!
                      .contents.map((item) => {
                        return item.speechs
                          ?.map(
                            (speech: any) =>
                              `${
                                speech.character ? `${speech.character}: ` : ""
                              }${speech.speech}`
                          )
                          .join("\n\n");
                      })
                      .join("\n\n");
                  }
                  convertConversation(value);
                }}
              >
                Apply
              </Button>
            </div>
            <Textarea
              rows={15}
              label="Conversation"
              defaultValue={currentSlide()!
                .contents.map((item) => {
                  return item.speechs
                    ?.map(
                      (speech: any) =>
                        `${speech.character ? `${speech.character}: ` : ""}${
                          speech.speech
                        }`
                    )
                    .join("\n\n");
                })
                .join("\n\n")}
              onChange={(event) => {
                convertConversation(event.target.value);
                setConversation(event.target.value);
              }}
            ></Textarea>
            <JsonInput
              rows={15}
              label="Difficult words"
              defaultValue={JSON.stringify(
                currentSlide()!.difficultWords,
                null,
                4
              )}
              onChange={(value) => {
                try {
                  setSlide({
                    ...currentSlide()!,
                    difficultWords: JSON.parse(value),
                  });
                } catch (e) {}
              }}
            ></JsonInput>
          </>
        )}
      </div>
    </div>
  );
});

export function SetConfigModal(props: { copyValue: string }) {
  const { configModalOpened, currentSlide, setConfigModalOpened, setSlide } =
    useEnglishVideo((state) => state);

  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(false);
  }, [currentSlide()!.uuid]);

  useEffect(() => {
    !rendered && setRendered(true);
  }, [rendered]);

  const [activeTab, setActiveTab] = useState<
    "contents" | "voices" | "difficult_words"
  >("contents");

  return (
    <Modal
      opened={configModalOpened}
      onClose={() => setConfigModalOpened(false)}
      title={<Title order={5}>Content Config</Title>}
      size={"xl"}
      fullScreen
      className="tw-h-full"
    >
      <div className="tw-flex tw-gap-4 tw-w-full tw-h-[calc(100vh_-_76px)]">
        <div className="tw-w-36 tw-h-full tw-relative">
          <SlideManagement
            isView={false}
            direcrion="vertical"
            align={{ top: 76 }}
          ></SlideManagement>
          {!rendered && (
            <div className="tw-w-full tw-h-full tw-absolute tw-top-0"></div>
          )}
        </div>
        {rendered && (
          <Tabs
            className="tw-w-full tw-h-[calc(100vh_-_96px)]"
            color="teal"
            value={activeTab}
            onChange={(tab: any) => setActiveTab(tab)}
          >
            <Tabs.List>
              <Tabs.Tab value="contents">Content Config</Tabs.Tab>
              <Tabs.Tab value="voices" color="blue">
                Voice Script Config
              </Tabs.Tab>
              <Tabs.Tab value="difficult_words" color="blue">
                Difficult words
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="contents" pt="xs" className="tw-h-full">
              <SlideContentConfig />
            </Tabs.Panel>

            <Tabs.Panel value="voices" pt="xs" className="tw-h-full">
              {activeTab === "voices" && <SlideVoiceScriptConfig />}
            </Tabs.Panel>
            <Tabs.Panel value="difficult_words" pt="xs" className="tw-h-full">
              {activeTab === "difficult_words" && (
                <div className="tw-max-h-full tw-relative tw-h-full">
                  <div className="tw-w-full tw-relative tw-h-full tw-pb-4 tw-flex tw-flex-col tw-gap-2">
                    <div className="tw-grid tw-grid-cols-4 tw-gap-2">
                      <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1">
                        <div className="tw-text-sm">Font Family:</div>
                        <div className="tw-flex tw-gap-2">
                          <SelectFont
                            type=""
                            value={
                              currentSlide()?.difficultWordStyles?.fontFamily
                            }
                            onChange={(font) => {
                              setSlide({
                                ...currentSlide()!,
                                difficultWordStyles: {
                                  ...(currentSlide()?.difficultWordStyles ??
                                    {}),
                                  fontFamily: font.value,
                                },
                              });
                              loadFont(
                                `https://fonts.googleapis.com/css?family=${font.value}`
                              );
                            }}
                          ></SelectFont>
                        </div>
                      </div>
                      <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1">
                        <div className="tw-text-sm">Color:</div>
                        <div className="tw-flex tw-gap-2">
                          <ColorInput
                            className="tw-w-full"
                            format="hex"
                            swatches={colors}
                            defaultValue={
                              currentSlide()?.difficultWordStyles?.color ??
                              "#78350f"
                            }
                            value={
                              currentSlide()?.difficultWordStyles?.color ??
                              "#78350f"
                            }
                            onChange={(value) => {
                              setSlide({
                                ...currentSlide()!,
                                difficultWordStyles: {
                                  ...(currentSlide()?.difficultWordStyles ??
                                    {}),
                                  color: value,
                                },
                              });
                            }}
                          />
                        </div>
                        {/* <div className="tw-text-xs">Color:</div>
                    <div className="tw-flex tw-gap-2">
                      <ColorInput
                        className="tw-w-full"
                        format="hex"
                        swatches={colors}
                        defaultValue={currentSlide()!.difficultWordStyles!.color}
                        value={currentSlide()!.difficultWordStyles!.color}
                        onChange={(value) =>
                          setStyle({
                            ...style,
                            title: { ...style.title, color: value },
                          })
                        }
                      />
                    </div> */}
                      </div>
                    </div>
                    <div className="tw-flex tw-flex-col tw-h-full tw-flex-1">
                      <div className="tw-text-sm">Edit Difficult Words</div>
                      <div className="tw-flex-1">
                        <JsonEditor
                          value={currentSlide()?.difficultWords ?? []}
                          onChange={(value) => {
                            setSlide({
                              ...currentSlide()!,
                              difficultWords: value as any,
                            });
                          }}
                        ></JsonEditor>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Tabs.Panel>
          </Tabs>
        )}
      </div>
    </Modal>
  );
}
