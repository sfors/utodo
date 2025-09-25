import {useMutation, useQuery} from "@tanstack/react-query";
import {get, post} from "./api.ts";
import {useAuth} from "../AuthContext.tsx";
import type {User} from "../model.ts";
import {navigateTo} from "../router/util.tsx";

async function updateProfile({firstName, lastName}: {firstName: string, lastName: string}) {
  return post<User>("/api/users/profile", {body: {firstName, lastName}});
}

async function getProfile() {
  return get<User>("/api/users/profile");
}

export function useUpdateProfile(navigateOnSuccess: boolean) {
  const {updateUser} = useAuth();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      updateUser(data);
      if (navigateOnSuccess) {
        navigateTo("/");
      }
    }
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile
  });
}