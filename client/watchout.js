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
    x: 50,
    y: 50
  }];
};

var drag = d3.behavior.drag()
  .origin(function(d) { return d; })
  .on('dragstart', function(d) { return dragstarted.bind(this)(d); })
  .on('drag', function(d) { return dragged.bind(this)(d); })
  .on('dragend', function(d) { return dragended.bind(this)(d); });

var dragstarted = function(d) {
  d3.select(this).classed('dragging', true);
};

var dragged = function(d) {
  d3.select(this).attr('x', d.x = d3.event.x).attr('y', d.y = d3.event.y);
};

var dragended = function(d) {
  d3.select(this).classed('dragging', false);
};

var showBoard = function() {
  d3.select('.board').append('svg')
    .attr('width', gameOptions.boardWidth)
    .attr('height', gameOptions.boardHeight);
};

var showEnemies = function(enemiesData) {
  var asteroids = d3.select('svg').selectAll('image').filter('.enemy')
    .data(enemiesData, d => { 
      return d.id; 
    });

  asteroids
    .transition().duration(gameOptions.gameInterval - gameOptions.reactionTime)
    .attr('x', enemy => axes.x(enemy.x))
    .attr('y', enemy => axes.y(enemy.y));

  asteroids.enter()
    .append('svg')
    .append('image')
    .attr('class', 'enemy')
    .attr('id', enemy => enemy.id)
    .attr('x', enemy => axes.x(enemy.x))
    .attr('y', enemy => axes.y(enemy.y))
    .attr('xlink:href', 'asteroid.png')
    .attr('height', '100px')
    .attr('width', '100px');

  asteroids.exit().remove();
};

var showPlayer = function(playerData) {
  var player = d3.select('svg').selectAll('image').filter('.player')
    .data(playerData, d => {
      return d.id;
    });

  player.enter()
    .append('svg')
    .append('image')
    .attr('class', 'player')
    .attr('id', player => player.id)
    .attr('x', player => axes.x(player.x))
    .attr('y', player => axes.y(player.y))
    .attr('xlink:href', 'astroboy.png')
    .attr('height', '150px')
    .attr('width', '150px')
    .call(drag);

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