// start slingin' some d3 here.
var gameOptions = {
  boardWidth: 1900,
  boardHeight: 900,
  numberOfEnemies: 10
};

var infoboard = {
  score: 0,
  highscore: 0
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.boardWidth]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.boardHeight])
};

var makeEnemies = function(amount = gameOptions.numberOfEnemies) {
  return _.range(0, amount).map(index => {
    return {
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  });
};

var showBoard = function() {
  d3.select('.board').append('svg')
    .attr('width', '1900')
    .attr('height', '900');
};

var showEnemies = function(enemiesData) {
  var asteroids = d3.select('svg').selectAll('image')
  .data(enemiesData, d => { 
    return d.id; 
  });

  asteroids
    .transition().duration(2750)
    .attr('x', enemy => axes.x(enemy.x))
    .attr('y', enemy => axes.y(enemy.y));

  asteroids.enter()
    .append('svg')
    .attr('class', 'enemy')
    .append('image')
    .attr('id', enemy => enemy.id)
    .attr('x', enemy => axes.x(enemy.x))
    .attr('y', enemy => axes.y(enemy.y))
    .attr('xlink:href', 'asteroid.png')
    .attr('height', '100px')
    .attr('width', '100px');

  asteroids.exit().remove();
};

var play = function() {
  var gameTurn = function() {
    var newEnemyPositions = makeEnemies();
    // console.log(newEnemyPositions);
    showEnemies(newEnemyPositions);
  };

  // var increaseScore = function() {
  //   gameStats.score += 1;
  //   updateScore();
  // };

  // Take a turn every 2 seconds
  showBoard();
  gameTurn();
  setInterval(gameTurn, 3000);

  // Increment the score counter every 50ms
  // setInterval(increaseScore, 50);
};

// Play!
play();