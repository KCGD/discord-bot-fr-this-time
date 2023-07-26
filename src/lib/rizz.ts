import { RndSelectionFromArray } from "./util/rand";

//response to "Server is up! ..."
const rizz:string[] = [
    "Go to sleep, Danny",
    "wait that worked...?",
    "I'm watchin you, Matt",
    "I'm watchin you, Danny",
    "I'm watchin you, Derek",
    "I'm watchin you, Marchi",
    "Dont burn down the place",
    "I'm watchin you, Claudio",
    "finally got tired of HOI4?",
    "finally got tired of Europa?",
    "It actually worked this time?",
    "maybe I should rewrite it again ...",
    "Probably should have made a backup...",
    "let me guess, were doing a europe realm?",
    "y'all please, im running out of storage (jk)",
    "Why's there smoke coming out of the server room...?",
    "We should do that space station thing again that was fun",
    "I wonder how much this thing increases my electricity bill...",
]

export function Rizz(): string {
    return RndSelectionFromArray(rizz);
}