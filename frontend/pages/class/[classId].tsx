import { useRouter } from "next/router"

export default function Class() {
  const router = useRouter()
  const { classId } = router.query
  return <h1>Current Class: {classId}</h1>
}