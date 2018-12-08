var game1 = {
  name: "Game 1",
  initialState :{
    character: {
      direction: "right",
      location: { yPos: 0, xPos: 0}
    },
    balls: [
      {yPos: 2, xPos: 3},
      {yPos: 4, xPos: 6}
    ],
    board: {columns: 8, rows: 8},
    walls: [
      {yPos: 2, xPos: 2, direction: "vertical"},
      {yPos: 1, xPos: 3, direction: "horizontal"},
      {yPos: 3, xPos: 6, direction: "horizontal"},
      {yPos: 4, xPos: 5, direction: "vertical"}
    ]
  },
  solutionState: {
    character: {
      direction: "right",
      location: {yPos: 0, xPos: 0,}
    },
    balls: [],
    board: {columns: 8,rows: 8},
    walls: [
      {yPos: 2, xPos: 2, direction: "vertical"},
      {yPos: 1, xPos: 3, direction: "horizontal"},
      {yPos: 3, xPos: 6, direction: "horizontal"},
      {yPos: 4, xPos: 5, direction: "vertical"}
    ]
  }
}

var games = [
  game1,
  game1, 
]
