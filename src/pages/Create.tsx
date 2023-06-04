import { useReducer } from "react";
import Layout from "../components/Layout";

interface FormState {
  name: string;
  description: string;
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
      return { ...state, description: action.value };
    case "options":
      return { ...state, options: action.value.split(",") };
    case "password":
      return { ...state, password: action.value };
  }
}

const initialState: FormState = {
  name: "",
  description: "",
  options: [],
  password: ""
};

export default function () {
  const [state, dispatch] = useReducer(reducer, initialState);

  // TODO

  return <Layout></Layout>;
}
