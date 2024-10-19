import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { HashLoader } from "react-spinners"
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'

interface VerifyEmailContentProps {
  token: string | null;
  success: string | undefined;
  error: string | undefined;
}

const VerifyEmailContent = ({ token, success, error }: VerifyEmailContentProps) => {
  return (
    <div className='flex flex-col items-center justify-between h-[50vh]'>
      <section>
        {!success && !error && (
          <div className='flex flex-col gap-5 items-center'>
            <HashLoader color='#737373' />
            <p className='animate-pulse text-xl'>Verifying Email</p>
          </div>
        )
        }
        <FormError message={error} />
        <FormSuccess message={success} />
      </section>
      <section className='flex flex-col gap-3 items-center'>
        <div>
          <span>FYI, your account verification token is </span>
          <code className="text-neutral-400">{token}</code>
        </div>
        <Link href={"/auth/login"}>
          <Button className="border border-border/10 hover:border-border/50 flex gap-2">
            <ArrowLeft className='size-4' />
            Back to login
          </Button>
        </Link>
      </section>
    </div>
  )
}
export default VerifyEmailContent