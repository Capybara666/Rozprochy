import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';
  currentPlayer = 1;

  isGameEnded = false;
  winner = 0;

  mouseColumnPosition = -1;

  board = [[0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0]]

  columnClicked(j: number) {
    if(!this.isColumnFull(j)) {
        this.updateBoardState(j);
        this.togglePlayer();
    }
  }

  private updateBoardState(column: number) {
    let clickedColumn = [];

    for(let i=0;i<this.board.length; i++) {
      clickedColumn.push(this.board[i][column]);
    }

    for (let i = clickedColumn.length-1; i >=0 ; i--) {
      if(clickedColumn[i] == 0) {
        clickedColumn[i] = this.currentPlayer;
        break;
      }
    }
    for(let i=0;i<clickedColumn.length; i++) {
      this.board[i][column] = clickedColumn[i];
    }
  }
  private togglePlayer() {
    if(this.currentPlayer == 1) {
      this.currentPlayer = 2;
    }
    else {
      this.currentPlayer = 1;
    }
  }

  onMouseOnColumn(j: number) {
     this.mouseColumnPosition = j;
  }

  OnMouseLeaveColumn() {
    this.mouseColumnPosition = -1;
  }

  private isColumnFull(column: number) {
    for(let i = 0; i < this.board[0].length ; i++) {
      if(this.board[i][column] == 0)
        return false
    }
    return true;
  }

}
