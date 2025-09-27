import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {get, post} from "./api.ts";
import type {List, Item} from "../model.ts";
import {v7 as uuidv7} from "uuid";

async function getLists() {
  return get<List[]>("/api/lists");
}

async function getItem(listId: string, itemId: string) {
  return get<Item>(`/api/lists/${listId}/items/${itemId}`);
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

export function useItem(listId: string, itemId: string, listIsFetching: boolean) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["item", listId, itemId],
    staleTime: 1000,
    enabled: !listIsFetching,
    queryFn: async () => {
      const item = await getItem(listId, itemId);
      queryClient.setQueryData(["listItems", listId], (list: Item[]) => {
        return list.map(i => {
          if (i.id === itemId) {
            return item;
          } else {
            return i;
          }
        })
      });
      return item;
    }
  });
}

export function useItems(listId: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["listItems", listId],
    queryFn: async () => {
      const result = await getItems(listId);
      result.forEach((item) => {
        queryClient.setQueryData(["item", listId, item.id], item)
      });
      return result;
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