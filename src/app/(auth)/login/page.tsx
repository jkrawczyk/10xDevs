import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Login',
  description: 'Log in to your account',
}

export default async function LoginPage() {

  return (
    <main className="flex-1 flex items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Log in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account yet?{' '}
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
    </main>
  )
}