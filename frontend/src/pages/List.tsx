import {useItems} from "../api/lists.tsx";
import type {Item} from "../model.ts";
import Link from "../router/Link.tsx";
import {useAuth} from "../AuthContext.tsx";
import {usePathParams} from "../router/RouteProvider.tsx";
import * as Checkbox from "@radix-ui/react-checkbox";
import {Plus, Check, ChevronRight, ChevronDown} from "lucide-react";
import {useState} from "react";

const Item = ({item}: { item: Item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/8 rounded-md border border-white/20 p-2">
      <div className="flex flex-row justify-between items-center">
        {/*<div className="border-r border-white/20 p-2"><ArrowDownUp/></div>*/}
        <div className="flex flex-row space-x-2">
          <button className="rounded-sm cursor-pointer hover:bg-black/20 transition-colors" title="Add sub item"
                  onClick={() => setOpen(!open)}>
            {open ? <ChevronDown/> : <ChevronRight/>}
          </button>
          <Checkbox.Root
            className="cursor-pointer bg-black/30 hover:bg-black/50 w-6 h-6 rounded-sm flex items-center justify-center"
            defaultChecked id="c1">
            <Checkbox.Indicator className="text-white">
              <Check size={18}/>
            </Checkbox.Indicator>
          </Checkbox.Root>
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
}

const Items = ({items}: { items: Item[] }) => {
  return (
    <div
      className="mt-6 bg-fuchsia-500/30 backdrop-blur-[2px] rounded-xl border border-white/20 p-4 flex flex-col space-y-1">
      {items.map((item: Item) => <Item key={item.id} item={item}/>)}
    </div>
  );
}

const List = ({}) => {
  const {listId} = usePathParams<{ listId: string }>();
  const {data, isPending, error} = useItems(listId);
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
      {!!data && <Items items={data}/>}
    </div>
  );
}

export default List;