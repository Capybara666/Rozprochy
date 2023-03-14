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

  board = [[0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0]]

  columnClicked(j: number) {
    this.updateBoardState(j);
    this.togglePlayer();
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

}
