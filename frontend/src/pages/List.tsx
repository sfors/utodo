import {useAddItem, useItem, useItems} from "../api/lists.tsx";
import type {Item} from "../model.ts";
import Link from "../router/Link.tsx";
import {useAuth} from "../AuthContext.tsx";
import {usePathParams} from "../router/RouteProvider.tsx";
import * as Checkbox from "@radix-ui/react-checkbox";
import {Check, ChevronDown, ChevronRight, Plus} from "lucide-react";
import {useState} from "react";
import {useUpdateItem} from "../api/changes.tsx";

const DoneCheckbox = ({item}: {item: Item}) => {
  const updateItem = useUpdateItem({listId: item.listId, itemId: item.id});
  return (
    <Checkbox.Root
      className="cursor-pointer bg-black/30 hover:bg-black/50 w-6 h-6 rounded-sm flex items-center justify-center"
      checked={item.done}
      onCheckedChange={(checked) => {
        updateItem.mutate({key: "done", value: checked});
      }}
      id="c1">
      <Checkbox.Indicator className="text-white">
        <Check size={18}/>
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
};

const Item = ({listId, itemId, listIsFetching}: {listId: string, itemId: string, listIsFetching: boolean}) => {
  const {data: item} = useItem(listId, itemId, listIsFetching);
  const [open, setOpen] = useState(false);
  if (!item) {
    return null;
  }
  return (
    <div className="bg-white/8 rounded-md border border-white/20 p-2">
      <div className="flex flex-row justify-between items-center">
        {/*<div className="border-r border-white/20 p-2"><ArrowDownUp/></div>*/}
        <div className="flex flex-row space-x-2">
          <button className="rounded-sm cursor-pointer hover:bg-black/20 transition-colors" title="Add sub item"
                  onClick={() => setOpen(!open)}>
            {open ? <ChevronDown/> : <ChevronRight/>}
          </button>
          <DoneCheckbox item={item} />
          <p className="pl-1">{item.name}</p></div>
        <div className="flex items-center">
          <button className="rounded-sm cursor-pointer hover:bg-black/20 transition-colors" title="Add sub item"><Plus/>
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

const Items = ({items, listId, listIsFetching}: {items: Item[], listId: string, listIsFetching: boolean}) => {
  const [newItem, setNewItem] = useState<string>("");
  const newIndex = items.length > 0 ? items[0].index - 1000 : 0;
  const addItem = useAddItem(listId, () => setNewItem(""));
  return (
    <div
      className="mt-6 bg-fuchsia-500/30 backdrop-blur-[2px] rounded-xl border border-white/20 p-4 flex flex-col space-y-1">
      <form className="mb-2" onSubmit={(e) => {
        e.preventDefault();
        addItem.mutate({name: newItem, index: newIndex});
      }}>
        <input className="border border-solid rounded-md bg-black/30 border-white/30 text-white w-full px-3 py-2"
               required
               value={newItem}
               onChange={(e) => setNewItem(e.target.value)}/>
      </form>
      {items.map((item: Item) => <Item key={item.id} listId={listId} itemId={item.id} listIsFetching={listIsFetching}/>)}
    </div>
  );
};

const List = ({}) => {
  const {listId} = usePathParams<{listId: string}>();
  const {data, isPending, error, isFetching} = useItems(listId);
  const {logout} = useAuth();

  return (
    <div className="max-w-7xl mx-auto flex flex-col mt-2">
      <div className="text-white flex flex-row justify-between">
        <Link to="/">{"< Back to overview"}</Link>
        <div className="flex flex-row justify-end space-x-3">
          <Link to="/profile">Profile settings</Link>
          <a className="underline" href="/" onClick={logout}>Log out</a>
        </div>
      </div>
      {isPending && "Loading..."}
      {!!error && "Could not fetch items."}
      {!!data && <Items items={data} listId={listId} listIsFetching={isFetching} />}
    </div>
  );
};

export default List;