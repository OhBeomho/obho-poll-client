import { useCallback, useReducer, useState } from "react";
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

export default function () {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      if (!state.name) {
        alert("Please enter poll name.");
      } else if (!state.password) {
        alert("Please enter poll password.");
      } else if (state.options.length <= 1) {
        alert("There must be at least 2 options.");
      } else {
        setLoading(true);
        post("/create", state)
          .then((data) => {
            const id = data.pollId;
            navigate("/result/" + id);
          })
          .catch(errorHandler)
          .finally(() => setLoading(false));
      }

      e.preventDefault();
    },
    [state]
  );

  const addOption = useCallback(() => {
    const option = prompt("Enter new option");

    if (!option) {
      return;
    }

    state.options.push(option);
    dispatch({
      type: "options",
      value: JSON.stringify(state.options)
    });
  }, [state]);

  const optionElements = state.options.map((option, index) => (
    <li key={index}>
      {option}
      <Button
        type="button"
        onClick={() => {
          state.options.splice(index, 1);
          dispatch({
            type: "options",
            value: JSON.stringify(state.options)
          });
        }}
      >
        Remove
      </Button>
    </li>
  ));

  return loading ? (
    <Layout>
      <h1>Loading</h1>
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
                <Input onChange={(e) => dispatch({ type: "name", value: e.target.value })} />
              </td>
            </tr>
            <tr>
              <td>
                Description <span style={{ color: "gray" }}>(Optional)</span>
              </td>
              <td>
                <Input onChange={(e) => dispatch({ type: "description", value: e.target.value })} />
              </td>
            </tr>
            <tr>
              <td>Password</td>
              <td>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => dispatch({ type: "password", value: e.target.value })}
                />
                <Button type="button" onClick={() => setShowPassword((old) => !old)}>
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </td>
            </tr>
            <tr>
              <td>Options</td>
              <td>
                <ul>{optionElements}</ul>
                <Button type="button" onClick={addOption}>
                  Add new option
                </Button>
              </td>
            </tr>
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
