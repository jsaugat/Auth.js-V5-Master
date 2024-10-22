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
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";
import { setNewPassword } from "@/actions/setNewPassword";
import { useSearchParams } from "next/navigation";

// Types
type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;

export const NewPasswordForm = () => {
  // error and success states are created for displaying error and success UI messages in the form 
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  //? Use zodResolver to integrate Zod schema validation with the form
  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema), // Attach the schema validation
    defaultValues: {
      password: "",
    },
  });

  // Update the submit handler for sending reset email
  const onSubmit = (credentials: NewPasswordSchemaType) => {
    setSuccess("");
    setError("");

    startTransition(() => {
      // Call the function to
      setNewPassword(credentials, token)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        });
    });

    console.log("Password submitted:", credentials);
  };

  return (
    <CardWrapper
      headerLabel="Create a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-6">

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
                    Enter your new password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full" disabled={isPending}>Set New Password</Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
