"use client"

import { Button, Divider } from "thread-ui"
import {useFormState} from 'react-dom'
import { authenticate } from "@/lib/actions";

export const LoginForm = () => {
    const [errorMessage, formAction] = useFormState(authenticate, undefined);

    return (
        
        <form 
          action={formAction} 
          className="sm:w-10/12 md:max-w-80 mx-auto flex flex-col gap-6 justify-center items-center border rounded max-w-screen-sm p-4"
        >
          <span>
            Admin Login
            <Divider />
          </span>
          
          <label className="flex flex-col gap-2 w-full">
            Password
            <input 
              className={`border rounded p-2 ${errorMessage ? 'border-red-500' : ''}`}
              id="password"
              name="password"
              type="password"
              required
              minLength={2}
            />
            {errorMessage && <span className="text-red-500 text-sm">{errorMessage}</span>}
          </label>

          <Button fullWidth type="submit">
            Submit
          </Button>
        </form>
    )
}