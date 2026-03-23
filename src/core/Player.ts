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

    loseInfluence() {

        if (this.cards.length === 0) {
            throw new Error("Ce joueur n'a plus d'influence.");
        }

        return this.cards.pop();
    }

    isAlive(): boolean {
        return this.cards.length > 0;
    }
}