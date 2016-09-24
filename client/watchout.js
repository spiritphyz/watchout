// start slingin' some d3 here.
var gameOptions = {
  boardWidth: 1900,
  boardHeight: 900,
  gameInterval: 3000,
  reactionTime: 250,
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

var makePlayer = function() {
  return [{
    id: 0,
    x: 10,
    y: 50
  }];
};

var showBoard = function() {
  d3.select('.board').append('svg')
    .attr('width', gameOptions.boardWidth)
    .attr('height', gameOptions.boardHeight);
};

var showEnemies = function(enemiesData) {
  var asteroids = d3.select('svg').selectAll('image')
    .data(enemiesData, d => { 
      return d.id; 
    });

  asteroids
    .transition().duration(gameOptions.gameInterval - gameOptions.reactionTime)
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

var showPlayer = function(playerData) {
  var player = d3.select('svg').selectAll('image')
    .data(playerData, d => {
      return d.id;
    });

  // player
  //   .transition().duration(gameOptions.gameInterval - gameOptions.reactionTime)
  //   .attr('x', enemy => axes.x(enemy.x))
  //   .attr('y', enemy => axes.y(enemy.y));

  player.enter()
    .append('svg')
    .attr('class', 'player')
    .append('image')
    .attr('id', player => player.id)
    .attr('x', player => axes.x(player.x))
    .attr('y', player => axes.y(player.y))
    .attr('xlink:href', 'astroboy.png')
    .attr('height', '150px')
    .attr('width', '150px');

  player.exit().remove();    
};

var play = function() {
  var gameTurn = function() {
    var newEnemyPositions = makeEnemies();
    showEnemies(newEnemyPositions);
  };

  // var increaseScore = function() {
  //   gameStats.score += 1;
  //   updateScore();
  // };

  // Take a turn every 2 seconds
  showBoard();
  var newPlayerPosition = makePlayer();
  showPlayer(newPlayerPosition);
  gameTurn();
  setInterval(gameTurn, gameOptions.gameInterval);

  // Increment the score counter every 50ms
  // setInterval(increaseScore, 50);
};

// Play!
play();