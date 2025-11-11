import { BrowserRouter, Routes, Route } from "react-router-dom"
import ClientList from "./components/client/ClientList"
import ClientGroupList from "./components/clientGroup/ClientGroupList"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientList />} />
        <Route path="/groups" element={<ClientGroupList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
