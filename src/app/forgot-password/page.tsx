import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata = {
  title: 'Odzyskiwanie hasła',
  description: 'Zresetuj swoje hasło',
}

export default function ForgotPasswordPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Odzyskiwanie hasła</CardTitle>
          <CardDescription>
            Wprowadź swój adres email, a wyślemy Ci link do zresetowania hasła
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Pamiętasz hasło?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Wróć do logowania
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 