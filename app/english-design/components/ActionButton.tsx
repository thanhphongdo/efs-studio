import { Button, ScrollArea } from "@mantine/core";
import { DesignWidget } from "./DesignWidget";
import { useEnglishVideo } from "../store-provider";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCrop32,
  IconCrop32Filled,
  IconCropPortrait,
  IconCropPortraitFilled,
  IconZoom,
} from "@tabler/icons-react";
import { v4 } from "uuid";
import { openConfirmModal } from "@mantine/modals";
import { useConfigurationHistory } from "@/app/hooks/configuation-history.hook";
import { ConfiguationHistoryModal } from "./ConfiguationHistoryModal";

export function ActionButton(props: { isView: boolean }) {
  const {
    slides,
    showDesignWidget,
    scale,
    addShape,
    getShapes,
    setContentIndex,
    deleteAllShapes,
    reset,
    setMainConfigModalOpened,
    setConfigModalOpened,
    zoom,
    setVideoType,
    currentSlide,
    getMainSlide,
    setShowDesignWidget,
    setConfiguationHistoryModalOpened,
  } = useEnglishVideo((state) => state);

  const historyListKey = "history_list";

  // const [opened, { open, close }] = useDisclosure(false);

  const { db, historyList, saveHistory, applyHistory, deleteHistory } =
    useConfigurationHistory();

  const zoomStick = () => {
    if (scale <= 0.224) {
      zoom(1);
    } else if (scale <= 0.5) {
      zoom(0.224);
    } else if (scale == 1) {
      zoom(0.5);
    } else {
      zoom(1);
    }
  };

  return (
    <>
      <div
        className={`tw-h-full tw-flex tw-flex-col tw-bg-zinc-900 tw-relative ${
          props.isView ? "tw-hidden" : ""
        }`}
        style={{
          width: showDesignWidget ? "calc(100vw - 400px)" : undefined,
        }}
      >
        <div
          className="tw-absolute tw-cursor-pointer tw-w-6 tw-h-16 tw-bg-white/20 tw-top-8 -tw-left-6 tw-rounded-l-2xl tw-flex tw-items-center tw-justify-center"
          onClick={() => setShowDesignWidget(!showDesignWidget)}
        >
          {!showDesignWidget && <IconChevronLeft />}
          {showDesignWidget && <IconChevronRight />}
        </div>
        {showDesignWidget && (
          <>
            <div className="tw-grid tw-grid-cols-1 tw-gap-2 tw-p-2">
              <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                <div className="tw-flex tw-gap-2">
                  <Button
                    className="!tw-p-2 tw-flex-1"
                    color="cyan"
                    onClick={() => {
                      if (currentSlide()!.type === "Long") {
                        setVideoType(currentSlide()!.uuid, "Short");
                      } else {
                        setVideoType(currentSlide()!.uuid, "Long");
                      }
                    }}
                  >
                    {currentSlide()!.type === "Long" && (
                      <>
                        <IconCrop32Filled />
                        <IconCropPortrait className="tw-opacity-50" />
                      </>
                    )}
                    {currentSlide()!.type === "Short" && (
                      <>
                        <IconCropPortraitFilled />
                        <IconCrop32 className="tw-opacity-50" />
                      </>
                    )}
                  </Button>
                  <Button
                    color="yellow"
                    onClick={() => setConfiguationHistoryModalOpened(true)}
                  >
                    History
                  </Button>
                </div>
                <Button.Group className="tw-w-full tw-flex">
                  <Button variant="default" onClick={() => zoom(scale - 0.1)}>
                    -
                  </Button>
                  <Button
                    variant="default"
                    className="tw-flex-1"
                    onClick={() => zoomStick()}
                  >
                    <IconZoom size={16} />
                  </Button>
                  <Button variant="default" onClick={() => zoom(scale + 0.1)}>
                    +
                  </Button>
                </Button.Group>
              </div>
              <div className="tw-grid tw-grid-cols-3 tw-gap-2">
                <Button
                  className="!tw-p-2 tw-flex-1"
                  onClick={() => {
                    setConfigModalOpened(true);
                  }}
                >
                  Content
                </Button>
                <Button
                  disabled={currentSlide()!.contentIndex === 0}
                  onClick={() =>
                    setContentIndex(
                      currentSlide()!.uuid,
                      currentSlide()!.contentIndex - 1
                    )
                  }
                >
                  Prev
                </Button>
                <Button
                  disabled={
                    currentSlide()!.contentIndex ===
                    currentSlide()!.contents.length - 1
                  }
                  onClick={() =>
                    setContentIndex(
                      currentSlide()!.uuid,
                      currentSlide()!.contentIndex + 1
                    )
                  }
                >
                  Next
                </Button>
              </div>
              <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                <Button
                  color="pink"
                  onClick={() => setMainConfigModalOpened(true)}
                >
                  Master Config
                </Button>
                <Button
                  onClick={() => {
                    addShape({
                      uuid: v4(),
                      key: "",
                      exampleValue: "",
                      zIndex: 0,
                      top: -1,
                      left: -1,
                      width: 400,
                      height: 300,
                      isCollapse: true,
                      isFocus: true,
                      styles: [],
                      type: "Normal",
                      slideParts: [],
                    });
                  }}
                >
                  Add Shape ({getShapes().length})
                </Button>
                {/* <Button
                  color="orange"
                  disabled={hasConversation(currentSlide()!.uuid)}
                  onClick={() => {
                    !hasConversation(currentSlide()!.uuid) &&
                      setViewContentModalOpened(true, true);
                  }}
                >
                  Edit Content
                </Button> */}
                <Button
                  color="red"
                  disabled={
                    slides.length === 1 && getMainSlide()?.shapes.length === 0
                  }
                  onClick={() => {
                    openConfirmModal({
                      modalId: "reset-config",
                      centered: true,
                      title: "Reset Config",
                      children: "Are you sure you want to reset?",
                      labels: { cancel: `Cancel`, confirm: `Yes, I am sure` },
                      confirmProps: { color: "red" },
                      closeOnConfirm: true,
                      closeOnCancel: true,
                      onConfirm: () => reset(),
                    });
                  }}
                >
                  Reset Config
                </Button>
                <Button
                  color="red"
                  disabled={!getShapes().length}
                  onClick={() => {
                    openConfirmModal({
                      modalId: "delete-all",
                      centered: true,
                      title: "Delete All Shapes",
                      children: "Are you sure you want to delete all shapes?",
                      labels: { cancel: `Cancel`, confirm: `Yes, I am sure` },
                      confirmProps: { color: "red" },
                      closeOnConfirm: true,
                      closeOnCancel: true,
                      onConfirm: () => deleteAllShapes(),
                    });
                  }}
                >
                  Delete All
                </Button>
              </div>
            </div>
            <ScrollArea
              className="tw-flex-1 tw-max-h-[calc(100%_-_104px)] tw-pb-2 tw-px-2"
              type="never"
            >
              <DesignWidget></DesignWidget>
            </ScrollArea>
          </>
        )}
      </div>
      <ConfiguationHistoryModal />
    </>
  );
}
