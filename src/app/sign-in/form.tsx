"use client";

import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  name: string
}


export default function SignInForm() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
      } = useForm<Inputs>()
      const onSubmit: SubmitHandler<Inputs> = (data) => {
        fetch("/api/sign-in", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
            }).then(async (response) => {
                if (!response.ok) {
                    const message = await response.text()
                    throw new Error(message)
                }
                router.push("/books")
            }).catch((error) => {
                setError("root", {
                    message: error.message,
                })
            })  
      }
    
    
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Name</label>
            <input {...register("name", { required: true })} id="name"/>
            {errors.name && <span>This field is required</span>}
            <input type="submit" value="Submit"></input>
            {errors.root && <span>Couldn&apos;t sign-in user: {errors.root.message}</span>}
        </form>
      )
}