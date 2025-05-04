import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your account',
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 