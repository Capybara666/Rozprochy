import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "./services/websocket.service";
import {GameStateResponseDto} from "./models/GameStateResponseDto";
import {GameStateRequestedDto} from "./models/GameStateRequestedDto";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Frontend';
  player = 0;

  currentPlayer = 1;

  gameEnded = false;
  winner = 0;

  mouseColumnPosition = -1;

  inQueue = true;


  board = [[0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0]]

  constructor(public websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.websocketService.setOnResponseCommand(this.onResponse);
    this.websocketService.setOnConnectCommand(this.onConnect);
    this.websocketService.openWebSocket();
  }

  ngOnDestroy(): void {
    this.websocketService.closeWebSocket();
  }

  onResponse(gameStateResponseDto: GameStateResponseDto) {
    this.board = gameStateResponseDto.board;
    this.gameEnded = gameStateResponseDto.gameEnded;
    this.winner = gameStateResponseDto.winner;
    this.inQueue = false;
    //this.togglePlayer();
  }

  onConnect(player: number) {
    this.player = player;
  }

  sendMessage(gameStateRequestedDto: GameStateRequestedDto): void {
    this.websocketService.sendMessage(gameStateRequestedDto);
  }

  columnClicked(j: number) {
    if(!this.isColumnFull(j) && this.currentPlayer == this.player) {
        this.updateBoardState(j);
        this.togglePlayer();
        this.sendMessage(new GameStateRequestedDto(this.player, this.board));
    }
  }

  private updateBoardState(column: number) {
    let clickedColumn = [];

    for(let i=0;i<this.board.length; i++) {
      clickedColumn.push(this.board[i][column]);
    }

    for (let i = clickedColumn.length-1; i >=0 ; i--) {
      if(clickedColumn[i] == 0) {
        clickedColumn[i] = this.player;
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
