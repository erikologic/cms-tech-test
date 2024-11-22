"use client";

import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  name: string
  value: string
}


interface AddLayerFormProps {
    token: string;
    bookId: number;
}

export default function AddLayerForm({token, bookId}: AddLayerFormProps) {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
      } = useForm<Inputs>()
      const onSubmit: SubmitHandler<Inputs> = (data) => {
        fetch("/api/add-layer", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            }).then(async (response) => {
                if (!response.ok) {
                    const message = await response.text()
                    throw new Error(message)
                }
                const { data: { layerId } } = await response.json()
                router.push(`/books/${bookId}/layers/${layerId}}`)
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
        <label htmlFor="value">Value</label>
        <input {...register("value", { required: true })} id="value"/>
        {errors.name && <span>This field is required</span>}
        <input type="submit" value="Submit"></input>
        {errors.root && <span>Couldn&apos;t create book: {errors.root.message}</span>}
        </form>
      )
}