import { useEffect, useState, useCallback } from "react";
import { openDB, IDBPDatabase, deleteDB } from "idb";

interface DBItem {
  id?: number;
  name: string;
  value: any;
}

export const DBName = "edgs-tts";
export const DbStoreName = "english-design";

const useIndexedDB = (storeName: string, dbName: string = DBName) => {
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [dbExists, setDbExists] = useState<boolean>(false);

  useEffect(() => {
    const initDB = async () => {
      const dbInstance = await openDB(dbName, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, {
              keyPath: "id",
              autoIncrement: true,
            });
            store.createIndex("name", "name", { unique: false });
          }
        },
      });
      setDb(dbInstance);
    };

    initDB();
  }, [dbName, storeName]);

  const addItem = useCallback(
    async (item: Omit<DBItem, "id">) => {
      if (!db) return;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      await store.add(item);
      await tx.done;
    },
    [db, storeName]
  );

  const getItems = useCallback(async (): Promise<DBItem[]> => {
    if (!db) return [];
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const allItems = (await store.getAll()) as DBItem[];
    return allItems;
  }, [db, storeName]);

  const getItem = useCallback(
    async (name: string): Promise<DBItem | undefined> => {
      if (!db) return undefined;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const index = store.index("name"); // Use the 'name' index
      const item = (await index.get(name)) as DBItem | undefined;
      return item;
    },
    [db, storeName]
  );

  const updateItem = useCallback(
    async (item: DBItem) => {
      if (!db || !item.id) return;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      await store.put(item); // put updates the item if it exists
      await tx.done;
    },
    [db, storeName]
  );

  const deleteItem = useCallback(
    async (id: number) => {
      if (!db) return;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      await store.delete(id); // delete item by id
      await tx.done;
    },
    [db, storeName]
  );

  return { getItem, addItem, getItems, updateItem, deleteItem, dbExists, db };
};

export default useIndexedDB;
