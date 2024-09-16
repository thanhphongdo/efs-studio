import { useEffect, useState } from "react";
import useIndexedDB from "./indexed-db.hook";
import { useEnglishVideo } from "../english-design/store-provider";
import { uniq } from "lodash";
import { loadFont } from "../components/SelectFont";

export const DbStoreName = "english-design";
export const historyListKey = "history_list";

export type HistoryItemValue = { id: string; desc: string };

export type HistoryItem = {
  id: number;
  values: HistoryItemValue[];
};

export const useConfigurationHistory = () => {
  const { getAll, setAll, currentSlide } = useEnglishVideo((state) => state);
  const { db, addItem, getItem, getItems, updateItem, deleteItem } =
    useIndexedDB(DbStoreName);

  const [historyList, setHistoryList] = useState<HistoryItem>();

  useEffect(() => {
    if (!db) return;
    getItem(historyListKey).then(async (data) => {
      setHistoryList({
        id: data?.id!,
        values: data?.value!,
      });
    });
  }, [db]);

  const saveHistory = async () => {
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
  };

  const applyHistory = async (item: HistoryItemValue) => {
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
              if (item.name === "fontFamily" && item.value) {
                return item.value;
              }
              return null;
            })
            .filter((item) => item)
            .pop();
        })
      )
        .filter((item) => item)
        .forEach((font: string) => {
          loadFont(`https://fonts.googleapis.com/css?family=${font}`);
        });
    }
  };

  const deleteHistory = async (item: HistoryItemValue) => {
    const data = await getItem(item.id);
    if (data) {
      await deleteItem(data.id!);
      const historyItemValue = historyList?.values?.filter(
        (vItem) => vItem.id != item.id
      );
      setHistoryList({
        ...historyList!,
        values: historyItemValue!,
      });
      await updateItem({
        id: historyList!.id,
        name: historyListKey,
        value: historyItemValue,
      });
    }
  };

  return {
    db,
    historyList,
    setHistoryList,
    saveHistory,
    applyHistory,
    deleteHistory,
  };
};
