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

// Types
type LoginSchemaType = z.infer<typeof LoginSchema>;

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
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
        .then((data) => {
          setError(data.error)
          setSuccess(data.success)
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
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full" disabled={isPending}>Log In</Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
