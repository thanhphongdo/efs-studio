import { Button, CopyButton, Modal, Title } from "@mantine/core";
import { useEnglishVideo } from "../store-provider";
import { useEffect, useState } from "react";
import { IconCopy, IconCopyCheck } from "@tabler/icons-react";
const maxMessageLength = 3000;

export function CopyConfigModal(props: { copyValue: string }) {
  const { copyConfigModalOpened, setCopyConfigModalOpened, copyType } =
    useEnglishVideo((state) => state);

  const [configId, setConfigId] = useState<string>("");

  useEffect(() => {
    setConfigId(Date.now().toString());
  }, [copyConfigModalOpened]);

  return (
    <Modal
      opened={copyConfigModalOpened}
      onClose={() => {
        setCopyConfigModalOpened(false);
      }}
      title={<Title order={5}>{`Copy ${copyType} Config`}</Title>}
      size={"xl"}
    >
      <div className="tw-flex tw-flex-col tw-gap-4">
        {Array.from({
          length: Math.ceil(props.copyValue.length / maxMessageLength) + 1,
        }).map((item, index) => {
          const isEnd =
            index === Math.ceil(props.copyValue.length / maxMessageLength);
          return (
            <div className="tw-relative" key={index}>
              <div className="tw-h-24 tw-overflow-auto tw-break-words tw-p-4 tw-bg-slate-700 tw-rounded-md">
                {!isEnd && (
                  <>
                    <span className="tw-text-blue-300">
                      /{copyType.toLocaleLowerCase()}{" "}
                    </span>{" "}
                    part <span className="tw-text-blue-300">{configId} </span>
                    {props.copyValue.slice(
                      index * maxMessageLength,
                      index * maxMessageLength + maxMessageLength
                    )}
                  </>
                )}
                {isEnd && (
                  <>
                    <span className="tw-text-blue-300">
                      /{copyType.toLocaleLowerCase()}{" "}
                    </span>{" "}
                    end <span className="tw-text-blue-300">{configId}</span>
                  </>
                )}
              </div>
              <CopyButton
                value={`/${copyType.toLocaleLowerCase()} ${
                  isEnd ? "end" : "part"
                } ${configId} ${props.copyValue.slice(
                  index * maxMessageLength,
                  index * maxMessageLength + maxMessageLength
                )}`}
                timeout={30000}
              >
                {({ copied, copy }) => (
                  <div
                    className="tw-absolute tw-top-2 tw-right-2 tw-cursor-pointer tw-p-1 tw-rounded-lg tw-bg-slate-500"
                    onClick={copy}
                  >
                    {!copied && <IconCopy />}
                    {copied && <IconCopyCheck className="tw-text-green-500" />}
                  </div>
                )}
              </CopyButton>
            </div>
          );
        })}
        <div className="tw-flex tw-gap-4 tw-justify-end">
          <Button
            onClick={() => {
              setConfigId(Date.now().toString());
            }}
          >
            Refresh ID
          </Button>
        </div>
      </div>
    </Modal>
  );
}
