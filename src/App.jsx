import { useEffect, useState } from "react";
import Grid from "./Grid";
import "./App.css";
import Display from "./display";

const ops = ["+", "-", "x", "/", "%"];

function App() {
  const [input, setInput] = useState("");
  const [ans, setAns] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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
          body: JSON.stringify({ expression: input, save: false }),
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

  // Change your live-preview fetch (useEffect) to NOT save:

// Change evaluate() to save and refresh history:
  const evaluate = async () => {
    if (ans === "") return;
    try {
        await fetch("http://localhost:8000/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expression: input, save: true }),
        });
        const res = await fetch("http://localhost:8000/history");
        const data = await res.json();
        setHistory(data);
    } catch (err) {
        console.log(err);
    }
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

  useEffect(() => {
  const fetchHistory = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/history"
      );

      const data = await response.json();

      setHistory(data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchHistory();
}, []);

  return (
  <div className="app-container">
    <div className="Calculator">
      <button
        className="history-btn"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? "Hide History" : "Show History"}
      </button>

      <Display input={input} ans={ans} />

      <Grid
        onButtonClick={gridnum}
        del={del}
        all_del={all_del}
        evaluate={evaluate}
      />
    </div>

    {showHistory && (
      <div className="history">
        <h3>History</h3>

        {history.length === 0 ? (
          <p>No calculations yet</p>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              className="history-item"
              onClick={() => setInput(item.expression)}
            >
              {item.expression} = {item.result}
            </div>
          ))
        )}
      </div>
    )}
   </div>
  );
}

export default App;