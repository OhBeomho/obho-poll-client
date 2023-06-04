import { useNavigate } from "react-router-dom";
import Button from "../components/Button.styled";
import Layout from "../components/Layout";

export default function () {
  const navigate = useNavigate();

  return (
    <Layout>
      <h1>OhBeomho's Poll</h1>
      <p>Create your polls easily.</p>
      <Button onClick={() => navigate("/create")}>Create new poll</Button>
    </Layout>
  );
}
