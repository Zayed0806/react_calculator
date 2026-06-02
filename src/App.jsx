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

  useEffect(() => {
    const fetchResult = async () => {
      if (input === "") {
        setAns("");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expression: input,
          }),
        });

        const data = await response.json();

        if (data.result !== "Error") {
          setAns(data.result);
        } else {
          setAns("");
        }
      } catch (error) {
        console.log(error);
        setAns("");
      }
    };

    fetchResult();
  }, [input]);

  const evaluate = () => {
    setInput(ans);
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