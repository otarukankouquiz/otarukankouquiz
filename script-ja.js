document.addEventListener('DOMContentLoaded', function() {

    // --- 設定項目 ---
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwvLmuiLGx5e0QP6ozrzmRPWnLCmYfnTUNX4s2iGKL2mv-jdfnqQw8UKzpdduY-0-fN/exec";
    const COUNTDOWN_SECONDS = 6; // 各問題の制限時間（秒）

    const quizData = [
        { question: "問1：歴史を感じる素敵な個人のお家を発見！写真を撮りたいとき、最も適切な行動はどれですか？", options: ["門から少しだけ中に入り、良いアングルで撮影する", "敷地には絶対に入らず、公道から静かに撮影する", "庭の木の枝を少しよけて、建物全体を撮影する"], answer: "敷地には絶対に入らず、公道から静かに撮影する" },
        { question: "問2：映画のワンシーンのような線路。記念撮影をしたいとき、どうするべきですか？", options: ["電車が来ていないことを確認して、線路上で素早く撮影する", "線路内への立ち入りは危険で禁止されているため、撮影は行わない", "線路のすぐそばに立って、迫力のある写真を撮る"], answer: "線路内への立ち入りは危険で禁止されているため、撮影は行わない" },
        { question: "問3：歩道のない景色が良い道を、友人や家族と歩くとき、最も安全な方法はどれですか？", options: ["道の広さに余裕があるので、横に広がっておしゃべりしながら歩く", "車に注意しながら、道の端を一列になって歩く", "後ろから車が来たら、その都度よければ問題ない"], answer: "車に注意しながら、道の端を一列になって歩く" },
        { question: "問4：散策中に飲み終わったペットボトル。近くにゴミ箱が見つからない場合、どうしますか？", options: ["誰も見ていないので、植え込みの中に隠しておく", "自分のカバンに入れて持ち帰り、ホテルのゴミ箱などに捨てる", "近くのお店のゴミ箱に、無断で捨てさせてもらう"], answer: "自分のカバンに入れて持ち帰り、ホテルのゴミ箱などに捨てる" },
        { question: "問5：市場で美味しそうなテイクアウトグルメを購入！近くのカフェに入って休憩するとき、どうするのが正しいですか？", options: ["お店の人に何も言わずに、持ち込んだものを食べ始める", "席料のつもりでドリンクだけ注文し、主に持ち込んだものを食べる", "「これを食べてもいいですか？」と、まずお店のスタッフに確認する"], answer: "「これを食べてもいいですか？」と、まずお店のスタッフに確認する" },
        { question: "問6：目的地のすぐ近くに車を停めたいですが、「駐車禁止」の標識があります。どうするべきですか？", options: ["「少しだけなら大丈夫だろう」と、禁止場所に停める", "少し歩くことになっても、近くの有料駐車場（パーキング）を探す", "運転手が乗ったまま、ハザードランプをつけて待つ"], answer: "少し歩くことになっても、近くの有料駐車場（パーキング）を探す" },
        { question: "問7：JRやバスで移動中、友人との会話で取るべき行動はどれですか？", options: ["通路を挟んだ席の友人と、周りも聞こえる大きな声で話す", "周りの人も楽しめるように、面白い話を大きな声でする", "隣の席の人と、周りに迷惑にならない小さな声で話す"], answer: "隣の席の人と、周りに迷惑にならない小さな声で話す" }
    ];

    // --- DOM要素の取得 ---
    const quizContainer = document.getElementById('quiz-container');
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startBtn = document.getElementById('start-btn');
    const timerBar = document.getElementById('timer-bar');
    const questionCounterEl = document.getElementById('question-counter');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    // --- 変数定義 ---
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timerInterval;

    // --- イベントリスナー ---
    startBtn.addEventListener('click', startQuiz);

    // --- 関数定義 ---
    function startQuiz() {
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        resetTimer();
        const currentQuestion = quizData[currentQuestionIndex];
        
        questionCounterEl.textContent = `第 ${currentQuestionIndex + 1} 問 / ${quizData.length} 問`;
        questionTextEl.textContent = currentQuestion.question;
        
        optionsContainer.innerHTML = '';
        const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);
        
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => selectAnswer(button, option));
            optionsContainer.appendChild(button);
        });

        startTimer();
    }

    function startTimer() {
        let timeLeft = COUNTDOWN_SECONDS;
        timerBar.style.width = '100%';
        timerBar.style.transition = `width ${COUNTDOWN_SECONDS}s linear`;
        timerBar.style.width = '0%';

        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                selectAnswer(null, null); // 時間切れ
            }
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
    }

    function selectAnswer(selectedButton, selectedOption) {
        resetTimer();
        userAnswers[currentQuestionIndex] = selectedOption;

        const isCorrect = selectedOption === quizData[currentQuestionIndex].answer;
        
        Array.from(optionsContainer.children).forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === quizData[currentQuestionIndex].answer) {
                btn.classList.add('correct');
            } else if (btn === selectedButton) {
                btn.classList.add('incorrect');
            }
        });

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                showQuestion();
            } else {
                finishQuiz();
            }
        }, 1200); // 1.2秒待ってから次の問題へ
    }

    async function finishQuiz() {
        quizScreen.innerHTML = `<h2 class="result-title">結果を送信中...</h2><p class="result-message">しばらくお待ちください</p>`;
        
        let score = 0;
        const questionResults = [];
        quizData.forEach((data, index) => {
            const isCorrect = userAnswers[index] === data.answer;
            questionResults.push(isCorrect);
            if (isCorrect) score++;
        });

        const totalQuestions = quizData.length;
        const percentage = Math.round((score / totalQuestions) * 100);
        const passThreshold = 80;
        const isPass = percentage >= passThreshold;

        try {
            await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    percentage, score, totalQuestions, isPass,
                    results: questionResults
                }),
            });
        } catch (error) {
            console.error('結果の送信に失敗しました:', error);
        }

        showCompletionMessage(isPass);
    }

    function showCompletionMessage(isPass) {
        let messageHTML = '';
        if (isPass) {
            messageHTML = `
                <div class="completion-message">
                    <h2 class="result-title pass">🎉 合格です！ 🎉</h2>
                    <p class="result-message">
                        おめでとうございます！あなたは小樽観光マナーマスターです。<br>
                        小樽の観光に役立つサイトはこちらからどうぞ！
                    </p>
                    <div class="incentive-container">
                        <a href="https://otaru.gr.jp/project/otaru-tourist-brochure" target="_blank" class="incentive-link">観光ガイドマップ・パンフレット</a>
                        <a href="https://tsumugu-otaru.jp/" target="_blank" class="incentive-link">オンライン観光ガイド「つむぐおたる」</a>
                        <a href="https://otaru.gr.jp/" target="_blank" class="incentive-link">小樽観光協会</a>
                    </div>
                </div>`;
        } else {
            messageHTML = `
                <div class="completion-message">
                    <h2 class="result-title fail">😢 不合格です 😢</h2>
                    <p class="result-message">
                        ご協力ありがとうございます。<br>
                        もう一度挑戦して、小樽観光の知識を深めましょう！
                    </p>
                    <a href="" class="retry-btn">もう一度挑戦する</a>
                </div>`;
        }
        quizContainer.innerHTML = messageHTML;
    }
});
