import { RndSelectionFromArray } from "./util/rand";

//response to "Server is up! ..."
const rizz:string[] = [
    "Dont burn down the place",
    "It actually worked this time?",
    "Probably should have made a backup...",
    "I'm watchin you, Derek",
    "I'm watchin you, Marchi",
    "I'm watchin you, Matt",
    "I'm watchin you, Danny",
    "I'm watchin you, Claudio",
    "Why's there smoke coming out of the server room...?",
    "wait that worked...?",
    "maybe I should rewrite it again ...",
    "y'all please, im running out of storage (jk)",
    "let me guess, were doing a europe realm?",
    "finally got tired of HOI4?",
    "finally got tired of Europa?",
    "I wonder how much this thing increases my electricity bill...",
    "Go to sleep, Danny",
    "We should do that space station thing again that was fun",
]

export function Rizz(): string {
    return RndSelectionFromArray(rizz);
}