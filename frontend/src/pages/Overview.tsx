import {useLists} from "../api/lists.tsx";
import type {List} from "../model.ts";
import {useState} from "react";
import Link from "../router/Link.tsx";
import {useAuth} from "../AuthContext.tsx";
import {navigateTo} from "../router/util.tsx";
import {useCreateNewList} from "../api/lists.tsx";

const NewList = ({}) => {
  const createNewList = useCreateNewList({onSuccess: (list: List) => navigateTo(`/list/${list.id}`)});
  return (
    <div className="cursor-pointer flex flex-col drop-shadow-sm rounded-3xl bg-indigo-950 p-3"
         onClick={() => {createNewList.mutate()}}
    >
      <div
        className="h-32 flex flex-col items-center justify-center drop-shadow-sm rounded-xl w-full bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200 p-6">
        <span className="text-5xl">+</span>
        <span>New list</span>
      </div>
    </div>
  )
}

const OverviewList = ({list}: { list: List }) => {
  return (
    <div className="cursor-pointer flex flex-col drop-shadow-sm rounded-3xl bg-indigo-950 p-3"
         onClick={() => navigateTo(`/list/${list.id}`)}>
      <div className="h-32 flex flex-col drop-shadow-sm rounded-xl w-full bg-indigo-100  hover:bg-indigo-200 transition-colors duration-200 p-6">
        <div className="flex flex-col grow">
          <div className="font-bold">
            {list.name}
          </div>
          <span className="text-xs text-gray-500">{list.id}</span>
        </div>

        <div className="text-gray-500 text-xs">
          {list.ownerName}
        </div>
      </div>
    </div>
  )
}

function filterLists(search: string, lists?: List[]) {
  if (lists && search) {
    return lists.filter(list => list.name.toLowerCase().includes(search.toLowerCase()));
  } else if (lists) {
    return lists;
  }
}

const Overview = ({}) => {
  const [search, setSearch] = useState("");
  const {data, isPending, error} = useLists();
  const filtered = filterLists(search, data);
  const {logout} = useAuth();

  if (isPending) {
    return "Loading...";
  } else if (error) {
    return "Could not fetch lists";
  } else {
    return (
      <div className="max-w-7xl mx-auto flex flex-col mt-2">
        <div className="text-white flex flex-row justify-end space-x-3">
          <Link to="/profile">Profile settings</Link>
          <a className="underline" href="/" onClick={logout}>Log out</a>
        </div>
        <input className="mt-4 w-full border-gray-400 border-1 bg-indigo-950 text-white rounded-md px-3 py-2 text-xl"
               type="search"
               id="search"
               placeholder="Search..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
        />
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
          <NewList/>
          {filtered?.map(list => <OverviewList key={list.id} list={list}/>)}

        </div>
      </div>
    );
  }
}

export default Overview;