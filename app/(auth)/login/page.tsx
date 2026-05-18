import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-semibold">Cubita Calendar</h1>
        <p className="text-sm text-muted-foreground">Entrá para ver tu agenda</p>
      </header>
      <LoginForm />
    </div>
  );
}
