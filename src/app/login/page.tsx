import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <Card className="w-[400px] mx-4">
      <CardHeader>
        <CardTitle>Text Correction</CardTitle>
        <CardDescription>
          Zaloguj się lub zarejestruj, aby korzystać z aplikacji
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="flex gap-4 pt-2">
            <Button formAction={login} className="flex-1">
              Zaloguj się
            </Button>
            <Button formAction={signup} variant="outline" className="flex-1">
              Zarejestruj się
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}