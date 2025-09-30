import {useItem, useItems, useJoinList, useList} from "../api/lists.tsx";
import type {Item, List} from "../model.ts";
import Link from "../router/Link.tsx";
import {useAuth, useUser} from "../AuthContext.tsx";
import {usePathParams} from "../router/RouteProvider.tsx";
import {ChevronDown, ChevronRight, Plus} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useAddItem, useUpdateItem, useUpdateList} from "../api/changes.tsx";
import Checkbox from "../components/Checkbox.tsx";
import Button from "../components/Button.tsx";
import {useSubscription} from "../websocket/WebSocketContext.tsx";

const DoneCheckbox = ({item}: {item: Item}) => {
  const updateItem = useUpdateItem({listId: item.listId, itemId: item.id});
  return (
    <Checkbox id={`checkbox-done-${item.id}`}
              checked={item.done}
              onCheckedChange={(checked) => {
                updateItem.mutate({key: "done", value: checked});
              }}/>
  );
};

const ItemNameForm = ({item, onComplete}: {item: Item, onComplete: () => void}) => {
  const [newName, setNewName] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateItem = useUpdateItem({listId: item.listId, itemId: item.id});

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    updateItem.mutate({key: "name", value: newName});
  }, [newName])

  return (
    <form className="w-full" onSubmit={(e) => {
      e.preventDefault();
      onComplete();
    }}>
      <input className="border border-solid rounded-md bg-black/30 border-white/30 text-white w-full px-2 py-1"
             ref={inputRef}
             onBlur={() => onComplete()}
             required
             value={newName}
             placeholder={item.name}
             onChange={(e) => {
               setNewName(e.target.value);
             }}/>
    </form>
  );
};

const ItemName = ({item}: {item: Item}) => {
  const [editingName, setEditingName] = useState(false);

  if (editingName) {
    return (
      <ItemNameForm item={item} onComplete={() => setEditingName(false)}/>
    );
  } else {
    return (
      <Button onClick={() => setEditingName(true)}
              onFocus={() => setEditingName(true)}
              fullWidth
      >
        <div className="w-full h-full py-1 px-2 flex items-start">{item.name}</div>
      </Button>
    );
  }
};

const Item = ({listId, itemId, listIsFetching}: {
  listId: string,
  itemId: string,
  listIsFetching: boolean
}) => {
  const {data: item} = useItem(listId, itemId, listIsFetching);
  const [open, setOpen] = useState(false);
  if (!item) {
    return null;
  }
  return (
    <div className="bg-white/8 rounded-md border border-white/20 p-1">
      <div className="flex flex-row justify-between items-center">
        {/*<div className="border-r border-white/20 p-2"><ArrowDownUp/></div>*/}
        <div className="flex flex-row grow space-x-1">
          <button className="rounded-sm cursor-pointer hover:bg-black/20 transition-colors"
                  onClick={() => setOpen(!open)}>
            {open ? <ChevronDown/> : <ChevronRight/>}
          </button>
          <DoneCheckbox item={item}/>
          <ItemName item={item}/>
          <button className="rounded-sm cursor-pointer hover:bg-black/20 transition-colors" title="Add sub item">
            <Plus/>
          </button>
        </div>
      </div>
      {open && (
        <div className="pt-2">
          {item.id}
          {item.description}
        </div>
      )}
    </div>
  );
};

const Items = ({items, listId, listIsFetching, showDone}: {
  items: Item[],
  listId: string,
  listIsFetching: boolean,
  showDone: boolean
}) => {
  const [newItem, setNewItem] = useState<string>("");
  const newIndex = items.length > 0 ? items[0].index - 1000 : 0;
  const addItem = useAddItem(listId, () => setNewItem(""));
  return (
    <>
      <form className="mb-1" onSubmit={(e) => {
        e.preventDefault();
        addItem.mutate({name: newItem, index: newIndex});
      }}>
        <input className="border border-solid rounded-md bg-black/30 border-white/30 text-white w-full px-3 py-2"
               required
               value={newItem}
               placeholder="New item"
               onChange={(e) => setNewItem(e.target.value)}/>
      </form>
      {items
        .filter((item) => showDone || !item.done)
        .map((item: Item) => <Item key={item.id} listId={listId} itemId={item.id}
                                   listIsFetching={listIsFetching}/>)}
    </>
  );
};


const ListNameForm = ({list, onComplete}: {list: List, onComplete: () => void}) => {
  const [newName, setNewName] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateList = useUpdateList({listId: list.id});

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form className="w-full" onSubmit={(e) => {
      e.preventDefault();
      onComplete();
    }}>
      <input className="border border-solid rounded-md bg-black/30 border-white/30 text-white w-full p-2"
             ref={inputRef}
             onBlur={() => onComplete()}
             required
             value={newName}
             placeholder={list.name}
             onChange={(e) => {
               setNewName(e.target.value);
               updateList.mutate({key: "name", value: e.target.value});
             }}/>
    </form>
  );
};

const ListHeader = ({list, showDone, setShowDone}: {
  list: List,
  showDone: boolean,
  setShowDone: (x: boolean) => void
}) => {
  const [editingName, setEditingName] = useState(false);
  return (
    <div className="flex flex-col space-y-3 items-start w-full">
      {editingName && <ListNameForm list={list} onComplete={() => setEditingName(false)}/>}
      {!editingName && (
        <Button onClick={() => setEditingName(true)}
                onFocus={() => setEditingName(true)}
                fullWidth
        >
          <div className="w-full h-full p-2 flex items-start">{list.name}</div>
        </Button>
      )}

      <Checkbox id={`checkbox-show-done-${list.id}`}
                label="Show completed items"
                checked={showDone}
                onCheckedChange={setShowDone}
      />

    </div>
  );
};

const ListPage = () => {
  const {listId} = usePathParams<{listId: string}>();
  const {data: list} = useList(listId);
  const {data: items, isPending, error, isFetching} = useItems(listId);
  const {logout} = useAuth();
  const [showDone, setShowDone] = useState(true);
  useSubscription(`list-${listId}`);
  const user = useUser();
  const joinList = useJoinList(listId);

  useEffect(() => {
    if ((user?.id && list?.ownerId) && user.id !== list.ownerId) {
      joinList.mutate();
    }
  }, [user?.id, listId, list?.ownerId]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col mt-2 text-white">
      <div className="text-white flex flex-row justify-between">
        <Link to="/">{"< Back to overview"}</Link>
        <div className="flex flex-row justify-end space-x-3">
          <Link to="/profile">Profile settings</Link>
          <a className="underline" href="/" onClick={logout}>Log out</a>
        </div>
      </div>
      <div
        className="mt-6 bg-fuchsia-500/30 backdrop-blur-[2px] rounded-xl border border-white/20 p-4 flex flex-col space-y-1">
        <div className="bg-white/8 rounded-md border border-white/20 py-4 px-2 mb-4">
          {!!list && <ListHeader list={list} showDone={showDone} setShowDone={setShowDone}/>}
        </div>
        {isPending && "Loading..."}
        {!!error && "Could not fetch items."}
        {!!items && <Items items={items} listId={listId} listIsFetching={isFetching} showDone={showDone}/>}
      </div>
    </div>
  );
};

export default ListPage;