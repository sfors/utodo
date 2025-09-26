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

