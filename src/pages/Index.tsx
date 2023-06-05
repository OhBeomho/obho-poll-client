import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button.styled";
import Layout from "../components/Layout";
import { useEffect } from "react";

export default function () {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    if (params.has("r") || params.has("p")) {
      navigate(params.has("r") ? "/result/" + params.get("r") : "/vote/" + params.get("p"));
    }
  }, [params]);

  return (
    <Layout>
      <h1>OhBeomho's Poll</h1>
      <p>Create your polls easily.</p>
      <Button onClick={() => navigate("/create")}>Create new poll</Button>
    </Layout>
  );
}
