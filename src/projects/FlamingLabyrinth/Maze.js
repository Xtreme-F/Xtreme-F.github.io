function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Maze{
  constructor(dim, density, flama, delay, agent, canvas, ctx){
    //Fields
    this.canvas = canvas;
    this.ctx = ctx;

    this.agent = agent;
    this.agentCoord = null;
    this.goalCoord = null;

    this.dim = dim;
    this.density = density;
    this.flama = flama;
    this.delay = delay;
    this.map = [];

    this.fireList = [];
  }

  scoresToString(){
    var result = "[";
    var somescore = -1;
    for(var j = 0; j < this.dim; j++){
      for(var i = 0; i < this.dim; i++){
        //result += this.map[j][i].score;
        somescore = (this.map[j][i].score).toFixed(4);
        if(somescore < 0)
          result += somescore;
        else
          result += " " + somescore;

        if (j != this.dim-1 || i != this.dim-1) {
            result += ", ";
        }
        if(i == this.dim-1 && j != this.dim-1){
          result += "\n ";
        }
      }
    }
    result += "]";
    return result;
  }
  risksToString(){
    var result = "[";
    var somescore = -1;
    for(var j = 0; j < this.dim; j++){
      for(var i = 0; i < this.dim; i++){
        //result += this.map[j][i].score;
        somescore = (this.map[j][i].risk).toFixed(4);
        if(somescore < 0)
          result += somescore;
        else
          result += " " + somescore;

        if (j != this.dim-1 || i != this.dim-1) {
            result += ", ";
        }
        if(i == this.dim-1 && j != this.dim-1){
          result += "\n ";
        }
      }
    }
    result += "]";
    return result;
  }

  //Map population
  /*
  for(var i = 0; j < dim; j++){
    this.map[i] = [];
    for (var j = 0; i < dim; i++) {
      this.map[i][j] = new Coordinate(i, j);
      alert("map population");
    }
  }*/

  //Methods:
  occupy(prob){
    if(prob > 100 || prob < 0){
      alert("Please input a valid probability number");
      return;
    }
    //alert("PROBABILITY is " + prob);

    for (var j = 0; j < this.dim; j++) {
      this.map[j] = [];
      for (var i = 0; i < this.dim; i++) {
        this.map[j][i] = new Coordinate(i, j);
        //If upper left corner or lower right corner, skip.
        if ((i==0 && j==0) || (i==this.dim-1 && j==this.dim-1)){
          if (i==0 && j==0){
            this.map[j][i].isAgent = true;
            this.agentCoord = this.map[j][i];
          }
          else
            this.map[j][i].isGoal = true;
          continue;
        }

        var ran = Math.floor(Math.random() * 101);
        //Probabilistic wall population.
        if (ran <= prob)
          this.map[j][i].isWall = true;

      }
    }

  }//Occupy Ends.

  resetPaths(){
    var temp = null;
    for(var j = 0; j < this.dim; j++){
      for(var i = 0; i < this.dim; i++){
        this.map[j][i].parent = null;
        this.map[j][i].pathDistance = -1;
        this.map[j][i].visited = false;
      }
    }

  }

  resetPathsAndScore(){
    var temp = null;
    for(var j = 0; j < this.dim; j++){
      for(var i = 0; i < this.dim; i++){
        this.map[j][i].parent = null;
        this.map[j][i].score = -1;
        this.map[j][i].pathDistance = -1;
      }
    }

  }

  resetVisited(){
    for(var j = 0; j < this.dim; j++){
      for(var i = 0; i < this.dim; i++){
        this.map[j][i].visited = false;
      }
    }
  }
  resetAll(){
    for(var j = 0; j < this.dim; j++){
      for(var i = 0; i < this.dim; i++){
        this.map[j][i].visited = false;
        this.map[j][i].parent = null;
        this.map[j][i].pathDistance = -1;
        this.map[j][i].score = -1;
        this.map[j][i].risk = 0;
      }
    }
  }

  drawSquare(maze, i, j){
    //setTimeout(function(){
      //Color selection.
      if(maze.map[j][i].isWall){
        maze.ctx.fillStyle = "black";
      }
      else if (maze.map[j][i].isFire){
        maze.ctx.fillStyle = "orange";
      }
      else if (maze.agentCoord.x == i && maze.agentCoord.y == j){
        maze.ctx.fillStyle = "blue";
      }
      else if (maze.map[j][i].isGoal){
        maze.ctx.fillStyle = "lightgreen";
      }
      else{
        maze.ctx.fillStyle = "white";
      }

      maze.ctx.fillRect(41 * (i) + 5, 41 * (j) + 5, 40, 40);
    //}, this.delay * (j * this.dim + i));
    //await sleep(this.delay);
  }

  drawMaze(){
    //setTimeout(function(){

    for (var j = 0; j < this.dim; j++) {
      for (var i = 0; i < this.dim; i++) {

        //setTimeout(this.drawSquare(i, j), 5000 * (j*this.dim + i));

        this.drawSquare(this, i, j);

        //setTimeout( function(){
        //Color selection.
        /*
        if(this.map[i][j].isWall)
          this.ctx.fillStyle = "black";
        else if (this.map[i][j].isFire)
          this.ctx.fillStyle = "orange";
        else
          this.ctx.fillStyle = "white";

        ctx.fillRect(41 * (i) + 5, 41 * (j) + 5, 40, 40);
        //setTimeout(() => {ctx.fillRect(41 * (i) + 5, 41 * (j) + 5, 40, 40)}, 2000 * (j*this.dim + i));
        //}, 2000 * (j * this.dim + i));
        */
      }
    }

    //}, this.delay);

  }//DrawMaze Ends.

  startFire(){
    var result = false;
    while(!result){
      var ran = Math.floor(Math.random() * 101);
      ran = ran/100 * this.dim * this.dim;

      var x = Math.floor(ran) % this.dim;
      var y = Math.floor(ran / this.dim);

      if((x==0 && y==0) || (x==this.dim-1 && y==this.dim-1) || (this.map[y][x].isWall))
        continue;
      else{
        result = true;
        this.map[y][x].isFire = true;
        alert("fire at: " + this.map[y][x].toString());
      }
    }
  }

  expandFire(){
    var copy = this.makeCopyFire();

    for(var y = 0; y < this.dim; y++){
      for (var x = 0; x < this.dim; x++) {
        if(this.map[x][y].isWall)
          continue;

        var ran = Math.floor(Math.random() * 101);

        var positive_neighs = 0;
        if(x-1 >= 0 && copy.map[x-1][y].isFire)
          positive_neighs++;
        if(x+1 < this.dim && copy.map[x+1][y].isFire)
          positive_neighs++;
        if(y-1 >= 0 && copy.map[x][y-1].isFire)
          positive_neighs++;
        if(y+1 < this.dim && copy.map[x][y+1].isFire)
          positive_neighs++;

        var prob = 1 - Math.pow((1 - this.flama), positive_neighs);
        //alert("ran: " + ran);
        //positive_neighs * this.flama
        if(ran < prob){
          this.map[x][y].isFire = true;

          if(this.agentCoord.x == x && this.agentCoord.y == y){//NOt needed.
            this.agent.state = 2;
            //alert("agentcoord   x: " + this.agentCoord.x + "   y: " + this.agentCoord.y);
          }
        }

      }
    }

  }

  makeCopyFire(){
    var copy = new Maze(this.dim, this.density, this.flama, this.delay, this.agent, this.canvas, this.ctx);
    for(var y = 0; y < this.dim; y++){
      copy.map[y] = [];
      for (var x = 0; x < this.dim; x++) {
        copy.map[y][x] = new Coordinate(x, y);
        if(this.map[y][x].isFire){
          //alert("Is Fire! " + this.map[y][x].toString());
          //alert("copy Fire! " + copy.map[y][x].toString());
          copy.map[y][x].isFire = this.map[y][x].isFire;
        }
      }
    }
    return copy;
  }

}
