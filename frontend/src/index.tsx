import type { NextPage } from 'next';
import Link from 'next/link'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
//const Home: NextPage = () => {
//  return (
//    <Link href="/auth">
//      <h1>Login: </h1>
//    </Link>
//  );
//}

//export default Home;
