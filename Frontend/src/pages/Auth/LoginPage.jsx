
import { useState } from "react";
import { Link } from "react-router-dom";
import loginImage from "./loging.jpg"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    // TODO: integrate with your auth API
    console.log({ email, password, remember });
  }

  return (
    <div className="min-h-screen w-full bg-white text-black">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* LEFT: image only */}
        <div className="relative hidden md:block">
          <img 
            src={loginImage} // <-- put your image here
            alt="Gym illustration"
            className="h-full w-full object-cover "
          />
          {/* optional small logo on top-left */}
          <div className="absolute left-0 top-0 p-6 md:p-8">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-white/90" />
              <div className="text-black drop-shadow-sm">
                <div className="text-xl font-bold leading-tight">
                  Gettz <span className="text-red-600">Fitness</span>
                </div>
                <div className="text-xs text-neutral-700">Gym Management</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: form */}
        
        <div className="flex items-center justify-center px-6 py-12 md:px-14">
          <div className="w-full max-w-md rounded-[20px]">
            <h1 className="text-4xl font-bold tracking-tight">Login</h1>
            <p className="mt-3 text-sm text-neutral-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="font-medium text-red-600 hover:underline">
                Create your account
              </Link>
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <input
                  type="email"
                  placeholder="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-red-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 accent-red-600"
                  />
                  <span className="text-neutral-600">Remember Me</span>
                </label>
                <Link to="/forgot-password" className="text-neutral-500 hover:text-black">
                  Forgot Password?
                </Link>
              </div>

            <center>
              <button
                type="submit"
                className="w-75 mt-1.5 rounded-full bg-red-600 px-6 py-3 text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Login
              </button>
              </center>
              <div className="pt-2 text-center text-sm text-neutral-500">Or Login with</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

