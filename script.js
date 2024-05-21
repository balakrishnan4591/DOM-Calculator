const input = document.getElementById("result");

// function sampletest() {
//   //alert("sample test called: " + document.getElementById(""));
// }

function updateDisplay(val) {
  input.value += val;
}

function clearDisplay() {
  input.value = "";
}

function calculate() {
  try {
    input.value = parse(input.value);
  } catch (e) {
    input.value = "Error";
  }
}

function handleSpinnerInput(event) {
  if (!(Number(event.key) >= 0 && Number(event.key) <= 9)) {
    // Checks whether the key is different from the number
    event.preventDefault();
    alert("Only numbers are allowed");
  }
}

function delLastChar() {
  let str = input.value;
  str = str.slice(0, -1);

  input.value = str;
}

// infix expression start

const DIGITS = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 };

const OPERATORS = {
  "-": { op: (a, b) => a - b, precedence: 1, type: "binary", op2: (a) => -a },
  "+": { op: (a, b) => a + b, precedence: 2, type: "binary", op2: (a) => a },
  "/": { op: (a, b) => a / b, precedence: 3, type: "binary" },
  "*": { op: (a, b) => a * b, precedence: 4, type: "binary" },
  "%": { op: (a, b) => a % b, precedence: 5, type: "binary" },
};

function parse(string) {
  const hold = [];
  const output = [];
  const solve = [];

  let prevChar;
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (char == " ") continue;
    else if (char in DIGITS) {
      let num = `${DIGITS[char]}`;
      let float = false;
      while (string[i + 1] in DIGITS || string[i + 1] == ".") {
        if (string[i + 1] == ".") {
          if (float) throw `Two or more decimal points at position ${i + 1}`;
          num += ".";
          float = true;
          i += 1;
        } else {
          num += DIGITS[string[++i]];
        }
      }
      output.push(parseFloat(num));
    } else if (OPERATORS[char]) {
      let op = { ...OPERATORS[char] };
      if (
        ["-", "+"].includes(char) &&
        prevChar != ")" &&
        !(prevChar in DIGITS)
      ) {
        op.type = "unary";
        op.precedence = 10;
      }
      if (hold.length == 0) {
        hold.push(op);
      } else {
        while (
          hold.length &&
          hold[hold.length - 1].precedence > op.precedence
        ) {
          output.push(hold.pop());
        }
        hold.push(op);
      }
    } else {
      throw `Invalid character ${char} at position ${i}`;
    }
    prevChar = char;
  }

  while (hold.length) output.push(hold.pop());

  for (const item of output) {
    if (typeof item == "number") {
      solve.push(item);
    } else if (item.type == "binary") {
      const b = solve.pop();
      const a = solve.pop();
      solve.push(item.op(a, b));
    } else if (item.type == "unary") {
      const a = solve.pop();
      solve.push(item.op2(a));
    }
  }

  return solve.pop();
}
