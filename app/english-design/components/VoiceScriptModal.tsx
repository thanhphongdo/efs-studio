import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ScrollArea,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useEnglishVideo } from "../store-provider";
import { VoiceItem, voices, VoiceScriptItem } from "../store";
import Draggable from "react-draggable";
import {
  IconLayoutList,
  IconPlayerPlay,
  IconPlus,
  IconPlusEqual,
  IconTrash,
  IconVolume,
} from "@tabler/icons-react";
import { v4 } from "uuid";

const VoiceScriptList = () => {
  const { currentSlide, setSlide } = useEnglishVideo((s) => s);

  const [voiceScriptItems, setVoiceScriptItems] = useState<VoiceScriptItem[]>(
    currentSlide()?.voiceScriptItems || []
  );

  const onStop = (e: any, data: any, index: any) => {
    const newOrder = [...currentSlide()!.voiceScriptItems];
    const [removed] = newOrder.splice(index, 1);
    newOrder.splice(index + Math.sign(data.y), 0, removed);
    setVoiceScriptItems(newOrder);
  };

  useEffect(() => {
    setSlide({
      ...currentSlide()!,
      voiceScriptItems: [...voiceScriptItems],
    });
  }, [voiceScriptItems]);

  useEffect(() => {
    setVoiceScriptItems(currentSlide()?.voiceScriptItems || []);
  }, [currentSlide()?.voiceScriptItems]);

  const [selectVoiceModalOpened, setSelectVoiceModalOpened] = useState(false);
  const [currentVoiceItem, setCurrentVoiceItem] = useState<VoiceItem>();

  return (
    <>
      <ScrollArea className="tw-h-full" h={900}>
        <div className="tw-w-full tw-overflow-auto">
          {voiceScriptItems?.map((item, index) => (
            <Draggable
              key={item?.voiceId}
              axis="y"
              onStop={(e, data) => onStop(e, data, index)}
              position={{ x: 0, y: 0 }}
            >
              <div className="tw-bg-gray-950 tw-p-4 tw-mb-2 tw-cursor-move">
                <div className="tw-col-span-6 tw-font-bold tw-flex tw-justify-between">
                  <span>Key: {item.key}</span>
                  <div
                    className="tw-p-1 tw-rounded-md tw-bg-slate-500 tw-text-white tw-cursor-pointer"
                    onClick={() => {
                      item.voices.push({
                        voice: voices[0].voice,
                        rate: currentSlide()!.type === "Long" ? "-10%" : "+10%",
                      });
                      setVoiceScriptItems([...voiceScriptItems]);
                    }}
                  >
                    <IconPlus></IconPlus>
                  </div>
                </div>
                {item?.voices?.map((voice, index) => (
                  <>
                    <div
                      key={voice.voice}
                      className="tw-grid tw-grid-cols-6 tw-gap-2 tw-pt-2"
                    >
                      <div className="tw-col-span-3 tw-flex tw-gap-2 tw-items-end tw-pr-4">
                        <TextInput
                          className="tw-flex-1"
                          label="Voice"
                          defaultValue={voice.voice}
                          rightSection={<IconLayoutList />}
                          readOnly
                          onClick={() => {
                            setSelectVoiceModalOpened(true);
                            setCurrentVoiceItem(voice);
                          }}
                        />
                        <div
                          className="tw-p-1 tw-rounded-md tw-bg-slate-500 tw-text-green-600 tw-cursor-pointer tw-mb-[2px]"
                          onClick={() => {
                            const audio = new Audio(
                              `/voices/voice-${voice.voice}.mp3`
                            );
                            audio.play();
                          }}
                        >
                          <IconPlayerPlay />
                        </div>
                      </div>
                      <div className="tw-col-span-1">
                        <TextInput
                          label="Rate"
                          defaultValue={voice.rate}
                          onChange={(e) => {
                            voice.rate = e.target.value;
                            setVoiceScriptItems([...voiceScriptItems]);
                          }}
                        ></TextInput>
                      </div>
                      <div className="tw-col-span-2 tw-flex tw-gap-2 tw-items-end">
                        <TextInput
                          className="tw-flex-1"
                          label="Character"
                          defaultValue={voice.character}
                          onChange={(e) => {
                            voice.character = e.target.value;
                            setVoiceScriptItems([...voiceScriptItems]);
                          }}
                        ></TextInput>
                        <div
                          className="tw-p-1 tw-rounded-md tw-bg-slate-500 tw-text-red-600 tw-cursor-pointer tw-mb-[2px]"
                          onClick={() => {
                            item.voices = [
                              ...item.voices.slice(0, index),
                              ...item.voices.slice(index + 1),
                            ];
                            setVoiceScriptItems(
                              [...voiceScriptItems].filter(
                                (item) => item.voices.length > 0
                              )
                            );
                          }}
                        >
                          <IconTrash></IconTrash>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </Draggable>
          ))}
        </div>
      </ScrollArea>
      <Modal
        opened={selectVoiceModalOpened}
        onClose={() => setSelectVoiceModalOpened(false)}
        title={<Title order={5}>Set Voice</Title>}
        size={"md"}
        centered
        className="tw-h-full"
      >
        {!!currentVoiceItem && (
          <div className="tw-col-span-3 tw-flex tw-gap-2 tw-items-end tw-pr-4">
            <Select
              className="tw-flex-1"
              label="Voice"
              data={voices.map((item) => ({
                label: `${item.voice} - ${item.gender}`,
                value: item.voice,
              }))}
              defaultValue={currentVoiceItem?.voice}
              onChange={(value) => {
                if (!value) return;
                currentVoiceItem.voice = value!;
                setVoiceScriptItems([...voiceScriptItems]);
              }}
            ></Select>
            <div
              className="tw-p-1 tw-rounded-md tw-bg-slate-500 tw-text-green-600 tw-cursor-pointer tw-mb-[2px]"
              onClick={() => {
                const audio = new Audio(
                  `/voices/voice-${currentVoiceItem.voice}.mp3`
                );
                audio.play();
              }}
            >
              <IconPlayerPlay />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export function SlideVoiceScriptConfig() {
  const { currentSlide, setSlide } = useEnglishVideo((s) => s);
  return (
    <div className="tw-h-full tw-flex tw-flex-col tw-gap-4">
      <div className="tw-grid tw-grid-cols-3 sm:tw-grid-cols-4 md:tw-grid-cols-6 lg:tw-grid-cols-10 tw-gap-2 tw-justify-end tw-w-full">
        <Button
          className="tw-col-span-2"
          color="yellow"
          onClick={() => {
            const scripts: Array<VoiceScriptItem> = currentSlide()!
              .shapes.filter((shape) => !!shape.key)
              .map((shape) => {
                const voiceScripts: VoiceScriptItem["voices"] = [];
                switch (shape.type) {
                  case "Normal":
                  case "Paragraph":
                    voiceScripts.push({
                      voice: voices[0].voice,
                      rate: currentSlide()!.type === "Long" ? "-10%" : "+10%",
                    });
                    break;
                  case "Conversation":
                    voiceScripts.push({
                      voice: voices[0].voice,
                      rate: currentSlide()!.type === "Long" ? "-10%" : "+10%",
                      character: "Bob",
                    });
                    voiceScripts.push({
                      voice: voices[9].voice,
                      rate: currentSlide()!.type === "Long" ? "-10%" : "+10%",
                      character: "Alice",
                    });
                    break;
                }
                return {
                  voiceId: v4(),
                  id: shape.uuid,
                  key: shape.key,
                  slideUUID: currentSlide()!.uuid,
                  voices: voiceScripts,
                };
              });
            setSlide({
              ...currentSlide()!,
              voiceScriptItems: scripts,
            });
          }}
        >
          Reset Voice Script
        </Button>
        {currentSlide()!
          .shapes.filter((shape) => !!shape.key)
          .map((item) => ({
            id: item.uuid,
            ...item,
          }))
          .map((shape) => (
            <Button
              key={shape.key}
              onClick={() => {
                setSlide({
                  ...currentSlide()!,
                  voiceScriptItems: [
                    ...currentSlide()!.voiceScriptItems,
                    {
                      voiceId: v4(),
                      id: shape.uuid,
                      key: shape.key,
                      voices: [
                        {
                          voice: voices[0].voice,
                          rate: "",
                        },
                      ],
                    },
                  ],
                });
              }}
            >
              [{shape.key}]
            </Button>
          ))}
      </div>
      <div className="tw-flex tw-flex-col tw-max-h-full tw-relative tw-flex-1">
        <VoiceScriptList></VoiceScriptList>
      </div>
    </div>
  );
}

export function VoiceScriptModal() {
  const {
    voiceScriptModalOpened,
    voiceScriptItems,
    currentSlide,
    setSlide,
    setVoiceScriptModalOpened,
  } = useEnglishVideo((s) => s);

  return (
    <Modal
      opened={voiceScriptModalOpened}
      onClose={() => setVoiceScriptModalOpened(false)}
      title={<Title order={5}>Set Config</Title>}
      size={"xl"}
      className="tw-h-full custom-modal"
    >
      <SlideVoiceScriptConfig></SlideVoiceScriptConfig>
      {/* <div className="tw-h-full tw-flex tw-flex-col tw-pb-40">
        <div className="tw-flex tw-flex-col tw-max-h-full tw-relative tw-flex-1">
          <div className="tw-relative tw-overflow-auto tw-h-full">
            <VoiceScriptList></VoiceScriptList>
          </div>
        </div>
        <div className="tw-grid tw-grid-cols-3 tw-gap-4 tw-justify-end tw-absolute tw-w-full tw-left-0 -tw-bottom-12 tw-px-4">
          <Button
            color="yellow"
            onClick={() => {
              const scripts: Array<VoiceScriptItem> = shapes
                .filter((shape) => !!shape.key)
                .map((shape) => {
                  const voiceScripts: VoiceScriptItem["voices"] = [];
                  switch (shape.type) {
                    case "Normal":
                    case "Paragraph":
                      voiceScripts.push({
                        voice: voices[0].voice,
                        rate: videoType === "Long" ? "-10%" : "+10%",
                      });
                      break;
                    case "Conversation":
                      voiceScripts.push({
                        voice: voices[0].voice,
                        rate: videoType === "Long" ? "-10%" : "+10%",
                        character: "Bob",
                      });
                      voiceScripts.push({
                        voice: voices[9].voice,
                        rate: videoType === "Long" ? "-10%" : "+10%",
                        character: "Alice",
                      });
                      break;
                  }
                  return {
                    voiceId: v4(),
                    id: shape.uuid,
                    key: shape.key,
                    slideUUID: currentSlide()!.uuid,
                    voices: voiceScripts,
                  };
                });
              // setVoiceScriptItems(scripts);
              setSlide({
                ...currentSlide()!,
                voiceScriptItems: scripts,
              });
            }}
          >
            Reset Voice Script
          </Button>
          {shapes
            .filter((shape) => !!shape.key)
            .map((item) => ({
              id: item.uuid,
              ...item,
            }))
            .map((shape) => (
              <Button
                key={shape.key}
                onClick={() => {
                  setVoiceScriptItems([
                    ...voiceScriptItems,
                    {
                      voiceId: v4(),
                      id: shape.uuid,
                      key: shape.key,
                      slideUUID: currentSlide()!.uuid,
                      voices: [
                        {
                          voice: voices[0].voice,
                          rate: "",
                        },
                      ],
                    },
                  ]);
                }}
              >
                Add [{shape.key}]
              </Button>
            ))}
        </div>
      </div> */}
    </Modal>
  );
}
