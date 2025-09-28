export interface Ping {
  type: "ping";
}

export interface Pong {
  type: "pong";
}

export interface ItemUpdated {
  type: "itemUpdated";
  listId: string;
  itemId: string;
}

export interface ItemAdded {
  type: "itemAdded";
  listId: string;
  itemId: string | null;
}

export interface ListUpdated {
  type: "listUpdated";
  listId: string;
}

export interface ConfirmSubscription {
  type: "confirmSubscription";
  channel: string;
}

export interface ConfirmAuthentication {
  type: "confirmAuthentication";
}

export type ServerMessage = ItemUpdated | ItemAdded | ListUpdated | ConfirmSubscription | ConfirmAuthentication | Ping | Pong;

export interface Authenticate {
  type: "auth",
  token: string;
}

export interface Subscribe {
  type: "subscribe";
  channel: string;
}

export interface Unsubscribe {
  type: "unsubscribe";
  channel: string;
}

export type ClientMessage = Authenticate | Subscribe | Unsubscribe | Ping | Pong;