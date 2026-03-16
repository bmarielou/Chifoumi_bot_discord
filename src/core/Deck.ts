import { CardType } from "./Cards";

export class Deck {

    cards: CardType[] = [];

    constructor() {
        this.initialize();
        this.shuffle();
    }

    private initialize() {
        const types = Object.values(CardType);

        // 3 cards for type
        for (const type of types) {
            for (let i = 0; i < 3; i++) {
                this.cards.push(type);
            }
        }
    }
    //blend cards
    private shuffle() {
        this.cards.sort(() => Math.random() - 0.5);
    }

    returnCard(card: CardType) {
        this.cards.push(card);
        // option
        this.shuffle();
    }

    draw(): CardType | undefined {
        return this.cards.pop();
    }
}