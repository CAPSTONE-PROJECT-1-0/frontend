import LoginRegisterForm from "@/components/login-register-form"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <LoginRegisterForm />
      </div>
    </main>
  )
}
