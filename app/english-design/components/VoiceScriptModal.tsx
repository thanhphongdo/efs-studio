import React, { Fragment, useEffect, useState } from "react";
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
import { IconPlayerPlay, IconPlus, IconTrash } from "@tabler/icons-react";
import { v4 } from "uuid";
import { openConfirmModal } from "@mantine/modals";

const VoiceScriptList = (props: {
  voiceScriptItems: VoiceScriptItem[];
  slidePartUUID: string;
}) => {
  const { currentSlide, setSlide } = useEnglishVideo((s) => s);

  const getVoiceScriptItems = () => [
    ...(currentSlide()!.voiceScriptItems?.[props.slidePartUUID] ?? []),
  ];

  const onStop = (e: any, data: any, index: any) => {
    const newOrder = [...getVoiceScriptItems()];
    const [removed] = newOrder.splice(index, 1);
    newOrder.splice(index + Math.sign(data.y), 0, removed);
    changeVoiceScripItems(newOrder);
  };

  const changeVoiceScripItems = (items: VoiceScriptItem[]) => {
    setSlide({
      ...currentSlide()!,
      voiceScriptItems: {
        ...currentSlide()!.voiceScriptItems,
        [props.slidePartUUID]: [...items],
      },
    });
  };

  return (
    <div className="tw-w-full tw-overflow-auto">
      {getVoiceScriptItems()?.map((item, index) => (
        <Fragment key={item?.voiceId}>
          <Draggable
            axis="y"
            onStop={(e, data) => onStop(e, data, index)}
            position={{ x: 0, y: 0 }}
          >
            <div
              className="tw-bg-gray-950 tw-p-4 tw-mb-2 tw-cursor-move"
              key={item?.voiceId}
            >
              <div className="tw-col-span-6 tw-font-bold tw-flex tw-justify-between">
                <span>Key: {item.key}</span>
                <div
                  className="tw-p-1 tw-rounded-md tw-bg-slate-500 tw-text-white tw-cursor-pointer"
                  onClick={() => {
                    item.voices.push({
                      voice: voices[0].voice,
                      rate: currentSlide()!.type === "Long" ? "-10%" : "+10%",
                    });
                    changeVoiceScripItems([...getVoiceScriptItems()]);
                  }}
                >
                  <IconPlus></IconPlus>
                </div>
              </div>
              {item?.voices?.map((voice, index) => (
                <Fragment key={voice.voice}>
                  <div className="tw-grid tw-grid-cols-6 tw-gap-2 tw-pt-2">
                    <div className="tw-col-span-3 tw-flex tw-gap-2 tw-items-end tw-pr-4">
                      <Select
                        className="tw-flex-1"
                        label="Voice"
                        data={voices.map((item) => ({
                          label: `${item.voice} - ${item.gender}`,
                          value: item.voice,
                        }))}
                        defaultValue={voice.voice}
                        onChange={(value) => {
                          voice.voice = value!;
                          changeVoiceScripItems([...getVoiceScriptItems()]);
                        }}
                        searchable
                      ></Select>
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
                          changeVoiceScripItems([...getVoiceScriptItems()]);
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
                          changeVoiceScripItems([...getVoiceScriptItems()]);
                        }}
                      ></TextInput>
                      <div
                        className="tw-p-1 tw-rounded-md tw-bg-slate-500 tw-text-red-600 tw-cursor-pointer tw-mb-[2px]"
                        onClick={() => {
                          item.voices = [
                            ...item.voices.slice(0, index),
                            ...item.voices.slice(index + 1),
                          ];
                          changeVoiceScripItems(
                            [...getVoiceScriptItems()].filter(
                              (item) => item.voices.length > 0
                            )
                          );
                        }}
                      >
                        <IconTrash></IconTrash>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </Draggable>
        </Fragment>
      ))}
    </div>
  );
};

export function SlideVoiceScriptConfig() {
  const { currentSlide, setSlide } = useEnglishVideo((s) => s);
  const [slidePartUUID, setSlidePartUUID] = useState<string>(
    currentSlide()!.activePart
  );
  return (
    <div className="tw-h-full tw-flex tw-flex-col tw-gap-4">
      <div className="tw-flex tw-flex-col tw-gap-1">
        <div className="tw-text-sm">Select Slide Part</div>
        <div className="tw-flex tw-gap-1">
          {currentSlide()?.slideParts?.map((part, index) => (
            <div
              key={part}
              className={`tw-w-8 tw-h-8 tw-rounded-sm tw-flex tw-items-center tw-justify-center tw-cursor-pointer tw-font-bold ${
                part === slidePartUUID
                  ? "tw-bg-red-400 tw-text-slate-200"
                  : "tw-bg-slate-400 tw-text-slate-900"
              }`}
              onClick={() => setSlidePartUUID(part)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="tw-grid tw-grid-cols-3 sm:tw-grid-cols-4 md:tw-grid-cols-5 lg:tw-grid-cols-8 tw-gap-2 tw-justify-end tw-w-full">
        <Button
          className="!tw-p-1"
          color="red"
          onClick={() => {
            openConfirmModal({
              modalId: "delete-voice-scrip-config",
              centered: true,
              title: "Delete Voice Scrip Config",
              children: (
                <div>
                  Do you want to delete the voice script config of this slide
                  part?
                </div>
              ),
              labels: {
                confirm: "Confirm",
                cancel: "Cancel",
              },
              onConfirm: async () => {
                setSlide({
                  ...currentSlide()!,
                  voiceScriptItems: {
                    ...currentSlide()!.voiceScriptItems,
                    [slidePartUUID]: [],
                  },
                });
              },
              confirmProps: { color: "red" },
              closeOnConfirm: true,
              closeOnCancel: true,
            });
          }}
        >
          Delete All
        </Button>
        {currentSlide()!
          .shapes.filter((shape) => !!shape.key)
          .map((item) => ({
            id: item.uuid,
            ...item,
          }))
          .sort((item1, item2) => item1.key.localeCompare(item2.key))
          .map((shape) => (
            <Button
              key={shape.key}
              onClick={() => {
                setSlide({
                  ...currentSlide()!,
                  voiceScriptItems: {
                    ...currentSlide()?.voiceScriptItems,
                    [slidePartUUID]: [
                      ...(currentSlide()?.voiceScriptItems?.[slidePartUUID] ??
                        []),
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
                  },
                });
              }}
            >
              [{shape.key}]
            </Button>
          ))}
      </div>
      <div className="tw-flex tw-flex-col tw-max-h-full tw-relative tw-flex-1">
        <ScrollArea className="tw-h-full" h={900}>
          <VoiceScriptList
            slidePartUUID={slidePartUUID}
            voiceScriptItems={currentSlide()!.voiceScriptItems[slidePartUUID]}
          ></VoiceScriptList>
        </ScrollArea>
      </div>
    </div>
  );
}

export function VoiceScriptModal() {
  const { voiceScriptModalOpened, setVoiceScriptModalOpened, currentSlide } =
    useEnglishVideo((s) => s);

  const [currentSlidePartUUID, setCurrentSlidePartUUID] = useState<string>(
    currentSlide()!.activePart
  );

  useEffect(() => {
    setCurrentSlidePartUUID(currentSlide()!.activePart);
  }, [currentSlide()!.activePart]);

  return (
    <Modal
      opened={voiceScriptModalOpened}
      onClose={() => setVoiceScriptModalOpened(false)}
      title={<Title order={5}>Voice Script Config</Title>}
      size={"xl"}
      className="tw-h-full custom-modal"
    >
      <SlideVoiceScriptConfig></SlideVoiceScriptConfig>
    </Modal>
  );
}
