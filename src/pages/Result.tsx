import { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { del, get } from "../utils/request";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button.styled";
import errorHandler from "../utils/errorHandler";
import Input from "../components/Input.styled";

interface Poll {
  name: string;
  description?: string;
  options: string[];
  votes: number[];
  open: boolean;
}

export default function () {
  const [poll, setPoll] = useState<Poll>();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { pollId } = useParams();
  const navigate = useNavigate();

  const loadPoll = useCallback(() => {
    if (!pollId) {
      navigate("/");
      return;
    }

    setPoll(undefined);

    get("/" + pollId)
      .then((data) => setPoll(data.poll))
      .catch((err) => errorHandler(err, () => setError(err.message)));
  }, []);

  const closeOrDeletePoll = useCallback(
    (type: "close" | "delete") => {
      if (!password) {
        return;
      }

      if (type === "close") {
        get(`/close/${pollId}/${password}`).then(loadPoll).catch(errorHandler);
      } else {
        del(`/${pollId}/${password}`)
          .then(() => navigate("/"))
          .catch((err) => errorHandler(err, () => setError(err.message)));
      }

      setInputPassword("");
    },
    [password]
  );

  useEffect(loadPoll, []);

  let max = 0;
  let optionElements;

  if (poll) {
    const counts = new Map();

    for (let vote of poll.votes) {
      counts.get(vote) ? counts.set(vote, counts.get(vote) + 1) : counts.set(vote, 1);

      if (counts.get(vote) > max) {
        max = counts.get(vote);
      }
    }

    optionElements = poll.options.map((option, index) => {
      const voteCount = poll.votes.filter((vote) => vote === index).length;

      return (
        <li key={index}>
          {option}
          <progress max={max} value={voteCount} style={{ marginLeft: 10, marginRight: 5 }} />
          {voteCount}
        </li>
      );
    });
  }

  return error ? (
    <Layout>
      <h1 style={{ color: "red" }}>{error}</h1>
      <Button onClick={() => navigate(-1)}>Back</Button>
    </Layout>
  ) : poll ? (
    <Layout>
      <h1>
        {!poll.open && <span style={{ color: "gray" }}>[Closed]</span>} {poll.name} - Result
      </h1>
      {poll.description && <p>{poll.description}</p>}
      <p>
        <b>{poll.votes.length} votes</b>
      </p>
      <ul>{optionElements}</ul>
      <p>
        <Button onClick={() => setInputPassword("close")} disabled={inputPassword !== ""}>
          Close poll
        </Button>
        <Button onClick={() => setInputPassword("delete")} disabled={inputPassword !== ""}>
          Delete poll
        </Button>
        <br />
        {inputPassword && (
          <div>
            <p>
              Enter your password
              <br />
              <Input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
              />
              <Button onClick={() => setShowPassword((old) => !old)}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </p>
            <p>
              <Button onClick={() => setInputPassword("")}>Cancel</Button>
              <Button onClick={() => closeOrDeletePoll(inputPassword as "close" | "delete")}>
                Confirm
              </Button>
            </p>
          </div>
        )}
      </p>
      <h2 style={{ marginBottom: 0 }}>Share</h2>
      <p>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}?p=${pollId}`);
            alert("Link copied.");
          }}
        >
          Share poll
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}?r=${pollId}`);
            alert("Link copied.");
          }}
        >
          Share result
        </Button>
      </p>
    </Layout>
  ) : (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  );
}
