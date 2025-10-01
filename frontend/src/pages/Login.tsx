import {useState} from "react";
import {useLogin, useVerify} from "../api/auth.tsx";

const Login = ({}) => {
  const [state, setState] = useState({email: "", verificationCode: ""});
  const loginMutation = useLogin();
  const verifyMutation = useVerify();

  return <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col drop-shadow-sm rounded-3xl w-full max-w-md bg-indigo-950 p-3">
      <div className="flex flex-col drop-shadow-sm rounded-xl w-full max-w-md bg-indigo-100 p-6">
        <div className="flex flex-col items-center justify-center pb-6">
          <h3 className="text-2xl font-bold">utodo</h3>
          <p className="text-sm text-gray-600">Sign in to your account.</p>
        </div>
        {!loginMutation.data && (
          <form onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate(state.email)
          }}>
            <div className="flex flex-col">
              <input className="border-gray-400 border-1 bg-white rounded-md px-3 py-2 text-sm"
                     type="email"
                     id="email"
                     placeholder="Enter your email address"
                     required
                     value={state.email}
                     onChange={e => setState({...state, email: e.target.value})}
              />
            </div>
            <button
              className={`mt-6 cursor-pointer disabled:cursor-default w-full bg-linear-to-r from-indigo-700 to-indigo-800 hover:from-indigo-800 hover:to-indigo-900 text-sm text-white p-2 rounded-md${loginMutation.isPending ? " animate-pulse" : ""}`}
              type="submit"
              disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Sign in" : "Sign in"}
            </button>
          </form>)}
        {!!loginMutation.data && (
          <form onSubmit={(e) => {
            e.preventDefault();
            verifyMutation.mutate({email: state.email, code: state.verificationCode})
          }}>
            <div className="flex flex-col">
              <input className="border-gray-400 border-1 bg-white rounded-md px-3 py-2 text-sm"
                     id="verification-code"
                     placeholder="Enter the verification code"
                     required
                     value={state.verificationCode}
                     onChange={e => setState({...state, verificationCode: e.target.value})}
              />
            </div>
            {!!verifyMutation.error && (
              <div className="rounded-md border border-white/20 p-1 bg-red-600 mt-6">
                Incorrect verification code
              </div>
              )}
            <button
              className={`mt-6 cursor-pointer disabled:cursor-default w-full bg-linear-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-sm text-white p-2 rounded-md${verifyMutation.isPending ? " animate-pulse" : ""}`}
              type="submit"
              disabled={verifyMutation.isPending}>
              Verify
            </button>
          </form>
        )}
      </div>
    </div>


  </div>
}

export default Login;