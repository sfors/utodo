import {useMutation} from "@tanstack/react-query";
import {request} from "./api.ts";
import {useAuth} from "../AuthContext.tsx";
import type {User} from "../model.ts";
import {navigateTo} from "../router/util.tsx";

async function login(email: string) {
  return request("/api/auth/login", {method: "POST", body: {email}});
}

interface VerifyResponse {
  user: User;
  token: string;
}

async function verify({email, code}: {email: string, code: string}) {
  return request<VerifyResponse>("/api/auth/verify", {method: "POST", body: {email, code}});
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