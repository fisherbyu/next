"use client"
import { Button, Divider } from "thread-ui";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState("");

  const login = (formData: FormData) => {
    const password = formData.get("password");
    
    if (!password) {
      setError("Password is required");
      return; // Prevent further execution
    }
    
    // Clear error if validation passes
    setError("");
    alert(password);
  }

  return (
    <main className="flex flex-grow py-7">
      <section className="container p-4">
        <form 
          action={login} 
          className="sm:w-10/12 max-w-96 md:max-w-80 mx-auto flex flex-col gap-6 justify-center items-center border rounded p-6"
        >
          <span>
            Admin Login
            <Divider />
          </span>
          
          <label className="flex flex-col gap-2 w-full">
            Password
            <input 
              className={`border rounded p-2 ${error ? 'border-red-500' : ''}`}
              name="password"
              type="password"
              required
              onChange={() => error && setError("")} // Clear error when user starts typing
            />
            {error && <span className="text-red-500 text-sm">{error}</span>}
          </label>

          <Button type="submit">
            Submit
          </Button>
        </form>
      </section>
    </main>
  );
}