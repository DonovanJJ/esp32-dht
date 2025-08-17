import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router";
import Dashboard from "./pages/Dashboard.tsx";
import Layout from "./components/Layout.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Setting } from "./pages/Setting.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/setting' element={<Setting />} />
      {/*<Route path='contact' element={<Contact />} />*/}
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
