export class GameStateRequestedDto {
    player: number;
    board: number[][];
    ID: string;

    constructor(player: number, board: number[][]){
        this.player = player;
        this.board = board;
        this.ID = "";
    }

    public setID(ID: string) {
        this.ID = ID;
    }
}
