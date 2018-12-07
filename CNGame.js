function CNGame(canvas) {

  //INTIALIZE SCREEN
  // Initialize canvas and append to screen
  canvas = canvas || document.createElement('canvas');
  canvas.height = 400;
  canvas.width = 400;
  canvas.style.border = "2px solid black";
  document.querySelector('#CNGame').append(canvas);

  // Initialize container to hold contols
  var controlsContainer = document.createElement('div');
  document.querySelector('#CNGame').append(controlsContainer);

  // Initialize slider and append to controlsContainer
  var speedometer = document.createElement('input');
  speedometer.type = "range";
  speedometer.min = "-1100";
  speedometer.max = "-100";
  speedometer.value = "-600";
  controlsContainer.append(speedometer);

  // Initialize reset button and append to controlsContainer
  var resetButton = document.createElement('button');
  resetButton.innerHTML = "Reset";
  controlsContainer.append(resetButton);

  // Initialize run button and append to controlsContainer
  var runButton = document.createElement('button');
  runButton.innerHTML = "Run";
  controlsContainer.append(runButton);

  //INTIALIZE STATE
  // Initialize global variables
  var self = this;
  var speed = 600;
  var evaluationChain = [];
  var functionCount = 0;
  var ctx = canvas.getContext('2d');
  var initialState = {
    character: {
      direction: "right",
      location: {
        yPos: 0,
        xPos: 0,
      }
    },
    balls: [
      {yPos: 2, xPos: 3},
      {yPos: 4, xPos: 6}
    ],
    board: {
      columns: 8,
      rows: 8,
    },
    walls: [
      {yPos: 2, xPos: 2, direction: "vertical"},
      {yPos: 1, xPos: 3, direction: "horizontal"},
      {yPos: 3, xPos: 6, direction: "horizontal"},
      {yPos: 4, xPos: 5, direction: "vertical"}
    ]
  };
  var solutionState = {
    character: {
      direction: "right",
      location: {
        yPos: 0,
        xPos: 0,
      }
    },
    balls: [

    ],
    board: {
      columns: 8,
      rows: 8,
    },
    walls: [
      {yPos: 2, xPos: 2, direction: "vertical"},
      {yPos: 1, xPos: 3, direction: "horizontal"},
      {yPos: 3, xPos: 6, direction: "horizontal"},
      {yPos: 4, xPos: 5, direction: "vertical"}
    ]
  };

  // Create game state from initial state
  var state = JSON.parse(JSON.stringify(initialState));

  // Draw the canvas
  draw();

  // CREATE FUNCTIONS TO LISTEN TO USER INTERACTIONS
  speedometer.oninput = function () {
    speed = Math.abs(speedometer.value);
  };

  resetButton.onclick = function () {
    reset();
  };

  runButton.onclick = function () {
    run();
  };

  // CREATE FUNCTIONS TO CONVERT INDEX TO PIXELS 
  function calculateY(index) {
    return (canvas.height / (state.board.rows * 2)) + canvas.height / state.board.rows * index;
  }

  function calculateX(index) {
    return (canvas.width / (state.board.columns * 2)) + canvas.width / state.board.columns * index;
  }

  // CREATE FUNCTIONS TO DRAW ON CANVAS
  // Create function to draw the board
  function drawBoard() {
    for (var i = 0; i < state.board.rows; i++) {
      for (var j = 0; j < state.board.columns; j++) {
        drawCircleAtPosition(j, i);
      }
    }
  }

  function drawCircleAtPosition(xPos, yPos) {
    ctx.beginPath();
    ctx.arc(calculateX(xPos), calculateY(yPos), 2, 0, 2 * Math.PI);
    ctx.strokeStyle = ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();
  }

  // Create function to draw the character
  function drawCharacter() {
    var centerXPixels = calculateX(state.character.location.xPos);
    var centerYPixels = calculateY(state.character.location.yPos);
    var headXPixels = centerXPixels;
    var headYPixels = centerYPixels;
    if (state.character.direction === "right") {
      headXPixels += 15;
    } else if (state.character.direction === "left") {
      headXPixels -= 15;
    } else if (state.character.direction === "up") {
      headYPixels -= 15;
    } else if (state.character.direction === "down") {
      headYPixels += 15;
    }
    ctx.beginPath();
    ctx.moveTo(centerXPixels, centerYPixels);
    ctx.lineTo(headXPixels, headYPixels);
    ctx.closePath();
    ctx.strokeStyle = ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
  }

  // Create function to draw single ball
  function drawBall(yPos, xPos) {
    ctx.beginPath();
    ctx.arc(calculateX(xPos), calculateY(yPos), 8, 0, 2 * Math.PI);
    ctx.strokeStyle = ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.stroke();
  }
  
  // Create function to draw all balls
  function drawBalls() {
    for (var i = 0; i < state.balls.length; i++) {
      drawBall(state.balls[i].yPos, state.balls[i].xPos);
    }
  }
  
  // Create function to draw single wall
  function drawWall(yPos, xPos, direction) {
    var startingXPos;
    var startingYPos;
    var endingXPos;
    var endingYPos;
    if (direction === "vertical") {
      startingXPos = calculateX(xPos + 0.5);
      startingYPos = calculateY(yPos - 0.5);
      endingXPos = calculateX(xPos + 0.5);
      endingYPos = calculateY(yPos + 0.5);
    } else if (direction === "horizontal") {
      startingXPos = calculateX(xPos - 0.5);
      startingYPos = calculateY(yPos + 0.5);
      endingXPos = calculateX(xPos + 0.5);
      endingYPos = calculateY(yPos + 0.5);
    }
    ctx.beginPath();
    ctx.moveTo(startingXPos, startingYPos);
    ctx.lineTo(endingXPos, endingYPos);
    ctx.closePath();
    ctx.strokeStyle = ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();
  }
  
  // Create function to draw all walls
  function drawWalls() {
    for (var i = 0; i < state.walls.length; i++) {
      drawWall(state.walls[i].yPos, state.walls[i].xPos, state.walls[i].direction);
    }
  }

  // Create function to draw board, balls, character and walls
  function draw() {
    ctx.clearRect(0, 0, 400, 400);
    drawBoard();
    drawBalls();
    drawCharacter();
    drawWalls();
  }

  // Create function to loop through the functions and call each with setTimeout
  function run() {
    for (var i = 0; i < evaluationChain.length; i++) {
      functionCount = i;
      var timeoutCode = setTimeout(evaluationChain[i].function, speed * functionCount);
      evaluationChain[i].timeout = timeoutCode;
      evaluationChain[i].executed = true;
    }
  }

  function reset() {
    for (var i = 0; i < evaluationChain.length; i++) {
      this.clearTimeout(evaluationChain[i].timeout);
      evaluationChain[i].timeout = null;
      evaluationChain[i].executed = false;
    }
    functionCount = 0;
    state = JSON.parse(JSON.stringify(initialState));
    draw();
  }

  function checkWin() {
    for (var i = 0; i < state.balls.length; i++) {
      var found = solutionState.balls.find(function (element) {
        return element.yPos === state.balls[i].yPos && element.xPos === state.balls[i].xPos;
      });
      if (!found) {
        return;
      }
    }
    alert("Winner");
  }

  function checkWall(yPos, xPos, direction) {
    var found = state.walls.find(function (element) {
      return element.xPos === xPos && element.yPos === yPos && element.direction === direction;
    });
    return found;
  }


  function moveFunction() {
    if (state.character.direction === "right") {
      var wallExists = checkWall(state.character.location.yPos, state.character.location.xPos, "vertical");
      if (!wallExists) {
        state.character.location.xPos += 1;
      }
    } else if (state.character.direction === "left") {
      var wallExists = checkWall(state.character.location.yPos, state.character.location.xPos - 1, "vertical");
      if (!wallExists) {
        state.character.location.xPos -= 1;
      }
    } else if (state.character.direction === "up") {
      var wallExists = checkWall(state.character.location.yPos - 1, state.character.location.xPos, "horizontal");
      if (!wallExists) {
        state.character.location.yPos -= 1;
      }
    } else if (state.character.direction === "down") {
      var wallExists = checkWall(state.character.location.yPos, state.character.location.xPos, "horizontal");
      if (!wallExists) {
        state.character.location.yPos += 1;
      }
    }
    checkWin();
    draw();
  }

  function turnRightFunction() {
    if (state.character.direction === "right") {
      state.character.direction = "down";
    } else if (state.character.direction === "left") {
      state.character.direction = "up";
    } else if (state.character.direction === "up") {
      state.character.direction = "right";
    } else if (state.character.direction === "down") {
      state.character.direction = "left";
    }
    checkWin();
    draw();
  }

  function turnLeftFunction () {
    if (state.character.direction === "right") {
      state.character.direction = "up";
    } else if (state.character.direction === "left") {
      state.character.direction = "down";
    } else if (state.character.direction === "up") {
      state.character.direction = "left";
    } else if (state.character.direction === "down") {
      state.character.direction = "right";
    }
    checkWin();
    draw();
  }
  
  function putBall() {
    state.balls.push({
      yPos: state.character.location.yPos,
      xPos: state.character.location.xPos
    });
    checkWin();
    draw();
  }
  
  function takeBallFunction() {
    for (var i = 0; i < state.balls.length; i++) {
      if (state.character.location.yPos === state.balls[i].yPos && state.character.location.xPos === state.balls[i].xPos) {
        state.balls.splice(i, 1);
        checkWin();
        draw();
        return;
      } else {
        alert("No ball to pick up");
      }
    }
  }
  
  // CREATE FUCNTIONS ACCESSABLE TO WINDOW AND ADD TO EVALUATION CHAIN
  self.move = function () {
    evaluationChain.push({
      function: moveFunction,
      timeout: null,
      executed: false,
    });
  };

  self.turnRight = function () {
    evaluationChain.push({
      function: turnRightFunction,
      timeout: null,
      executed: false
    });
  };

  self.turnLeft = function () {
    evaluationChain.push({
      function: turnLeftFunction,
      timeout: null,
      executed: false
    });
  };

  self.putBall = function () {
    evaluationChain.push({
      function: putBallFunction,
      timeout: null,
      executed: false
    });
  };

  self.takeBall = function () {
    evaluationChain.push({
      function: takeBallFunction,
      timeout: null,
      executed: false
    });
  };

  return self;
}
