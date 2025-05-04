import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from '@/components/auth/LoginForm'
import { Alert } from "@/components/ui/alert"

export const metadata = {
  title: 'Login',
  description: 'Log in to your account',
}

interface LoginPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const message = searchParams.message as string | undefined

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Log in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className="mb-4">
              {message}
            </Alert>
          )}
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}