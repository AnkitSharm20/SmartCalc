/*
    ============================================================
    SMARTCALC - CALCULATOR ENGINE
    ============================================================

    This file controls the basic calculator functionality.

    Features currently implemented:

    - Number input
    - Decimal numbers
    - Addition
    - Subtraction
    - Multiplication
    - Division
    - Percentage
    - Clear
    - Backspace
    - Equals
    - Keyboard support
    - Basic error handling

    IMPORTANT:
    We are NOT using eval().

    Instead, we process the expression ourselves.
*/


// ============================================================
// DOM ELEMENTS
// ============================================================

/*
    Get the calculator display elements from HTML.
*/

const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");


// ============================================================
// CALCULATOR STATE
// ============================================================

/*
    currentInput:
    Stores the number currently being entered.

    Example:

    User presses 1 → 12 → 125

    currentInput becomes "125".
*/

let currentInput = "";



/*
    previousInput:
    Stores the previous number.

    Example:

    User enters:

    125 + 50

    previousInput = "125"
    currentInput = "50"
*/

let previousInput = "";



/*
    currentOperator:
    Stores the mathematical operator.

    Example:

    "+"
    "-"
    "*"
    "/"
*/

let currentOperator = "";



/*
    shouldResetDisplay:
    Determines whether the next number should start
    a new input.

    This becomes true after pressing "=".
*/

let shouldResetDisplay = false;


// ============================================================
// DISPLAY FUNCTIONS
// ============================================================

/*
    updateDisplay()

    Updates the calculator screen whenever the calculator
    state changes.
*/

function updateDisplay() {

    /*
        If the user hasn't entered anything yet,
        display 0.
    */

    if (currentInput === "") {
        resultDisplay.textContent = "0";
    } else {
        resultDisplay.textContent = currentInput;
    }


    /*
        Build a readable expression for the upper display.
    */

    let expression = previousInput;

    if (currentOperator !== "") {
        expression += ` ${getDisplayOperator(currentOperator)} `;
    }

    expression += currentInput;

    expressionDisplay.textContent =
        expression || "0";
}



// ============================================================
// OPERATOR DISPLAY
// ============================================================

/*
    getDisplayOperator()

    JavaScript uses:

    * for multiplication
    / for division

    But we want the user to see:

    × and ÷
*/

function getDisplayOperator(operator) {

    if (operator === "*") {
        return "×";
    }

    if (operator === "/") {
        return "÷";
    }

    if (operator === "-") {
        return "−";
    }

    return operator;
}


// ============================================================
// NUMBER INPUT
// ============================================================

/*
    inputNumber()

    Adds a number to the current input.
*/

function inputNumber(number) {

    /*
        If the previous operation was completed,
        start a new calculation.
    */

    if (shouldResetDisplay) {

        currentInput = "";

        previousInput = "";

        currentOperator = "";

        shouldResetDisplay = false;
    }


    /*
        Prevent unnecessary leading zeros.

        Example:

        0005

        becomes:

        5
    */

    if (currentInput === "0") {
        currentInput = number;
    } else {
        currentInput += number;
    }


    updateDisplay();
}


// ============================================================
// DECIMAL INPUT
// ============================================================

/*
    addDecimal()

    Adds a decimal point to the current number.

    Example:

    12 → 12.
*/

function addDecimal() {

    /*
        If the calculator is starting a new calculation,
        start with 0.
    */

    if (shouldResetDisplay) {

        currentInput = "0";

        previousInput = "";

        currentOperator = "";

        shouldResetDisplay = false;
    }


    /*
        Don't allow multiple decimal points.

        Invalid:

        12.5.8
    */

    if (currentInput.includes(".")) {
        return;
    }


    /*
        If there is no number yet,
        start with 0.
    */

    if (currentInput === "") {
        currentInput = "0";
    }


    currentInput += ".";

    updateDisplay();
}


// ============================================================
// OPERATOR INPUT
// ============================================================

/*
    chooseOperator()

    Called when the user presses:

    +
    -
    ×
    ÷
*/

function chooseOperator(operator) {

    /*
        Don't allow an operator without a number.
    */

    if (currentInput === "") {
        return;
    }


    /*
        If there is already a previous number,
        calculate it first.

        Example:

        10 + 5 + 2

        When the second + is pressed:

        10 + 5 = 15

        Then:

        15 + 2
    */

    if (
        previousInput !== "" &&
        currentOperator !== "" &&
        !shouldResetDisplay
    ) {

        calculate();
    }


    previousInput = currentInput;

    currentInput = "";

    currentOperator = operator;

    shouldResetDisplay = false;

    updateDisplay();
}


// ============================================================
// CALCULATION
// ============================================================

/*
    calculate()

    Performs the mathematical operation.
*/

function calculate() {

    /*
        Make sure we have all required values.
    */

    if (
        previousInput === "" ||
        currentInput === "" ||
        currentOperator === ""
    ) {
        return;
    }


    const firstNumber = Number(previousInput);
    const secondNumber = Number(currentInput);

    let result;


    /*
        Perform calculation according to the operator.
    */

    switch (currentOperator) {

        case "+":

            result = firstNumber + secondNumber;

            break;


        case "-":

            result = firstNumber - secondNumber;

            break;


        case "*":

            result = firstNumber * secondNumber;

            break;


        case "/":

            /*
                Division by zero is not allowed.
            */

            if (secondNumber === 0) {

                showError("Cannot divide by zero.");

                return;
            }

            result = firstNumber / secondNumber;

            break;


        default:

            return;
    }


    /*
        Remove unnecessary floating-point errors.

        Example:

        0.1 + 0.2

        JavaScript can sometimes produce:

        0.30000000000000004

        This formatting keeps the result readable.
    */

    result = formatResult(result);


    /*
        Show the result.
    */

    currentInput = result.toString();

    previousInput = "";

    currentOperator = "";

    shouldResetDisplay = true;

    updateDisplay();
}


// ============================================================
// RESULT FORMATTING
// ============================================================

/*
    formatResult()

    Makes large or floating-point results easier to read.
*/

function formatResult(number) {

    /*
        Round to 12 decimal places.

        This prevents extremely long floating-point results.
    */

    const rounded =
        Number.parseFloat(number.toFixed(12));


    return rounded;
}


// ============================================================
// CLEAR
// ============================================================

/*
    clearCalculator()

    Resets the entire calculator.
*/

function clearCalculator() {

    currentInput = "";

    previousInput = "";

    currentOperator = "";

    shouldResetDisplay = false;

    updateDisplay();
}


// ============================================================
// BACKSPACE
// ============================================================

/*
    deleteLastCharacter()

    Removes the last character from the current number.

    Example:

    123 → 12
*/

function deleteLastCharacter() {

    /*
        Don't modify the display after calculation
        until a new number is entered.
    */

    if (shouldResetDisplay) {
        return;
    }


    currentInput =
        currentInput.slice(0, -1);


    updateDisplay();
}


// ============================================================
// PERCENTAGE
// ============================================================

/*
    convertToPercentage()

    Converts the current number to a percentage.

    Example:

    25 → 0.25
*/

function convertToPercentage() {

    if (currentInput === "") {
        return;
    }


    const number =
        Number(currentInput);


    currentInput =
        formatResult(number / 100).toString();


    updateDisplay();
}


// ============================================================
// ERROR HANDLING
// ============================================================

/*
    showError()

    Displays an error message to the user.
*/

function showError(message) {

    resultDisplay.textContent = "Error";

    expressionDisplay.textContent = message;


    /*
        Reset calculator state.
    */

    currentInput = "";

    previousInput = "";

    currentOperator = "";

    shouldResetDisplay = true;
}


// ============================================================
// BUTTON EVENT HANDLING
// ============================================================

/*
    Instead of adding a separate click listener to every button,
    we use ONE event listener on the button container.

    This technique is called EVENT DELEGATION.

    It makes the code easier to maintain.
*/

const buttonsContainer =
    document.querySelector(".buttons");


buttonsContainer.addEventListener("click", function (event) {

    /*
        Find the button that was clicked.
    */

    const button =
        event.target.closest("button");


    /*
        If something other than a button was clicked,
        stop here.
    */

    if (!button) {
        return;
    }


    /*
        Check if the button contains a number.
    */

    const number =
        button.dataset.number;


    if (number !== undefined) {

        inputNumber(number);

        return;
    }


    /*
        Check if the button contains an operator.
    */

    const operator =
        button.dataset.operator;


    if (operator !== undefined) {

        chooseOperator(operator);

        return;
    }


    /*
        Check special calculator actions.
    */

    const action =
        button.dataset.action;


    switch (action) {

        case "clear":

            clearCalculator();

            break;


        case "backspace":

            deleteLastCharacter();

            break;


        case "percent":

            convertToPercentage();

            break;


        case "decimal":

            addDecimal();

            break;


        case "equals":

            calculate();

            break;


        case "voice":

            /*
                Voice functionality will be implemented
                in a later project stage.
            */

            console.log(
                "Voice feature coming soon."
            );

            break;
    }

});


// ============================================================
// KEYBOARD SUPPORT
// ============================================================

/*
    Allows the user to operate SmartCalc using the keyboard.

    Supported:

    0-9
    .
    +
    -
    *
    /
    Enter
    =
    Backspace
    Escape
    %
*/

document.addEventListener("keydown", function (event) {

    const key = event.key;


    /*
        Number keys
    */

    if (/^[0-9]$/.test(key)) {

        inputNumber(key);

        return;
    }


    /*
        Decimal
    */

    if (key === ".") {

        addDecimal();

        return;
    }


    /*
        Operators
    */

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        chooseOperator(key);

        return;
    }


    /*
        Equals
    */

    if (
        key === "Enter" ||
        key === "="
    ) {

        event.preventDefault();

        calculate();

        return;
    }


    /*
        Backspace
    */

    if (key === "Backspace") {

        deleteLastCharacter();

        return;
    }


    /*
        Escape = Clear
    */

    if (key === "Escape") {

        clearCalculator();

        return;
    }


    /*
        Percentage
    */

    if (key === "%") {

        convertToPercentage();

        return;
    }

});


// ============================================================
// APPLICATION STARTUP
// ============================================================

/*
    Initialize the display when SmartCalc starts.
*/

updateDisplay();


/*
    Developer message in the browser console.
*/

console.log(
    "SmartCalc calculator engine loaded successfully."
);