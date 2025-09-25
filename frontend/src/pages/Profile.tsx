import {useState} from "react";
import {useProfile, useUpdateProfile} from "../api/profile.tsx";
import type {User} from "../model.ts";
import Link from "../router/Link.tsx";

const ProfileInner = ({user}: { user: User }) => {
  const profileComplete: boolean = !!(user.lastName && user.firstName);
  const [state, setState] = useState({firstName: user.firstName || "", lastName: user.lastName || ""});
  const updateProfile = useUpdateProfile(!profileComplete);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col drop-shadow-sm rounded-3xl w-full max-w-md bg-indigo-950 p-3">
        <div className="flex flex-col drop-shadow-sm rounded-xl w-full max-w-md bg-indigo-100 p-6">
          <div className="flex flex-col items-center justify-center pb-6">
            <h3 className="text-2xl font-bold">profile</h3>
            <p className="text-sm text-gray-600">Profile settings.</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            updateProfile.mutate({firstName: state.firstName, lastName: state.lastName});
          }}>
            <div className="flex flex-col space-y-6">
              <input className="border-gray-400 border-1 bg-white rounded-md px-3 py-2 text-sm"
                     id="firstName"
                     placeholder="First name"
                     required
                     value={state.firstName}
                     onChange={e => setState({...state, firstName: e.target.value})}
              />
              <input className="border-gray-400 border-1 bg-white rounded-md px-3 py-2 text-sm"
                     id="lastName"
                     placeholder="Last name"
                     required
                     value={state.lastName}
                     onChange={e => setState({...state, lastName: e.target.value})}
              />
            </div>
            <div className="flex flex-col space-y-6 items-center">
              <button
                className={`mt-6 cursor-pointer disabled:cursor-default w-full bg-linear-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-sm text-white p-2 rounded-md${updateProfile.isPending ? " animate-pulse" : ""}`}
                type="submit"
                disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save"}
              </button>
              {profileComplete && <Link to="/">Go back</Link>}
            </div>
          </form>
        </div>
      </div>


    </div>
  );
}

const Profile = ({}) => {
  const {data, isPending} = useProfile();

  if (data) {
    return <ProfileInner user={data}/>
  }

  if (isPending) {
    return "Loading...";
  }

  return "Error...";
}

export default Profile;