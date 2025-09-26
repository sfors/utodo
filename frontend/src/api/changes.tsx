import {useMutation, useQueryClient} from "@tanstack/react-query";
import {post} from "./api.ts";
import type {Item} from "../model.ts";
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


export function useUpdateItem({listId, itemId}: {listId: string, itemId: string}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (update: {key: string, value: any}) => updateItem({...update, listId, itemId}),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["listItems", listId] })
    }
  });
}