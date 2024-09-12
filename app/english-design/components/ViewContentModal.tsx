import {
  Button,
  CopyButton,
  JsonInput,
  Modal,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useEnglishVideo } from "../store-provider";
import { chunk, uniq } from "lodash";
import { useEffect, useState } from "react";
import axios from "axios";
import { Env } from "@/app/consts/env";
import {
  IconCopy,
  IconCopyCheck,
  IconScanEye,
  IconTrash,
} from "@tabler/icons-react";
import { openConfirmModal } from "@mantine/modals";

export function ViewContentModal() {
  const {
    viewContentModalOpened,
    setViewContentModalOpened,
    currentSlide,
    setSlide,
    setContentIndex,
  } = useEnglishVideo((state) => state);

  const [keys, setKeys] = useState<Array<string>>([]);
  const [selectedKey, setSelectedKey] = useState<string>("");
  useEffect(() => {
    if (currentSlide()!.contents?.length > 0) {
      setKeys(Object.keys(currentSlide()!.contents[0]));
      setSelectedKey(Object.keys(currentSlide()!.contents[0])[0]);
    }
  }, [currentSlide()!.contents]);

  const [contentEditable, setContentEditable] = useState({
    index: 0,
    cIndex: 0,
  });

  const splitedContent = currentSlide()!.splitedContent ?? 1;

  return (
    <Modal
      opened={viewContentModalOpened.opened}
      onClose={() => setViewContentModalOpened(false)}
      title={
        <Title order={5}>
          <span>View and Edit Content</span>{" "}
          {viewContentModalOpened.isFocusCurrentContent && (
            <span>
              [{currentSlide()!.contentIndex + 1} /{" "}
              {currentSlide()!.contents.length}]
            </span>
          )}
        </Title>
      }
      size={"xl"}
      className="tw-h-full custom-modal"
    >
      <div
        className="tw-flex tw-flex-col tw-gap-4 tw-max-h-full tw-relative tw-min-h-full"
        tabIndex={0}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
          }
          switch (e.key) {
            case "ArrowLeft":
              let newPrevIndex =
                currentSlide()!.contentIndex - (e.shiftKey ? 10 : 1);
              if (newPrevIndex < 0) {
                newPrevIndex = 0;
              }
              (e.ctrlKey || e.metaKey) &&
                currentSlide()!.contentIndex > 0 &&
                setContentIndex(currentSlide()!.uuid, newPrevIndex);
              break;
            case "ArrowRight":
              let newNextIndex =
                currentSlide()!.contentIndex + (e.shiftKey ? 10 : 1);
              if (newNextIndex > currentSlide()!.contents.length - 1) {
                newNextIndex = currentSlide()!.contents.length - 1;
              }
              (e.ctrlKey || e.metaKey) &&
                currentSlide()!.contentIndex <
                  currentSlide()!.contents.length - 1 &&
                setContentIndex(currentSlide()!.uuid, newNextIndex);
              break;
          }
        }}
        onKeyUp={(e) => e.preventDefault()}
      >
        {viewContentModalOpened.isFocusCurrentContent && (
          <div className="tw-flex tw-gap-2">
            <Button
              disabled={currentSlide()!.contentIndex === 0}
              onClick={() => {
                setContentIndex(
                  currentSlide()!.uuid,
                  currentSlide()!.contentIndex - 1
                );
              }}
            >
              Prev [cmd ←]
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
              Next [cmd →]
            </Button>
          </div>
        )}
        <div className="tw-flex tw-flex-col tw-gap-2 tw-flex-1 tw-overflow-auto">
          {chunk(
            currentSlide()!.contents.filter((item, index) => {
              if (!viewContentModalOpened.isFocusCurrentContent) {
                return true;
              }
              return index === currentSlide()!.contentIndex;
            }),
            splitedContent
          ).map((cItem, cIndex) => (
            <div
              key={cIndex}
              className="tw-flex tw-flex-col tw-gap-2 tw-p-2 tw-rounded-md tw-bg-slate-600"
            >
              {splitedContent > 1 && (
                <div className="tw-flex tw-gap-8">
                  <div className="tw-flex tw-gap-2 tw-items-center">
                    <span className="tw-font-bold">Index:</span>
                    <span>{cIndex + 1}</span>
                  </div>
                  <div className="tw-flex tw-gap-2 tw-items-center">
                    <span className="tw-font-bold">Key:</span>
                    <Select
                      data={keys}
                      value={selectedKey}
                      size="xs"
                      onChange={(value) => setSelectedKey(value ?? "")}
                    ></Select>
                  </div>
                  <div className="tw-flex tw-gap-2 tw-items-center">
                    <CopyButton
                      value={cItem.map((item) => item[selectedKey]).join(" - ")}
                      timeout={3000}
                    >
                      {({ copied, copy }) => (
                        <div
                          className="tw-cursor-pointer tw-p-1 tw-rounded-lg tw-bg-slate-500"
                          onClick={copy}
                        >
                          {!copied && <IconCopy />}
                          {copied && (
                            <IconCopyCheck className="tw-text-green-500" />
                          )}
                        </div>
                      )}
                    </CopyButton>
                  </div>
                </div>
              )}
              {cItem.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setContentEditable({ cIndex, index })}
                  className="tw-flex tw-flex-col tw-gap-2 tw-px-4 tw-py-2 tw-rounded tw-border tw-border-gray-200 tw-bg-slate-900 tw-relative"
                >
                  {Object.keys(item).map((key) => (
                    <div key={key} className="tw-flex tw-gap-2 tw-pr-6">
                      <div className="tw-font-bold tw-text-gray-500">
                        {key}:{" "}
                      </div>
                      {/* contentEditable={
                          index === contentEditable.index &&
                          cIndex === contentEditable.cIndex
                        } */}
                      <div
                        contentEditable
                        className={`tw-px-1 tw-min-w-24 ${
                          !item[key] ? "default-outline" : ""
                        }`}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={(e: any) => {
                          const currentContents = [...currentSlide()!.contents];
                          currentContents[cIndex * splitedContent + index][
                            key
                          ] = e.target.innerText;
                          currentSlide()!.contents = currentContents;
                          setSlide(currentSlide()!);
                          // setContents(currentContents);
                        }}
                        dangerouslySetInnerHTML={{ __html: item[key] }}
                      ></div>
                    </div>
                  ))}
                  <div
                    className="tw-p-1 tw-absolute tw-top-1 tw-right-1 tw-cursor-pointer"
                    onClick={() => {
                      openConfirmModal({
                        modalId: "delete-content",
                        centered: true,
                        title: "Delete Content",
                        children: "Are you sure you want to delete this item?",
                        labels: {
                          cancel: `Cancel`,
                          confirm: `Yes, I am sure`,
                        },
                        confirmProps: { color: "red" },
                        closeOnConfirm: true,
                        closeOnCancel: true,
                        onConfirm: () => {
                          const currentContents = [
                            ...currentSlide()!.contents.filter(
                              (cItem, cIndex) => cIndex !== index
                            ),
                          ];
                          currentSlide()!.contents = currentContents;
                          setSlide(currentSlide()!);
                          // setContents(currentContents);
                        },
                      });
                    }}
                  >
                    <IconTrash />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="tw-flex tw-gap-4 tw-justify-end tw-absolute tw-w-full tw-left-0 -tw-bottom-12 tw-px-4">
        <Button
          color="green"
          size="sm"
          onClick={() => {
            const cloneItem = { ...currentSlide()!.contents[0] };
            Object.keys(cloneItem).forEach((key) => {
              cloneItem[key] = "";
            });
            currentSlide()!.contents = [cloneItem, ...currentSlide()!.contents];
            setSlide(currentSlide()!);
            // setContents([cloneItem, ...contents]);
          }}
        >
          Add Content
        </Button>
        <Button
          color="orange"
          onClick={async () => {
            setViewContentModalOpened(false);
          }}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
}
