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
import { ResetSchema } from "@/schemas";
import * as z from "zod";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";
import { resetPassword } from "@/actions/resetPassword";

// Types
type ResetSchemaType = z.infer<typeof ResetSchema>;

export const ResetForm = () => {
  // error and success states are created for displaying error and success UI messages in the form 
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  //? Use zodResolver to integrate Zod schema validation with the form
  const form = useForm<ResetSchemaType>({
    resolver: zodResolver(ResetSchema), // Attach the schema validation
    defaultValues: {
      email: "",
    },
  });

  // Update the submit handler for sending reset email
  const onSubmit = (credentials: { email: string }) => {
    setSuccess("");
    setError("");

    startTransition(() => {
      // Call the function to send reset email (you need to implement this)
      resetPassword(credentials)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        });
    });

    console.log("Email submitted:", credentials.email);
  };

  return (
    <CardWrapper
      headerLabel="Reset Your Password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial={false}
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
                    Enter your email address to receive a password reset link.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full" disabled={isPending}>Send Reset Email</Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
