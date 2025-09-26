import {useQuery} from "@tanstack/react-query";
import {get} from "./api.ts";
import type {List, Item} from "../model.ts";

async function getLists() {
  return get<List[]>("/api/lists");
}

async function getItems(listId: string) {
  return get<Item[]>(`/api/lists/${listId}/items`);
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