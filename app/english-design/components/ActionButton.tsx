import { Button, Modal, ScrollArea, Table, Title } from "@mantine/core";
import { DesignWidget } from "./DesignWidget";
import { useEnglishVideo } from "../store-provider";
import {
  IconCrop32,
  IconCrop32Filled,
  IconCropPortrait,
  IconCropPortraitFilled,
  IconZoom,
} from "@tabler/icons-react";
import { v4 } from "uuid";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import useIndexedDB, { DbStoreName } from "@/app/hooks/indexed-db.hook";
import dayjs from "dayjs";
import { uniq } from "lodash";
import { loadFont } from "@/app/components/SelectFont";
import { openConfirmModal } from "@mantine/modals";

export function ActionButton(props: { isView: boolean }) {
  const {
    slides,
    getAll,
    addShape,
    getShapes,
    // contentIndex,
    setContentIndex,
    deleteShape,
    deleteAllShapes,
    getActiveShape,
    reset,
    setMainConfigModalOpened,
    setConfigModalOpened,
    scale,
    zoom,
    setAll,
    setVideoType,
    currentSlide,
    getMainSlide,
    setViewContentModalOpened,
  } = useEnglishVideo((state) => state);

  const historyListKey = "history_list";

  const [opened, { open, close }] = useDisclosure(false);
  const { db, addItem, getItem, getItems, updateItem, deleteItem } =
    useIndexedDB(DbStoreName);
  const [historyList, setHistoryList] = useState<{
    id: number;
    values: { id: string; desc: string }[];
  }>();

  useEffect(() => {
    if (!db) return;
    getItem(historyListKey).then(async (data) => {
      setHistoryList({
        id: data?.id!,
        values: data?.value!,
      });
    });
  }, [db]);

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
        className={`tw-w-[496px] tw-p-2 tw-h-full tw-flex tw-flex-col tw-bg-zinc-900 ${
          props.isView ? "tw-hidden" : ""
        }`}
      >
        <div className="tw-grid tw-grid-cols-3 tw-gap-2 tw-p-2">
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
              className="!tw-p-2 tw-flex-1"
              onClick={() => {
                setConfigModalOpened(true);
              }}
            >
              Config
            </Button>
          </div>
          <div className="tw-grid tw-grid-cols-2 tw-gap-2">
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
        <div className="tw-grid tw-grid-cols-3 tw-gap-2 tw-p-2">
          <Button color="pink" onClick={() => setMainConfigModalOpened(true)}>
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
              });
            }}
          >
            Add Shape ({getShapes().length})
          </Button>
          <Button
            color="orange"
            disabled={!getActiveShape()}
            onClick={() => {
              setViewContentModalOpened(true, true);
            }}
          >
            Edit Content
          </Button>
          <Button color="yellow" onClick={open}>
            Config History
          </Button>
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
        <ScrollArea
          className="tw-flex-1 tw-max-h-[calc(100%_-_104px)]"
          type="never"
        >
          <DesignWidget></DesignWidget>
        </ScrollArea>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        title={<Title order={5}>Config History</Title>}
        size={"xl"}
        className="tw-h-full custom-modal"
      >
        <div className="tw-flex tw-flex-col tw-gap-4 tw-relative tw-h-full">
          <ScrollArea className="tw-h-full">
            <Table className="tw-w-full">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Id</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Desc</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {historyList?.values?.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.id}</Table.Td>
                    <Table.Td>
                      {dayjs(parseInt(item.id)).format("YYYY-DD-MM:HH:mm:ss")}
                    </Table.Td>
                    <Table.Td>{item.desc}</Table.Td>
                    <Table.Td>
                      <div className="tw-flex tw-gap-2">
                        <Button
                          color="yellow"
                          onClick={async () => {
                            const data = await getItem(item.id);
                            if (data) {
                              setAll({
                                ...data.value,
                                configModalOpened: false,
                                copyConfigModalOpened: false,
                                scale: 0.5,
                              });
                              uniq(
                                currentSlide()!.shapes.map((shape) => {
                                  return shape.styles
                                    .map((item) => {
                                      if (
                                        item.name === "fontFamily" &&
                                        item.value
                                      ) {
                                        return item.value;
                                      }
                                      return null;
                                    })
                                    .filter((item) => item)
                                    .pop();
                                })
                              )
                                .filter((item) => item)
                                .forEach((font) => {
                                  loadFont(
                                    `https://fonts.googleapis.com/css?family=${font}`
                                  );
                                });
                            }
                          }}
                        >
                          Apply
                        </Button>
                        <Button
                          color="red"
                          onClick={() =>
                            openConfirmModal({
                              modalId: "delete-history-iem",
                              centered: true,
                              title: "Delete this history",
                              children:
                                "Are you sure you want to delete this history?",
                              labels: {
                                cancel: `Cancel`,
                                confirm: `Yes, I am sure`,
                              },
                              confirmProps: { color: "red" },
                              closeOnConfirm: true,
                              closeOnCancel: true,
                              onConfirm: async () => {
                                const data = await getItem(item.id);
                                if (data) {
                                  await deleteItem(data.id!);
                                  setHistoryList({
                                    ...historyList,
                                    values: historyList?.values?.filter(
                                      (vItem) => vItem.id != item.id
                                    ),
                                  });
                                  await updateItem({
                                    id: historyList.id,
                                    name: historyListKey,
                                    value: historyList?.values?.filter(
                                      (vItem) => vItem.id != item.id
                                    ),
                                  });
                                }
                              },
                            })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </div>
        <div className="tw-flex tw-gap-4 tw-justify-end tw-absolute tw-w-full tw-left-0 -tw-bottom-12 tw-px-4">
          <Button
            onClick={async () => {
              const id = Date.now().toString();
              if (!historyList?.values?.length) {
                await addItem({ name: historyListKey, value: [] });
              }
              const historyObj = await getItem(historyListKey);
              const historyValues = [
                ...(historyList?.values || []),
                { id, desc: getAll().videoTitle ?? "Video Title Not Found" },
              ];
              setHistoryList({
                id: historyObj?.id!,
                values: historyValues,
              });
              await updateItem({
                id: historyObj?.id!,
                name: historyListKey,
                value: historyValues,
              });
              await addItem({
                name: id,
                value: JSON.parse(JSON.stringify(getAll())),
              });
            }}
          >
            Save Current Config
          </Button>
        </div>
      </Modal>
    </>
  );
}
