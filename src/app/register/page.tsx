import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Rejestracja',
  description: 'Utwórz nowe konto',
}

export default function RegisterPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Rejestracja</CardTitle>
          <CardDescription>
            Utwórz nowe konto aby korzystać z aplikacji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Masz już konto?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Zaloguj się
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 