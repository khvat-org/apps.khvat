import { shuffleArray } from "@/shared/helpers/letters";

class Sequence {
  originalSequence: string = "";
  sequence: (string | null)[] = [];

  answerStatus: (boolean | null)[] = [];
  isLocked: boolean = false;

  shuffledLetters: string[] = [];
  selectedLetters: { [key: number]: boolean } = {};

  private onComplete?: (isCorrect: boolean, picked: string[]) => void;
  private refresh: () => void;

  constructor(onComplete: (isCorrect: boolean, picked: string[]) => void, updateFunc: () => void) {
    this.onComplete = onComplete;
    this.refresh = updateFunc;
  }

  setNextWord(word: string) {
    this.originalSequence = word;
    this.sequence = Array(word.length).fill(null);
    this.answerStatus = Array(word.length).fill(null);

    this.shuffledLetters = shuffleArray(word.split(""));

    this.selectedLetters = {};

    this.isLocked = false;
    this.refresh();
  }

  addItem(value: string, position: number) {
    if (this.isLocked) return false;
    if (this.sequence.every((item) => item !== null)) return false;

    const index = this.sequence.indexOf(null);
    if (index === -1) return false;

    this.sequence[index] = value;
    this.selectedLetters[position] = true;

    this.refresh();

    if (!this.sequence.includes(null)) {
      this.revealAnswer();
    }

    return true;
  }

  removeOne() {
    if (this.isLocked) return;

    let itemForRemove: string | null = null;

    for (let i = this.sequence.length - 1; i >= 0; i--) {
      if (this.sequence[i] !== null) {
        itemForRemove = this.sequence[i];

        this.sequence[i] = null;
        this.answerStatus[i] = null;
        break;
      }
    }

    let position = 0;
    this.shuffledLetters.forEach((item, index) => {
      if (item === itemForRemove && this.selectedLetters[index] === true) {
        position = index;
        return;
      }
    });

    this.selectedLetters[position] = false;

    if (this.sequence.every((item) => item === null)) {
      this.selectedLetters = {};
    }

    this.refresh();
  }

  private revealAnswer() {
    this.isLocked = true;

    const current = this.sequence.join("").toLowerCase();
    const correct = this.originalSequence.toLowerCase();

    const isMatch = current === correct;

    this.answerStatus = this.sequence.map((char, idx) => {
      return char?.toLowerCase() === correct[idx];
    });

    this.refresh();

    const picked = this.sequence.map((char) => char ?? "");

    this.onComplete?.(isMatch, picked);
  }
}

export default Sequence;
