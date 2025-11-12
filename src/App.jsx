import "./locales/index.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientList from "./components/client/ClientList";
import ClientGroupList from "./components/clientGroup/ClientGroupList";
import ClientGroupTreeView from "./components/clientsgrouptree/ClientGroupTreeView";
import Layout from "./components/layout/Layout";
import "./App.css"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ClientList />} />
          <Route path="groups" element={<ClientGroupList />} />
          <Route path="group-tree" element={<ClientGroupTreeView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
