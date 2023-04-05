export class ConnectionDataRequestedDto {
    type: string;
    number: number;
    ID: string;

    constructor(type: string, number: number, ID: string){
        this.type = type;
        this.number = number;
        this.ID = ID;
    }
}