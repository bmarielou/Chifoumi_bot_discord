import { container } from "@sapphire/framework";
import { GameManager } from "./managers/GameManager";

const gameManager = new GameManager();

container.GameManager = gameManager;
