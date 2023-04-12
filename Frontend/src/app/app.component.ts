import {Component, OnDestroy, OnInit, NgZone} from '@angular/core';
import {WebsocketService} from "./services/websocket.service";
import {GameStateResponseDto} from "./models/GameStateResponseDto";
import {GameStateRequestedDto} from "./models/GameStateRequestedDto";
import {ConnectionDataRequestedDto} from "./models/ConnectionDataRequestedDto";


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

  constructor() {    
    this.connectionDataRequestedDto = new ConnectionDataRequestedDto("", 0, "");
    this.board = [[0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0]]
  
  }

  ngOnInit(): void {
    this.openWebSocket();
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  sendMessage(gameStateRequestedDto: GameStateRequestedDto): void {
    this.sendMessageToServer(gameStateRequestedDto);
  }

  columnClicked(j: number) {
    if(!this.isColumnFull(j) && this.currentPlayer == this.player && !this.gameEnded) {
        this.updateBoardState(j);
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

  // @ts-ignore
  webSocket: WebSocket;
  // @ts-ignore
  gameStateResponseDto: GameStateResponseDto;

  connectionDataRequestedDto: ConnectionDataRequestedDto;

  connectionID: string = "";

  connected: boolean = false;

  public openWebSocket(){
    this.webSocket = new WebSocket('ws://127.0.0.1:8000/ws/realBackend/game/');

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      if(this.connected) {
        this.gameStateResponseDto = JSON.parse(event.data);
        console.log("Received game data:");
        console.log(this.gameStateResponseDto);
        this.board = this.gameStateResponseDto.board;
        this.gameEnded = this.gameStateResponseDto.gameEnded;
        this.winner = this.gameStateResponseDto.winner;
        this.inQueue = false;
        console.log(this.gameEnded)
        this.togglePlayer();      
      }
      else {
        this.connectionDataRequestedDto = JSON.parse(event.data);
        console.log("Received connection data:");
        console.log(this.connectionDataRequestedDto);
        this.connectionID = this.connectionDataRequestedDto.ID;
        this.connected = true;
        this.player = this.connectionDataRequestedDto.number;
      }
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessageToServer(gameStateRequestedDto: GameStateRequestedDto){
    gameStateRequestedDto.setID(this.connectionID);
    console.log("Sending data:");
    console.log(gameStateRequestedDto);
    this.webSocket.send(JSON.stringify(gameStateRequestedDto));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }

}
