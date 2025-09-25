import {useQuery} from "@tanstack/react-query";
import {get} from "./api.ts";
import type {List} from "../model.ts";

async function getLists() {
  return get<List[]>("/api/lists");
}

export function useLists() {
  return useQuery({
    queryKey: ["lists"],
    queryFn: getLists
  });
}