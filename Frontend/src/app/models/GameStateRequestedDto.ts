export class GameStateRequestedDto {
    player: number;
    board: number[][];

    constructor(player: number, board: number[][]){
        this.player = player;
        this.board = board;
    }
}
