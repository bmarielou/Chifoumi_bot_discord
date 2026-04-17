import { GameManager } from "../managers/GameManager";

declare module '@sapphire/pieces' {
  interface Container {
    GameManager: GameManager;
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    checkGameActive: never;
  }
}