new Vue({
  el: "#app",
  data: {
    money: [
      { level: "15", amount: "1,000,000" },
      { level: "14", amount: "500,000" },
      { level: "13", amount: "250,000" },
      { level: "12", amount: "100,000" },
      { level: "11", amount: "50,000" },
      { level: "10", amount: "25,000" },
      { level: "9", amount: "16,000" },
      { level: "8", amount: "8,000" },
      { level: "7", amount: "4,000" },
      { level: "6", amount: "2,000" },
      { level: "5", amount: "1,000" },
      { level: "4", amount: "500" },
      { level: "3", amount: "300" },
      { level: "2", amount: "200" },
      { level: "1", amount: "100" }
    ],
    triviaBlocks: [],
    qIndex: 0,
    question: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correctAnswer: "",
    correctLetter: "",
    music: new Audio("./js/Round1.ogg"),
    host: new SpeechSynthesisUtterance(),
    selected: undefined,
    disabled: false
  },
  watch: {
    //qIndex is variable to watch but made function
    qIndex() {
      this.displayQuestion();
      this.read();
    }
  },
  methods: {
    //method to fetch questions
    async startGame() {
      this.selected = true;
      this.disabled = false;
      this.playRound1();

      const res = await fetch(
        "https://opentdb.com/api.php?amount=15&type=multiple"
      );
      const data = await res.json();
      this.triviaBlocks = data.results;
      console.log(this.triviaBlocks);
      this.displayQuestion();
      this.read();
    },
    //methods to display the questions
    displayQuestion() {
      this.parseCurrentQuestion();
      this.shuffleAnswers();
    },
    //method to set the question and correct answer
    parseCurrentQuestion() {
      this.question = this.triviaBlocks[this.qIndex].question;
      this.correctAnswer = this.triviaBlocks[this.qIndex].correct_answer;
    },
    //method to assign possible answers, randomize them, and set them up to be displayed
    shuffleAnswers() {
      let choices = [
        this.correctAnswer,
        ...this.triviaBlocks[this.qIndex].incorrect_answers
      ];
      const randomChoices = _.shuffle(choices);
      [this.answer1, this.answer2, this.answer3, this.answer4] = randomChoices;

      this.correctLetter = randomChoices.findIndex(
        choice => choice === this.correctAnswer
      );
      console.log(this.correctAnswer);
    },
    //method to check which answer the user picks - if wrong answer displays "game over", disables the ability to click, and reappears the start button
    isAnswer(letter) {
      const dictionary = ["a", "b", "c", "d"];
      const index = dictionary.findIndex(char => char === letter);

      if (index === this.correctLetter) {
        console.log(this.qIndex);
        if (this.qIndex === 14) {
          this.question = "Winner";
          this.answer1 = "";
          this.answer2 = "";
          this.answer3 = "";
          this.answer4 = "";
          this.disabled = true;
        } else {
          this.qIndex += 1;
        }
      } else {
        this.disabled = true;
        this.question = "Game Over";
        this.answer1 = "";
        this.answer2 = "";
        this.answer3 = "";
        this.answer4 = "";
        this.selected = false;
        return;
      }
    },
    //plays the round one music
    playRound1() {
      this.music.play();
    },
    //reads the questions and answers
    read() {
      this.host.rate = 0.6;
      this.host.text = `${this.question}, A, ${this.answer1}, B, ${this.answer2}, C, ${this.answer3}, D, ${this.answer4}`;
      speechSynthesis.speak(this.host);
    }
  }
});
