import {useMutation} from "@tanstack/react-query";
import {post} from "./api.ts";
import {useAuth} from "../AuthContext.tsx";
import type {User} from "../model.ts";
import {navigateTo} from "../router/util.tsx";

async function login(email: string) {
  return post("/api/auth/login", {body: {email}});
}

interface VerifyResponse {
  user: User;
  token: string;
}

async function verify({email, code}: {email: string, code: string}) {
  return post<VerifyResponse>("/api/auth/verify", {body: {email, code}});
}

export function useLogin() {
  return useMutation({mutationFn: login});
}

export function useVerify() {
  const {login} = useAuth();

  return useMutation({
    mutationFn: verify,
    onSuccess: (data) => {
      login(data.user, data.token);
      navigateTo("/");
    }
  });
}