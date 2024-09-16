import {
  Button,
  Checkbox,
  JsonInput,
  Modal,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useEnglishVideo } from "../store-provider";
import axios from "axios";
import { Env } from "@/app/consts/env";
import { IconExternalLink, IconScanEye } from "@tabler/icons-react";
import DayJS from "dayjs";
import { ChangeEvent } from "react";
import { loadFont } from "@/app/components/SelectFont";
import { flatten, uniq } from "lodash";
import { EnglishVideoState } from "../store";

export function SetMainConfigModal(props: { copyValue: string }) {
  const {
    videoTitle,
    endVideoTitle,
    videoThumbnail,
    endVideoThumbnail,
    mainConfigModalOpened,
    music,
    currentSlide,
    setVideoTitle,
    setEndVideoTitle,
    setVideoThumbnail,
    setEndVideoThumbnail,
    setMainConfigModalOpened,
    setCopyConfigModalOpened,
    setCopyType,
    getAll,
    setAll,
    zoom,
    setMusic,
    setConfiguationHistoryModalOpened,
  } = useEnglishVideo((state) => state);

  const hasConversation = () => {
    return (
      currentSlide()!.shapes.findIndex(
        (item) => item.type === "Conversation"
      ) >= 0
    );
  };

  const getConfig = () => {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem("UpdateVesselScheduleStore");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result as string;
        const { state }: { state: EnglishVideoState } = JSON.parse(fileContent);
        setAll(state);
        const fonts: Array<string> = [];
        flatten(state.slides.map((item) => item.shapes)).forEach((shape) => {
          shape.styles.forEach((item) => {
            if (item.name === "fontFamily" && item.value) {
              fonts.push(item.value);
            }
          });
        });
        uniq(fonts).forEach((font) => {
          loadFont(`https://fonts.googleapis.com/css?family=${font}`);
        });
        zoom(0.5);
      };
      reader.onerror = () => {
        console.error("File reading error:", reader.error);
      };
      reader.readAsText(file); // Read file as text (use readAsDataURL for images, etc.)
    }
  };

  return (
    <Modal
      opened={mainConfigModalOpened}
      onClose={() => setMainConfigModalOpened(false)}
      title={<Title order={5}>Master Config</Title>}
      size={"xl"}
      className="tw-h-full custom-modal"
    >
      <div className="tw-flex tw-flex-col tw-gap-4 tw-max-h-full tw-relative">
        <div className="tw-flex tw-flex-col tw-gap-4 tw-flex-1 tw-overflow-auto">
          <Textarea
            label="Video Title"
            rows={3}
            defaultValue={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          ></Textarea>
          <Textarea
            label="End Video Title"
            rows={3}
            defaultValue={endVideoTitle}
            onChange={(e) => setEndVideoTitle(e.target.value)}
          ></Textarea>
          <div className="tw-grid tw-grid-cols-2 tw-gap-2">
            <div className="tw-relative">
              <Select
                label="Music"
                data={Array.from({ length: 7 }).map(
                  (item, index) =>
                    `music-${(index + 1).toString().padStart(3, "0")}.mp3`
                )}
                defaultValue={music?.name}
                onChange={(name) => setMusic(name!, music?.volumex!)}
              />
            </div>
            <div className="tw-relative">
              <NumberInput
                label="Volumex"
                defaultValue={music?.volumex ?? undefined}
                step={0.05}
                decimalScale={2}
                fixedDecimalScale
                onChange={(volumex) =>
                  setMusic(music?.name!, parseFloat(volumex.toString()))
                }
              />
            </div>
          </div>
          <div className="tw-grid tw-grid-cols-2 tw-gap-2">
            <div className="tw-relative">
              <TextInput
                label={
                  <div className="tw-flex tw-gap-2">
                    <span>Video Thunbnail URL</span>
                    <IconExternalLink
                      className="tw-pb-1 tw-cursor-pointer"
                      onClick={() => {
                        (window as any).open(videoThumbnail, "_blank");
                      }}
                    />
                  </div>
                }
                defaultValue={videoThumbnail}
                onChange={(e) => setVideoThumbnail(e.target.value)}
              />
            </div>
            <div className="tw-relative">
              <TextInput
                label={
                  <div className="tw-flex tw-gap-2">
                    <span>End Video Thunbnail URL</span>
                    <IconExternalLink
                      className="tw-pb-1 tw-cursor-pointer"
                      onClick={() =>
                        (window as any).open(endVideoThumbnail, "_blank")
                      }
                    />
                  </div>
                }
                defaultValue={endVideoThumbnail}
                onChange={(e) => setEndVideoThumbnail(e.target.value)}
              />
            </div>
          </div>
          <JsonInput
            label="Config"
            rows={9}
            className="tw-w-full"
            value={JSON.stringify(JSON.parse(getConfig() ?? "{}"), null, 4)}
          ></JsonInput>
        </div>
      </div>
      <div className="tw-flex tw-gap-2 tw-justify-end tw-absolute tw-w-full tw-left-0 -tw-bottom-12 tw-px-4">
        <Button
          color="orange"
          onClick={async () => {
            const res = await axios.post(`${Env.API}/make-video`, {
              speechId: Date.now().toString(),
              config: props.copyValue,
            });
          }}
        >
          Make Video
        </Button>
        <Button
          color="cyan"
          onClick={() => {
            const blob = new Blob(
              [
                JSON.stringify({
                  state: getAll(),
                }),
              ],
              { type: "application/json" }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${DayJS().format("YYYY-MM-DD-HH-mm-ss-SSS")}.json`;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          Export
        </Button>
        <Button
          color="green"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          Import
        </Button>
        <Button
          color="yellow"
          onClick={() => setConfiguationHistoryModalOpened(true)}
        >
          History
        </Button>
        <div className="tw-flex-1"></div>
        <Button
          onClick={() => {
            setCopyType("Speech");
            setCopyConfigModalOpened(true);
          }}
        >
          Copy Speech Config
        </Button>
        <Button
          onClick={() => {
            setCopyType("Video");
            setCopyConfigModalOpened(true);
          }}
        >
          Copy Video Config
        </Button>
      </div>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="fileInput"
      />
    </Modal>
  );
}
