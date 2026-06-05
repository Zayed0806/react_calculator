const express = require("express");
const cors = require("cors");
const History = require("./History");
require("./db");
const app = express();
app.use(cors());
app.use(express.json());
const ops = ["+", "-", "x", "/", "%"];
function tokenize(expr) {
  const tokens = [];
  let num = "";
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (!isNaN(ch) || ch === ".") {
      num += ch;
    } else if (ch === "-") {
      if (i === 0 || ops.includes(expr[i - 1])) {
        num += ch;
      } else {
        if (num) tokens.push(num);
        tokens.push(ch);
        num = "";
      }
    } else if (["+", "x", "/", "%"].includes(ch)) {
      if (num) tokens.push(num);
      tokens.push(ch);
      num = "";
    }
  }
  if (num) tokens.push(num);
  return tokens;
}
function calculate(expr) {
  if (expr === "") return "";
  try {
    const prec = { "+": 1, "-": 1, "x": 2, "/": 2, "%": 2 };
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
          case "+": evalStack.push(a + b); break;
          case "-": evalStack.push(a - b); break;
          case "x": evalStack.push(a * b); break;
          case "/": evalStack.push(a / b); break;
          case "%": evalStack.push((b * a) / 100); break;
        }
      }
    }
    return evalStack.length === 1 ? String(evalStack[0]) : "Error";
  } catch {
    return "Error";
  }
}
app.post("/calculate", async (req, res) => {
  const { expression, save } = req.body;
  const result = calculate(expression);
  try {
    if (save) {
      await History.create({ expression, result });
    }
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.get("/history", async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.listen(8000, () => {
  console.log("Server running on port 8000");
});