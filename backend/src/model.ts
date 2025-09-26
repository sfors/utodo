export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface List {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  frozen: boolean;
}

export interface Item {
  id: string;
  index: number;
  parentId: string | null;
  typeId: string | null;
  description: string | null;
  name: string | null;
  done: boolean;
  customFields: any;
}

type ChangeType = "updateItem" | "addItem";

export interface Change {
  id: string;
  type: ChangeType;
}

export type ItemKey = keyof Omit<Item, "id" | "customFields" | "typeId">;

export interface UpdateItem extends Change{
  type: "updateItem";
  listId: string;
  itemId: string;
  key: ItemKey;
  value: any
}

export interface AddItem extends Change {
  type: "addItem";
  listId: string;
  itemId?: string;
  name: string;
  index: number;
  parentId?: string;
}