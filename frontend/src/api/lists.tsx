import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {get, post} from "./api.ts";
import type {List, Item} from "../model.ts";
import {v7 as uuidv7} from "uuid";

async function getLists() {
  return get<List[]>("/api/lists");
}

async function getItems(listId: string) {
  return get<Item[]>(`/api/lists/${listId}/items`);
}

async function addItem({name, index, listId}: {name: string, index: number, listId: string}) {
  const id = uuidv7();
  return post<Item>(`/api/lists/${listId}/items`, {body: {id, index, name}})
}

export function useLists() {
  return useQuery({
    queryKey: ["lists"],
    queryFn: getLists
  });
}

export function useItems(listId: string) {
  return useQuery({
    queryKey: ["listItems", listId],
    queryFn: ({queryKey}) => {
      const [_key, listId] = queryKey;
      return getItems(listId);
    }
  });
}

export function useAddItem(listId: string, onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: {name: string, index: number}) => addItem({...item, listId}),
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({ queryKey: ["listItems", listId] })
    }
  })
}