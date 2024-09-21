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
import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";
import { register } from "@/actions/register";

// Types
type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  //? Use zodResolver to integrate Zod schema validation with the form
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema), // Attach the schema validation
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Define the submit handler
  const onSubmit = (credentials: RegisterSchemaType) => {
    setSuccess("");
    setError("");

    console.log("Form data:", credentials);

    startTransition(() => {
      register(credentials)
        .then((data) => {
          setError(data.error)
          setSuccess(data.success)
          console.log("error ", error)
          console.log("success ", success)
        })
    })
  };

  return (
    <CardWrapper
      headerLabel="Register"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-6">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Tyler Durden" {...field} disabled={isPending} />
                  </FormControl>
                  <FormDescription>
                    Enter your full name to register.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    Enter your email address to register.
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
            <Button type="submit" className="w-full" disabled={isPending}>Create an account</Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
