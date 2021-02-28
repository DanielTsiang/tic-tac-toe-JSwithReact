function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
        {props.value}
        </button>
    );
    }
    /* Square is a function component.
    In React, function components are a simpler way to write components that only contain a render method and don’t have their own state.
    Instead of defining a class which extends React.Component, we can write a function that takes props as input and returns what should be rendered.
    Function components are less tedious to write than classes */
    
    class Board extends React.Component {
    renderSquare(i) {
        return (
        <Square
            // The Board component receive squares and onClick props from the Game component.
            //Passing props is how information flows in React apps, from parents to children.
            /* To collect data from multiple children, or to have two child components communicate with each other, you need to declare the shared state in their parent component instead.
            The parent component can pass the state back down to the children by using props;
            this keeps the child components in sync with each other and with the parent component.*/
            value={this.props.squares[i]}
            /* Since state is considered to be private to a component that defines it, we cannot update the Board’s state directly from Square.
            Instead, we’ll pass down a function from the Board to the Square, and we’ll have Square call that function when a square is clicked*/
            /* The onClick prop on the built-in DOM <button> component tells React to set up a click event listener.
            When the button is clicked, React will call the onClick event handler that is defined in Board’s renderSquare() method.
            This event handler calls this.props.onClick(). The Board’s onClick prop was specified by the Game.
            Since the Game passed onClick={() => this.handleClick(i)} to Board, the Board calls this.handleClick(i) when clicked. */
            onClick={() => this.props.onClick(i)}
            /*The DOM <button> element’s onClick attribute has a special meaning to React because it is a built-in component.
            For custom components like Square, the naming is up to you.
            We could give any name to the Square’s onClick prop or Board’s handleClick method, and the code would work the same.
            In React, it’s conventional to use on[Event] names for props which represent events and handle[Event] for the methods which handle the events.*/
            /*Since we have a single click handler in Board for many Squares,
            we need to pass the location of each Square into the onClick handler using props to indicate which Square was clicked. */
        />
        );
    }
    
    render() {
        return (
        <div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
    }
    
    class Game extends React.Component {
    constructor(props) {
        /* In JavaScript classes, you need to always call super when defining the constructor of a subclass.
        All React component classes that have a constructor should start with a super(props) call. */
        super(props);
        // store the current value of the Square in this.state, and change it when the Square is clicked
        this.state = {
        /* Top-level Game component is to display a list of past moves.
        So it will need access to the history to do that, so the history state is placed in the top-level Game component.
        This gives the Game component full control over the Board’s data, and lets it instruct the Board to render previous turns from the history. */
        history: [
            {
            squares: Array(9).fill(null)
            // array of length 9; each of the 9 elements are set to null i.e. [null, null, ..., null]
            }
        ],
        // stepNumber in the Game component’s state indicates which step we’re currently viewing.
        stepNumber: 0,
        // set the first move to be “X” by default
        xIsNext: true
        };
    }
    
    /*The state is stored in the Game component instead of the individual Square components.
    When the Game’s state changes, the Square components re-render automatically.
    Keeping the state of all squares in the Game component will allow it to determine the winner in the future.
    Since the Square components no longer maintain state, the Square components receive values from the Game component and inform the Game component when they’re clicked.
    In React terms, the Square components are now controlled components. The Game has full control over them.*/
    handleClick(i) {
        /* Use slice() to create a new copy of the squares array after every move, and treated it as immutable.
        This will allow us to store every past version of the squares array, and navigate between the turns that have already happened.
        Store the past squares arrays in another array called history. The history array represents all board states, from the first to the last move. */
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // in handleClick, call .slice() to create a copy of the squares array to modify instead of modifying the existing array.
        /*Avoiding direct data mutation lets us keep previous versions of the game’s history intact, and reuse them later.
        E.g. a “time travel” feature that allows us to review the tic-tac-toe game’s history and “jump back” to previous moves.*/
        /* this.state.history.slice(0, this.state.stepNumber + 1) ensures that if we “go back in time” and then make a new move from that point,
        we throw away all the “future” history that would now become incorrect. */
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        //handleClick function will return early by ignoring a click if someone has won the game or if a Square is already filled.
        if (calculateWinner(squares) || squares[i]) {
        return;
        }
        /*Each time a player moves, xIsNext (a boolean) will be flipped to determine which player goes next and the game’s state will be saved.
        The handleClick function flips the value of xIsNext*/
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
        //Within the Game’s handleClick method, we concatenate new history entries onto history.
        //The concat() method doesn’t mutate the original array, so this is preferred over push() method.
        history: history.concat([
            {
            squares: squares
            }
        ]),
        /* The stepNumber state we’ve added reflects the move displayed to the user now.
        After we make a new move, we need to update stepNumber by adding stepNumber: history.length as part of the this.setState argument.
        This ensures we don’t get stuck showing the same move after a new one has been made. */
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
        });
    }
    // The jumpTo method in Game updates the stepNumber. We also set xIsNext to true if the number that we’re changing stepNumber to is even.
    jumpTo(step) {
        this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
        });
    }
    
    //Game component is rendering the game’s status.
    render() {
        const history = this.state.history;
        // Game component’s render function renders the currently selected move according to stepNumber to determine and display the game’s status.
        const current = history[this.state.stepNumber];
        // If we click on any step in the game’s history, the tic-tac-toe board will immediately update to show what the board looked like after that step occurred.
        const winner = calculateWinner(current.squares);
    
        /* Since we are recording the tic-tac-toe game’s history, we can display it to the player as a list of past moves.
        React elements are first-class JavaScript objects; we can pass them around in our applications.
        To render multiple items in React, we can use an array of React elements.*/
        // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
        const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            /* For each move in the tic-tac-toe game’s history, we create a list item <li> which contains a button <button>.
            The button has a onClick handler which calls a method called this.jumpTo(). 
            We should see a list of the moves that have occurred in the game */
            /*Keys tell React about the identity of each component which allows React to maintain state between re-renders.
            If a component’s key changes, the component will be destroyed and re-created with a new state.
            "key" is a special and reserved property in React. 
            When an element is created, React extracts the key property and stores the key directly on the returned element. 
            Even though key may look like it belongs in props, key cannot be referenced using this.props.key. 
            React automatically uses key to decide which components to update. A component cannot inquire about its key.*/
            /*In the tic-tac-toe game’s history, each past move has a unique ID associated with it: it’s the sequential number of the move.
            The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.*/
            <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
        });
    
        let status;
        //If a player has won, display text such as “Winner: X” or “Winner: O”.
        if (winner) {
        status = "Winner: " + winner;
        } else {
        // change the “status” text in Game’s render so that it displays which player has the next turn
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
    
        return (
        <div className="game">
            <div className="game-board">
            <Board
                squares={current.squares}
                onClick={i => this.handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }
    }
    
    // ========================================
    
    ReactDOM.render(<Game />, document.getElementById("root"));
    
    // Show when the game is won and there are no more turns to make.
    function calculateWinner(squares) {
    // Declares a multidimensional array ‘lines’, that holds all the winning combinations
    // i.e. there is a winner if there is the same letter (i.e 'X') in boxes 0, 1, and 2 (the first combination below).
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    //
    for (let i = 0; i < lines.length; i++) {
        // create a new array with the same values as each winning combo. i.e. when i = 0 the new array of [a, b, c] is [0, 1, 2]
        const [a, b, c] = lines[i];
        // 'if' statement compares current combination of iteration with the board’s clicked squares combinations
        // and if there's a match, it returns the current combination, otherwise it returns null.
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        // The squares[a] by itself is checking if there is a value in that particular square (null is a falsy value)
        // and the remainder of the condition makes sure they are all the same type (either X or O).
    
        // If the value of a, b, c are the same, return the value of 'a' (either X or O).
        // If the value can be converted to false (e.g. if the value is null) the 'if' statement returns false.
        return squares[a];
        // square’s values can only be 'X', 'O', or null.
        }
    }
    return null;
      // The if statement checks if the there are 3 of the same letters for the winning combos
      // i.e. for winning combo [0, 1, 2] it looks up the values in the squares array -> squares[0], squares[1], squares[2].
      // E.g. here's how it breaks down for the first winning combo [0, 1, 2] in lines:
        // since a is 0, then squares[a] is squares[0] and the value of squares [0] is 'X'
        // squares[a] is true since it has a value, the value is 'X'
        // squares[a] === squares[b] is true because the value of squares[b] (i.e. squares[1]) is 'X', the same as squares[a]
        // squares[a] === squares[c] is true because squares[c] (i.e. squares[2] is 'X'), the same as squares [a]
        // since all three parts in the if are true the function returns the value of squares[a], which is 'X' and thus the player 'X'
    }