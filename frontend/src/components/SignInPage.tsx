import Auth from '../pages/Auth'

interface SignInPageProp {
  message?: string
}

function SignInPage({ message }: SignInPageProp) {
  return (
    <div className="bg-blue-light w-screen h-screen p-4">
      {message === undefined && (
        <header>
          <p>{message}</p>
        </header>
      )}
      <main className="mt-8">
        <Auth />
      </main>
    </div>
  )
}

export default SignInPage
