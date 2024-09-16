import { useConfigurationHistory } from "@/app/hooks/configuation-history.hook";
import { Button, Modal, ScrollArea, Table, Title } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import dayjs from "dayjs";
import { useEnglishVideo } from "../store-provider";

export function ConfiguationHistoryModal() {
  const { setConfiguationHistoryModalOpened, configuationHistoryModalOpened } =
    useEnglishVideo((state) => state);
  const { db, historyList, saveHistory, applyHistory, deleteHistory } =
    useConfigurationHistory();
  return (
    <Modal
      opened={configuationHistoryModalOpened}
      onClose={() => setConfiguationHistoryModalOpened(false)}
      title={<Title order={5}>Config History</Title>}
      size={"xl"}
      zIndex={1000}
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
                          applyHistory(item);
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
                              deleteHistory(item);
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
            saveHistory();
          }}
        >
          Save Current Config
        </Button>
      </div>
    </Modal>
  );
}
