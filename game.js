class Bet {
    constructor() {
        this.taiAmount = 0;
        this.xiuAmount = 0;
    }

    placeBet(amount, choice) {
        if (choice === "tai") {
            this.taiAmount += amount;
        } else if (choice === "xiu") {
            this.xiuAmount += amount;
        }
    }

    reset() {
        this.taiAmount = 0;
        this.xiuAmount = 0;
    }
}

class Game {
    constructor() {
        this.userMoney = 1000000;  // Tiền khởi điểm
        this.bet = new Bet();
        this.history = [];
        this.countdownElement = document.getElementById("countdown");
        this.resultElement = document.getElementById("result");
        this.moneyDisplay = document.getElementById("money-display");
        this.historyElement = document.getElementById("history");
        this.updateMoneyDisplay();
        this.startCountdown();
    }

    startCountdown() {
        let timeLeft = 30;
        this.countdownInterval = setInterval(() => {
            this.countdownElement.innerHTML = timeLeft;
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(this.countdownInterval);
                this.countdownElement.innerHTML = "";
                this.displayRandomNumbers();
                setTimeout(() => this.startCountdown(), 5000);
            }
        }, 1000);
    }

    placeBet(choice) {

        const betAmountElement = document.getElementById(`bet-${choice.toLowerCase()}`);
        console.log(`bet-${choice.toLowerCase()}`)
        const betAmount = parseInt(betAmountElement.value);
        if (isNaN(betAmount) || betAmount <= 0) {
            document.getElementById('result').innerHTML ="Vui lòng nhập số tiền hợp lệ!";
            return;
        }

        if (betAmount > this.userMoney) {
            document.getElementById('result').innerHTML ="Số tiền đặt cược vượt quá số tiền hiện có!";
            return;
        }

        // Trừ tiền và cộng dồn cược
        this.bet.placeBet(betAmount, choice);
        this.userMoney -= betAmount;
        this.updateMoneyDisplay();

        // Cập nhật hiển thị tiền đặt cược dưới ô input
        const displayElement = document.getElementById(`bet-${choice.toLowerCase()}-amount`);
        const totalBet = choice === "tai" ? this.bet.taiAmount : this.bet.xiuAmount;
        displayElement.innerHTML = `Bạn đã đặt: ${totalBet.toLocaleString()} VND`;

        // Reset ô input
        betAmountElement.value = '';
    }

    updateMoneyDisplay() {
        this.moneyDisplay.innerHTML = `Số tiền hiện có: ${this.userMoney.toLocaleString()} VND`;
    }

    displayRandomNumbers() {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const dice3 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2 + dice3;
        const resultText = (total > 10) ? "Tài" : "Xỉu";

        this.resultElement.innerHTML = `Kết quả: ${dice1}, ${dice2}, ${dice3} - ${resultText}`;
        this.updateHistory(dice1, dice2, dice3, resultText);
        this.calculateWinnings(resultText);
    }

    calculateWinnings(resultText) {
        let winnings = 0;
        if (resultText === "Tài" && this.bet.taiAmount > 0) {
            winnings = this.bet.taiAmount * 1.9;
        } else if (resultText === "Xỉu" && this.bet.xiuAmount > 0) {
            winnings = this.bet.xiuAmount * 1.9;
        }

        if (winnings > 0) {
            this.userMoney += winnings;
            document.getElementById('result').innerHTML =`Bạn đã thắng! Số tiền hiện có: ${this.userMoney.toLocaleString()} VND`;
        } else {
            document.getElementById('result').innerHTML = `Bạn đã thua! Số tiền hiện có: ${this.userMoney.toLocaleString()} VND`;
        }

        this.updateMoneyDisplay();
        this.resetBet();
    }

    updateHistory(dice1, dice2, dice3, resultText) {
        this.history.unshift(`Kết quả: ${dice1}, ${dice2}, ${dice3} - ${resultText}`);
        if (this.history.length > 10) {
            this.history.pop();
        }
        this.historyElement.innerHTML = "<h2>Lịch sử kết quả</h2>";
        this.history.forEach(item => {
            const historyItem = document.createElement("div");
            historyItem.className = "history-item";
            historyItem.textContent = item;
            this.historyElement.appendChild(historyItem);
        });
    }

    resetBet() {
        this.bet.reset();
        document.getElementById("bet-tai-amount").innerHTML = "";
        document.getElementById("bet-xiu-amount").innerHTML = "";
    }
}

// Khởi tạo game
let game = new Game()
