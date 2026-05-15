import { useEffect, useState } from "react";
import Grid from "./Grid";
import "./App.css";
import Display from "./display";

const ops = ["+", "-", "x", "/", "%"];

function App() {
  const [input, setInput] = useState("");
  const [ans, setAns] = useState("");

  const gridnum = (value) => {
    if (input === "") {
      if (value === ".") {
        setInput("0.");
        return;
      }

      if (ops.includes(value)) return;

      if (value === "0" || value === "00") return;
    }

    if (ops.includes(value)) {
      if (input.at(-1) === value) return;
      if (
        value === "-" &&
        (input.at(-1) === "x" || input.at(-1) === "/")
      ) {
        setInput((prev) => prev + value);
        return;
      }

      if (ops.includes(input.at(-1))) {
        if (
          input.at(-2) === "x" ||
          input.at(-2) === "/"
        ) {
          setInput((prev) => prev.slice(0, -2) + value);
          return;
        }

        setInput((prev) => prev.slice(0, -1) + value);
        return;
      }
    }

    if (value === ".") {
      let i = input.length - 1;
      let currentNum = "";

      while (i >= 0 && !ops.includes(input[i])) {
        currentNum = input[i] + currentNum;
        i--;
      }

      if (currentNum.includes(".")) return;
    }

    setInput((prev) => prev + value);
  };

  const tokenize = (expr) => {
    const tokens = [];
    let num = "";

    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];
      if (!isNaN(ch) || ch === ".") {
        num += ch;
      }

      else if (ch === "-") {
        if (i === 0 || ops.includes(expr[i - 1])) {
          num += ch;
        } else {
          if (num) tokens.push(num);
          tokens.push(ch);
          num = "";
        }
      }

      else if (["+", "x", "/", "%"].includes(ch)) {
        if (num) tokens.push(num);
        tokens.push(ch);
        num = "";
      }
    }

    if (num) tokens.push(num);
    return tokens;
  };

  const calculate = (expr) => {
    if (expr === "") return "";

    try {
      const prec = {
        "+": 1,
        "-": 1,
        "x": 2,
        "/": 2,
        "%": 2,
      };

      const opStack = [];
      const postfix = [];
      const tokens = tokenize(expr);

      if (ops.includes(tokens[tokens.length - 1])) {
        tokens.pop();
      }

      for (let token of tokens) {
        if (!isNaN(Number(token))) {
          postfix.push(token);
        } else {
          while (
            opStack.length &&
            prec[opStack[opStack.length - 1]] >= prec[token]
          ) {
            postfix.push(opStack.pop());
          }

          opStack.push(token);
        }
      }

      while (opStack.length) {
        postfix.push(opStack.pop());
      }

      const evalStack = [];

      for (let token of postfix) {
        if (!isNaN(Number(token))) {
          evalStack.push(Number(token));
        } else {
          const b = evalStack.pop();
          const a = evalStack.pop();

          switch (token) {
            case "+":
              evalStack.push(a + b);
              break;

            case "-":
              evalStack.push(a - b);
              break;

            case "x":
              evalStack.push(a * b);
              break;

            case "/":
              evalStack.push(a / b);
              break;

            case "%":
              evalStack.push((a * b) / 100);
              break;

            default:
              return "Error";
          }
        }
      }

      return evalStack.length === 1
        ? String(evalStack[0])
        : "Error";
    } catch {
      return "Error";
    }
  };


  useEffect(() => {
    const result = calculate(input);

    if (result !== "Error") {
      setAns(result);
    } else {
      setAns("");
    }

    setAns(calculate(input) !== "Error" ? result : "");
  }, [input]);

  const evaluate = () => { //=
    const result = calculate(input);
      setInput(result);
      setAns("");
  };

  const del = () => { 
    if (input === "") return;
    setInput((prev) => prev.slice(0, -1));
  };

  const all_del = () => {
    setInput("");
    setAns("");
  };

  return (
    <>
      <div className="Calculator">
        <Display input={input} ans={ans} />

        <Grid
          onButtonClick={gridnum}
          del={del}
          all_del={all_del}
          evaluate={evaluate}
        />
      </div>
    </>
  );
}

export default App;