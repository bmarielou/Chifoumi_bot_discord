import { CardType } from "./Cards";

export class Player {

    id: string;
    coins: number = 2;
    cards: CardType[] = [];

    constructor(id: string) {
        this.id = id;
    }

    addCard(card: CardType) {
        this.cards.push(card);
    }
}