//This heap is designed to handle Coordinate.js instances.
//This is an extension to the abstract class Heap.js.
class MaxHeap extends Heap{
  child_parent_compare(child, parent){//Returns true if child is > parent. This is for min heap, the oppsosite in maxheap.
    return (this.box[child].score > this.box[parent].score);
  }
}
