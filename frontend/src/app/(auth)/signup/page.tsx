'use client';

import { useActionState } from "react";
import {signup} from './actions';

export default function Signup() {
    const [state, action, isPending] = useActionState(signup, undefined);

    return (
        <> 
            <div className="flex justify-center items-center content-center h-screen mx-10">
                <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8">
                    <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign Up</h1>

                    <form className='flex flex-col mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-3' action={action}>
                        <label className='block text-sm/6 font-medium text-gray-900' htmlFor="first_name">First Name</label>
                        <input
                            type='text'
                            name='first_name'
                            id='first_name'
                            placeholder='First name'
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        {state?.errors?.first_name && (
                            <div className="text-red-400">
                                {state.errors.first_name}
                            </div>)}

                        <label className='block text-sm/6 font-medium text-gray-900' htmlFor="last_name">Last Name</label>
                        <input
                            type='text'
                            name='last_name'
                            id='last_name'
                            placeholder='Last name'
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        {state?.errors?.last_name && (
                            <div className="text-red-400">
                                {state.errors.last_name}
                            </div>)}

                        <label className='block text-sm/6 font-medium text-gray-900' htmlFor="email">Email</label>
                        <input
                            type='text'
                            name='email'
                            id='email'
                            placeholder='Set an email'
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        {state?.errors?.email && (
                            <div className="text-red-400 ">
                                {state.errors.email}
                            </div>)}
                        <label className='block text-sm/6 font-medium text-gray-900' htmlFor="password">Password</label>
                        <input 
                            type="text"
                            name="password"
                            id="password"
                            placeholder="Set a password"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        {state?.errors?.password && (
                            <ul className="text-red-400">
                                {state.errors.password?.map((err) => (
                                    <li key={err}>{err}</li>
                                ))}
                            </ul>
                        )}
                        <label className='block text-sm/6 font-medium text-gray-900' htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            type="text"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirm password"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        {state?.errors?.confirmPassword && (
                            <div className="text-red-400 ">
                                {state.errors.confirmPassword}
                            </div>)}
                        <div>
                            <button className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' type='submit' disabled={isPending}>
                                {isPending ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}