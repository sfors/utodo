import {useMutation, useQueryClient} from "@tanstack/react-query";
import {post} from "./api.ts";
import type {Item, List} from "../model.ts";
import {v7 as uuidv7} from "uuid";

async function updateItem(update: {listId: string, itemId: string, key: string, value: any}) {
  const id = uuidv7();
  const body = {
    id,
    type: "updateItem",
    listId: update.listId,
    itemId: update.itemId,
    key: update.key,
    value: update.value
  };
  return post<Item>(`/api/changes`, {body});
}

export function useUpdateItem({listId, itemId, onSuccess}: {listId: string, itemId: string, onSuccess?: () => void}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (update: {key: string, value: any}) => updateItem({...update, listId, itemId}),
    onSuccess: async (newItem) => {
      queryClient.setQueryData(["item", listId, itemId], newItem);
      queryClient.setQueryData(["listItems", listId], (list: Item[]) => {
        return list.map(i => {
          if (i.id === itemId) {
            return newItem;
          } else {
            return i;
          }
        })
      });
      if (onSuccess) {
        onSuccess();
      }
    }
  });
}

async function addItem(update: {listId: string, name: string, index: number, parentId?: string}) {
  const id = uuidv7();
  const itemId = uuidv7();
  const body = {
    id,
    type: "addItem",
    listId: update.listId,
    itemId,
    name: update.name,
    index: update.index,
    parentId: update.parentId
  };
  return post<Item>(`/api/changes`, {body});
}

export function useAddItem(listId: string, onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: {name: string, index: number}) => addItem({...item, listId}),
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({queryKey: ["listItems", listId]});
    }
  });
}

async function updateList(update: {listId: string, key: string, value: any}) {
  const id = uuidv7();
  const body = {
    id,
    type: "updateList",
    listId: update.listId,
    key: update.key,
    value: update.value
  };
  return post<List>(`/api/changes`, {body});
}

export function useUpdateList({listId}: {listId: string}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (update: {key: string, value: any}) => updateList({...update, listId}),
    onSuccess: async (newList) => {
      queryClient.setQueryData(["list", listId], newList);
    }
  });
}