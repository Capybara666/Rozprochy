import { Injectable } from "@angular/core";
import {GameStateResponseDto} from "../models/GameStateResponseDto";
import {GameStateRequestedDto} from "../models/GameStateRequestedDto";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  // @ts-ignore
  webSocket: WebSocket;
  // @ts-ignore
  gameStateResponseDto: GameStateResponseDto;

  onResponse: (gameStateResponseDto: GameStateResponseDto) => void = () => {};

  constructor() { }

  public openWebSocket(){
    this.webSocket = new WebSocket('ws://');

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      this.gameStateResponseDto = JSON.parse(event.data);
      this.onResponse(this.gameStateResponseDto);
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessage(gameStateRequestedDto: GameStateRequestedDto){
    this.webSocket.send(JSON.stringify(gameStateRequestedDto));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }

  setOnResponseCommand(onResponse: (gameStateResponseDto: GameStateResponseDto) => void) {
    this.onResponse = onResponse;
  }
}
