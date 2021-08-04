//This heap is designed to handle Coordinate.js instances.
//This is an abstract class. Subclasses are MinHeap and MaxHeap.
class Heap{
  constructor(){
    if(this.constructor === Heap){
      throw new Error("Can't instantiate abstract class!");
    }
    this.box = [];
  }

  push(item){
    this.box.push(item)
    this.bubbleUp()
  }

  pop(item){
    if(this.box.length==1){
      return this.box.pop();
    }
    let  max = this.box[0];
    this.box[0] = this.box.pop();
    this.sinkDown();
    return max;
  }

  isEmpty(){
    return (this.box.length == 0);
  }

  //Not to call outside class.
  bubbleUp(){
    let index =  this.box.length-1;

    while(index > 0){
      let element = this.box[index],
        parentIndex = Math.floor((index-1)/2),
        parent = this.box[parentIndex];

      //parent.score >= element.score
      if(!this.child_parent_compare(index, parentIndex)) break;

      this.box[index] = parent;
      this.box[parentIndex] = element;
      index = parentIndex

    }
  }

  sinkDown(){
    let index = 0;

    //Children and temp Indexes:
    var  left = 2*index+1,
           right = 2*index+2,
           mostprior = index;
    const length = this.box.length;

    while(true){
      //alert("true");
      left = 2*index+1;
      right = 2*index+2;
      mostprior = index;

      // if left child is greater than parent
      if(left < length &&  this.child_parent_compare(left, mostprior)){
         mostprior = left;
      }
      // if right child is greater than parent
      if(right < length && this.child_parent_compare(right, mostprior)) {
        mostprior = right;
      }
      //alert("after ifs");

      if(mostprior === index){
        //alert("end of all while loop");
        break;   }

      // swap
      [this.box[mostprior],this.box[index]] =
      [this.box[index],this.box[mostprior]];
      index = mostprior;
      //alert("end of while loop iteration");
    }

  }

  child_parent_compare(child, parent){//to implement in subclasses, can also be sibling instead of parent.
  }

  toString(){
    var result = "[";
    for(var i = 0; i < this.box.length; i++){
      result += this.box[i].score;
      if (i != this.box.length-1) {
          result += ", ";
      }
    }
    result += "]";
    return result;
  }

}
