import { Injectable } from "@angular/core";
import {GameStateResponseDto} from "../models/GameStateResponseDto";
import {GameStateRequestedDto} from "../models/GameStateRequestedDto";
import {ConnectionDataRequestedDto} from "../models/ConnectionDataRequestedDto";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  // @ts-ignore
  webSocket: WebSocket;
  // @ts-ignore
  gameStateResponseDto: GameStateResponseDto;

  connectionDataRequestedDto: ConnectionDataRequestedDto;

  onResponse: (gameStateResponseDto: GameStateResponseDto) => void = () => {};
  onConnect: (player: number) => void = () => {};

  connectionID: string = "";

  connected: boolean = false;

  constructor() { 
    this.connectionDataRequestedDto = new ConnectionDataRequestedDto("", 0, "");
  }

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
        this.onResponse(this.gameStateResponseDto);
      }
      else {
        this.connectionDataRequestedDto = JSON.parse(event.data);
        console.log("Received connection data:");
        console.log(this.connectionDataRequestedDto);
        this.connectionID = this.connectionDataRequestedDto.ID;
        this.connected = true;
        this.onConnect(this.connectionDataRequestedDto.number);
      }
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessage(gameStateRequestedDto: GameStateRequestedDto){
    gameStateRequestedDto.setID(this.connectionID);
    console.log("Sending data:");
    console.log(gameStateRequestedDto);
    this.webSocket.send(JSON.stringify(gameStateRequestedDto));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }

  setOnResponseCommand(onResponse: (gameStateResponseDto: GameStateResponseDto) => void) {
    this.onResponse = onResponse;
  }

  setOnConnectCommand(onConnect: (player: number) => void) {
    this.onConnect = onConnect;
  }
}
