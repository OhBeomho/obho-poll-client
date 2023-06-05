import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Vote from "./pages/Vote";
import Create from "./pages/Create";
import Result from "./pages/Result";

export default function () {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/create" element={<Create />} />
      <Route path="/vote/:pollId" element={<Vote />} />
      <Route path="/result/:pollId" element={<Result />} />
    </Routes>
  );
}
