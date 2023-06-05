import { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { get, post } from "../utils/request";
import { useNavigate, useParams } from "react-router-dom";
import errorHandler from "../utils/errorHandler";
import Button from "../components/Button.styled";

interface Poll {
  name: string;
  description?: string;
  options: string[];
  voters: string[];
  open: boolean;
}

export default function () {
  const [ip, setIp] = useState("");
  const [poll, setPoll] = useState<Poll>();
  const [selected, setSelected] = useState(-1);
  const { pollId } = useParams();
  const navigate = useNavigate();

  if (!pollId) {
    navigate("/");
    return <div></div>;
  }

  useEffect(() => {
    fetch("https://geolocation-db.com/json/")
      .then((res) => res.json())
      .then((data) => setIp(data.IPv4));

    get("/poll/" + pollId)
      .then((data) => setPoll(data.poll))
      .catch(errorHandler);
  }, []);

  const vote = useCallback(() => {
    if (selected === -1) {
      return;
    }

    post("/poll/vote/" + pollId, { option: selected, ip })
      .then(() => navigate("/result/" + pollId))
      .catch(errorHandler);
  }, [selected, ip]);

  const optionElements = poll?.options.map((option, index) => (
    <li key={index}>
      {option} <input type="radio" name="vote" onClick={() => setSelected(index)} />
    </li>
  ));

  return poll ? (
    <Layout>
      <h1>
        {!poll.open && <span style={{ color: "gray" }}>[Closed]</span>} {poll.name}
      </h1>
      {poll.description && <p>{poll.description}</p>}
      {poll.open ? <ul>{optionElements}</ul> : <p>The poll is closed.</p>}
      <p>
        {poll.open && <Button onClick={vote}>Vote</Button>}
        <Button onClick={() => navigate("/result/" + pollId)}>Show result</Button>
      </p>
    </Layout>
  ) : (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  );
}
