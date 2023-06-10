import { useCallback, useEffect, useReducer, useState } from "react";
import Layout from "../components/Layout";
import Input from "../components/Input.styled";
import Button from "../components/Button.styled";
import { post } from "../utils/request";
import { useNavigate } from "react-router-dom";
import errorHandler from "../utils/errorHandler";

interface FormState {
  name: string;
  description?: string;
  options: string[];
  password: string;
}

interface FormAction {
  type: "name" | "description" | "options" | "password";
  value: string;
}

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "name":
      return { ...state, name: action.value };
    case "description":
      return { ...state, description: action.value || undefined };
    case "options":
      return {
        ...state,
        options: JSON.parse(action.value)
      };
    case "password":
      return { ...state, password: action.value };
  }
}

const initialState: FormState = {
  name: "",
  options: [],
  password: ""
};

const conditions = [
  {
    condition: /\w{6,}/g,
    text: "At least 6 characters"
  },
  {
    condition: /[a-zA-Z]/g,
    text: "Alphabets"
  },
  {
    condition: /[0-9]/g,
    text: "Numbers"
  },
  {
    condition: /[!@#$%^&*()?]/g,
    text: "At least 1 special characters"
  }
];

export default function () {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState<boolean[]>([]);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [addValue, setAddValue] = useState("");
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      if (!state.name) {
        setError("Please enter the name of the poll.");
      } else if (!state.password) {
        setError("Please enter the password.");
      } else if (pass.some((p) => !p)) {
        setError("The password doesn't meet the conditions.");
      } else if (state.options.length <= 1) {
        setError("There must be at least 2 options.");
      } else {
        setLoading(true);
        post("/create", state)
          .then((data) => {
            const id = data.pollId;
            navigate("/result/" + id);
          })
          .catch((err) => errorHandler(err, () => setError(err.message)))
          .finally(() => setLoading(false));
      }

      e.preventDefault();
    },
    [state, pass]
  );

  const addOption = useCallback(
    (option: string) => {
      state.options.push(option);
      dispatch({
        type: "options",
        value: JSON.stringify(state.options)
      });

      setAdding(false);
    },
    [state]
  );

  const onAdd = useCallback(() => {
    if (!addValue) {
      return;
    } else if (state.options.includes(addValue)) {
      setError(`You already have option '${addValue}'`);
      return;
    }

    addOption(addValue);
    setAdding(false);
  }, [addValue, state]);

  const onRemove = useCallback(
    (index: number) => {
      state.options.splice(index, 1);
      dispatch({
        type: "options",
        value: JSON.stringify(state.options)
      });
    },
    [state]
  );

  useEffect(() => {
    if (state.password) {
      const pass: boolean[] = [];
      for (let c of conditions) {
        pass.push(c.condition.test(state.password));

        c.condition.lastIndex = 0;
      }

      setPass(pass);
    }

    setError("");
  }, [state]);

  const optionElements = state.options.map((option, index) => (
    <li key={index}>
      {option}
      <Button type="button" onClick={() => onRemove(index)}>
        Remove
      </Button>
    </li>
  ));

  const passElements = pass.map((p, index) => (
    <li key={index} style={{ color: p ? "rgb(0, 200, 0)" : "rgb(200, 0, 0)" }}>
      {conditions[index].text}
    </li>
  ));

  if (adding) {
    optionElements.push(
      <li key={optionElements.length}>
        <Input onChange={(e) => setAddValue(e.target.value)} autoFocus />
        <Button type="button" onClick={onAdd}>
          Add
        </Button>
        <Button type="button" onClick={() => setAdding(false)}>
          Cancel
        </Button>
      </li>
    );
  }

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <Layout>
      <h1>Create new poll</h1>
      <form onSubmit={onSubmit}>
        <table>
          <tbody>
            <tr>
              <td>Poll Name</td>
              <td>
                <Input
                  onChange={(e) => dispatch({ type: "name", value: e.target.value })}
                  value={state.name}
                />
              </td>
            </tr>
            <tr>
              <td>
                Description <span style={{ color: "gray" }}>(Optional)</span>
              </td>
              <td>
                <Input
                  onChange={(e) => dispatch({ type: "description", value: e.target.value })}
                  value={state.description || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Password</td>
              <td>
                <Input
                  type={showPassword ? "text" : "password"}
                  onInput={(e) =>
                    dispatch({ type: "password", value: (e.target as HTMLInputElement).value })
                  }
                  value={state.password}
                />
                <Button type="button" onClick={() => setShowPassword((old) => !old)}>
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </td>
            </tr>
            {state.password && (
              <tr>
                <td>
                  <ul>{passElements}</ul>
                </td>
              </tr>
            )}
            <tr>
              <td>Options</td>
              <td>
                <ul>{optionElements}</ul>
                <Button type="button" onClick={() => setAdding(true)} disabled={adding}>
                  Add new option
                </Button>
              </td>
            </tr>
            {error && (
              <tr>
                <td style={{ color: "rgb(200, 0, 0)" }}>{error}</td>
              </tr>
            )}
            <tr>
              <td colSpan={2}>
                <Button type="submit">Create</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </Layout>
  );
}
