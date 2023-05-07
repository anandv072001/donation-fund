import React from "react";
import CampaignCreation from './components/CampaignCreation.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CampaignList from './components/CampaignList.jsx';
import CampaignDetails from "./components/CampaignDetails.jsx";
import NewRequest from "./components/NewRequest.jsx";
import RequestList from "./components/RequestList.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<CampaignList/>} />
        <Route exact path="/campaigns/new" element={<CampaignCreation/>} />
        <Route exact path="/campaigns/:address" element={<CampaignDetails />} />
        <Route exact path="/campaigns/:address/newrequests" element={<NewRequest />} />
        <Route exact path="/campaigns/:address/requests" element={<RequestList />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
