import {type QueryClient} from "@tanstack/react-query";
import type {ServerMessage} from "./model.ts";

export function useMessageHandler({queryClient}: {queryClient: QueryClient}) {
  function onMessage(data: ServerMessage) {
    if (data.type === "itemUpdated") {
      const {listId, itemId} = data;
      void queryClient.invalidateQueries({queryKey: ["item", listId, itemId]});
    } else if (data.type === "listUpdated") {
      const {listId} = data;
      void queryClient.invalidateQueries({queryKey: ["list", listId]});
    }
  }

  return onMessage;
}