class Coordinate{
  constructor(i, j){
    this.x=i;
    this.y=j;
    this.isWall = false;
    this.isFire = false;
    this.isAgent = false;
    this.isGoal = false;

    this.parent = null;
    this.pathDistance = -1;

    this.score = -1;//-1 means score uninitialized.

    this.visited = false;
    this.risk = 0;
  }

  toString(){
    return "(" + this.x + ", " + this.y + ")";
  }

}
