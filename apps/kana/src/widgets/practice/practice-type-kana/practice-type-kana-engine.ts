class Sequence {
  originalSequence: string = "";
  sequence: (string | null)[] = [];
  answerStatus: (boolean | null)[] = [];
  isLocked: boolean = false;
  private onComplete?: (isCorrect: boolean, typed: string) => void;

  constructor(onComplete?: (isCorrect: boolean, typed: string) => void) {
    this.onComplete = onComplete;
  }

  setNextWord(word: string, callback: () => void) {
    this.originalSequence = word;
    this.sequence = Array(word.length).fill(null);
    this.answerStatus = Array(word.length).fill(null);
    this.isLocked = false;
    callback();
  }

  addItem(value: string, callback: () => void) {
    if (this.isLocked) return false;
    if (this.sequence.every((item) => item !== null)) return false;

    const index = this.sequence.indexOf(null);
    if (index === -1) return false;

    this.sequence[index] = value;
    callback();

    if (!this.sequence.includes(null)) {
      this.revealAnswer(callback);
    }

    return true;
  }

  removeOne(callback: () => void) {
    if (this.isLocked) return;

    for (let i = this.sequence.length - 1; i >= 0; i--) {
      if (this.sequence[i] !== null) {
        this.sequence[i] = null;
        this.answerStatus[i] = null;
        break;
      }
    }
    callback();
  }

  private revealAnswer(callback: () => void) {
    this.isLocked = true;

    const current = this.sequence.join("").toLowerCase();
    const correct = this.originalSequence.toLowerCase();

    const isMatch = current === correct;

    this.answerStatus = this.sequence.map((char, idx) => {
      return char?.toLowerCase() === correct[idx];
    });

    callback();

    const typed = this.sequence.map((char) => char ?? "").join("");

    this.onComplete?.(isMatch, typed);
  }
}

export default Sequence;
