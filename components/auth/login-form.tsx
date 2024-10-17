"use client"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardWrapper } from './card-wrapper';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";
import { login } from "@/actions/login";
import { useSearchParams } from 'next/navigation';

// Types
type LoginSchemaType = z.infer<typeof LoginSchema>;

export const LoginForm = () => {
  // error and success states are created for displaying error and success UI messages in the form 
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();


  const searchParams = useSearchParams()
  const urlError = searchParams.get('error') === "OAuthAccountNotLinked" ? "Email address already linked to another provider." : "";

  //? Use zodResolver to integrate Zod schema validation with the form
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema), // Attach the schema validation
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define the submit handler
  const onSubmit = (credentials: LoginSchemaType) => {
    setSuccess("");
    setError("");

    startTransition(() => {
      login(credentials)
        .then((data) => { //* Here, data is the object returned from the login function
          setError(data?.error) // If the data object has an error key, set the error state to the value of the error key
          setSuccess(data?.success) // If the data object has a success key, set the success state to the value of the success key
        })
    })

    console.log("Form data:", credentials);
    console.log("Error :", error)
    console.log("Success :", success)
  };

  return (
    <CardWrapper
      headerLabel="Welcome back!"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-6">

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} disabled={isPending} />
                  </FormControl>
                  <FormDescription>
                    Enter your email address to log in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} disabled={isPending} />
                  </FormControl>
                  <FormDescription>
                    Enter your password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full" disabled={isPending}>Log In</Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
