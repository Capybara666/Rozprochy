export class GameStateResponseDto {
    player: number;
    gameEnded: boolean;
    winner: number;
    board: number[][];

    constructor(player: number, gameEnded: boolean, winner: number, board: number[][]){
        this.player = player;
        this.gameEnded = gameEnded;
        this.winner = winner;
        this.board = board;
    }
}
