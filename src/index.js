import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let classname = props.state ? "win" : ""
    return (
    <button className="square" onClick={props.onClick}>
        <div className={classname}>
            {props.value}
        </div>
    </button>
    );
} 

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                state={this.props.winningSquares.includes(i)}
            />
        );
    }
    
    render() {
        return (
            <div>
            {[...Array(3).keys()].map(column => {
                return(
                    <div className="board-row">
                    {[...Array(3).keys()].map(line => {
                        return(
                            this.renderSquare(column*3 + line)
                        )
                    })}
                    </div>
                )
            })}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                clickedButton: null
            }],
            xIsNext: true,
            stepNumber: 0,
            sortRev: false,
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            if(this.state.sortRev)  move = this.state.history.length - 1 - move;
            const column = (step.clickedButton)%3 + 1;
            const line = parseInt((step.clickedButton)/3 + 1);
            const desc = move ? 
                `Revenir au tour n° ${move} (${column}, ${line})` : 
                'Revenir audébut de la partie'
            return(
                <li className="history" key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        })

        let status;
        let winningSquares = []
        if(winner) {
            status = `${winner.winner} a gagné !`
            winningSquares = winner.winningSquares
        }
        else {
            status = this.state.stepNumber == 9 ?
            'Deuce' :
            `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        let sortDesc = this.state.sortRev ? 'Switch to ascending sort' : 'Switch to descending sort';
        return (
            <div className="game">
                <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                    winningSquares={winningSquares}
                />
                </div>
                <div className="game-info">
                <div>{status}</div>
                <ol>
                    <button onClick={() => this.sort()}>{sortDesc}</button>
                    {moves}
                </ol>
                </div>
            </div>
        );
    }

    sort(){
        this.setState({
            sortRev: !this.state.sortRev
        })
    }

    jumpTo(stepNumber){
        this.setState({
            stepNumber,
            xIsNext: (stepNumber % 2) === 0
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) return
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares,
                clickedButton: i
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
    }
}

// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winningSquares: lines[i]
            };
        }
    }
    return null;
}