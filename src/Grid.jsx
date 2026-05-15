

function Grid ({onButtonClick, del, all_del, evaluate}) {
    return (
        <>
            <div className="grid">
            <button className="clear" onClick={() => all_del()}>AC</button>
            <button className="Numbers" onClick={() => onButtonClick("%")}>%</button>
            <button className="Numbers" onClick={() => del()}>C</button>
            <button className="Operator" onClick={() => onButtonClick("/")}>/</button>
            <button className="Numbers" onClick={() => onButtonClick("7")}>7</button>
            <button className="Numbers" onClick={() => onButtonClick("8")}>8</button>
            <button className="Numbers" onClick={() => onButtonClick("9")}>9</button>
            <button className="Operator" onClick={() => onButtonClick("x")}>x</button>
            <button className="Numbers" onClick={() => onButtonClick("4")}>4</button>
            <button className="Numbers" onClick={() => onButtonClick("5")}>5</button>
            <button className="Numbers" onClick={() => onButtonClick("6")}>6</button>
            <button className="Operator" onClick={() => onButtonClick("-")}>-</button>
            <button className="Numbers" onClick={() => onButtonClick("1")}>1</button>
            <button className="Numbers" onClick={() => onButtonClick("2")}>2</button>
            <button className="Numbers" onClick={() => onButtonClick("3")}>3</button>
            <button className="Operator" onClick={() => onButtonClick("+")}>+</button>
            <button className="Numbers" onClick={() => onButtonClick("00")}>00</button>
            <button className="Numbers" onClick={() => onButtonClick("0")}>0</button>
            <button className="Numbers" onClick={() => onButtonClick(".")}>.</button>
            <button className="equals" onClick={() => evaluate()}>=</button>
            </div>
        </>
        )
}

export default Grid; 