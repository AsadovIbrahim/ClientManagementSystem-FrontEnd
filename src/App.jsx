import { BrowserRouter, Routes, Route } from "react-router-dom"
import ClientList from "./components/client/ClientList"
import ClientGroupList from "./components/clientGroup/ClientGroupList"
import ClientGroupTreeView from "./components/clientsgrouptree/ClientGroupTreeView"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientList />} />
        <Route path="/groups" element={<ClientGroupList />} />
        <Route path="/group-tree" element={<ClientGroupTreeView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
