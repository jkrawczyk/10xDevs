import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from '@/components/auth/LoginForm'
import { Alert } from "@/components/ui/alert"

export const metadata = {
  title: 'Logowanie',
  description: 'Zaloguj się do swojego konta',
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
          <CardTitle className="text-2xl">Logowanie</CardTitle>
          <CardDescription>
            Zaloguj się do swojego konta aby kontynuować
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
            Nie masz jeszcze konta?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Zarejestruj się
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Zapomniałeś hasła?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}