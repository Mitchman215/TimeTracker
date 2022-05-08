import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface ErrorPageProps {
  error: string | Error
}

// A component that shows an error and a button to navigate back to the home page
function ErrorPage({ error }: ErrorPageProps) {
  // when the page loads, log the error
  useEffect(() => {
    console.log({ error })
  }, [error])

  // redirect to home page when button is clicked
  const navigate = useNavigate()
  function redirectToHome() {
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center">
      <span className="rounded-lg p-4 bg-orange-light flex flex-col items-center">
        <h1 className="text-2xl m-2 text-white font-semibold drop-shadow-md">
          An error occured!
        </h1>
        <p className="text-red-error text-xl m-2 drop-shadow-sm italic">
          {error.toString()}
        </p>
        <button className="btn-purple my-2" onClick={redirectToHome}>
          Navigate back to home page
        </button>
      </span>
    </div>
  )
}

export default ErrorPage
