document.addEventListener('DOMContentLoaded', function() {

    // --- 設定項目 ---
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwvLmuiLGx5e0QP6ozrzmRPWnLCmYfnTUNX4s2iGKL2mv-jdfnqQw8UKzpdduY-0-fN/exec";
    const COUNTDOWN_SECONDS = 10;

    const quizData = [
        { question: "問1：歴史を感じる素敵な個人のお家を発見！写真を撮りたいとき、最も適切な行動はどれですか？", options: ["門から少しだけ中に入り、良いアングルで撮影する", "敷地には絶対に入らず、公道から静かに撮影する", "庭の木の枝を少しよけて、建物全体を撮影する"], answer: "敷地には絶対に入らず、公道から静かに撮影する" },
        { question: "問2：映画のワンシーンのような線路。記念撮影をしたいとき、どうするべきですか？", options: ["電車が来ていないことを確認して、線路上で素早く撮影する", "線路内への立ち入りは危険で禁止されているため、撮影は行わない", "線路のすぐそばに立って、迫力のある写真を撮る"], answer: "線路内への立ち入りは危険で禁止されているため、撮影は行わない" },
        { question: "問3：歩道のない景色が良い道を、友人や家族と歩くとき、最も安全な方法はどれですか？", options: ["道の広さに余裕があるので、横に広がっておしゃべりしながら歩く", "車に注意しながら、道の端を一列になって歩く", "後ろから車が来たら、その都度よければ問題ない"], answer: "車に注意しながら、道の端を一列になって歩く" },
        { question: "問4：散策中に飲み終わったペットボトル。近くにゴミ箱が見つからない場合、どうしますか？", options: ["誰も見ていないので、植え込みの中に隠しておく", "自分のカバンに入れて持ち帰り、ホテルのゴミ箱などに捨てる", "近くのお店のゴミ箱に、無断で捨てさせてもらう"], answer: "自分のカバンに入れて持ち帰り、ホテルのゴミ箱などに捨てる" },
        { question: "問5：市場で美味しそうなテイクアウトグルメを購入！近くのカフェに入って休憩するとき、どうするのが正しいですか？", options: ["お店の人に何も言わずに、持ち込んだものを食べ始める", "席料のつもりでドリンクだけ注文し、主に持ち込んだものを食べる", "「これを食べてもいいですか？」と、まずお店のスタッフに確認する"], answer: "「これを食べてもいいですか？」と、まずお店のスタッフに確認する" },
        { question: "問6：目的地のすぐ近くに車を停めたいですが、「駐車禁止」の標識があります。どうするべきですか？", options: ["「少しだけなら大丈夫だろう」と、禁止場所に停める", "少し歩くことになっても、近くの有料駐車場（パーキング）を探す", "運転手が乗ったまま、ハザードランプをつけて待つ"], answer: "少し歩くことになっても、近くの有料駐車場（パーキング）を探す" },
        { question: "問7：JRやバスで移動中、友人との会話で取るべき行動はどれですか？", options: ["通路を挟んだ席の友人と、周りも聞こえる大きな声で話す", "周りの人も楽しめるように、面白い話を大きな声でする", "隣の席の人と、周りに迷惑にならない小さな声で話す"], answer: "隣の席の人と、周りに迷惑にならない小さな声で話す" }
    ];

    // DOM要素
    const quizContainer = document.getElementById('quiz-container');
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startBtn = document.getElementById('start-btn');
    const timerBar = document.getElementById('timer-bar');
    const questionCounterEl = document.getElementById('question-counter');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const soundControl = document.getElementById('sound-control');
    const iconSoundOn = document.getElementById('icon-sound-on');
    const iconSoundOff = document.getElementById('icon-sound-off');

    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timerInterval;
    let isMuted = false;
    let isSoundInitialized = false;
    let seSynth, bgmSynth, bgm;

    // サウンド関数
    function playClickSound() { if (!isMuted && seSynth) seSynth.triggerAttackRelease("C5", "16n"); }
    function playCorrectSound() { if (!isMuted && seSynth) { seSynth.triggerAttackRelease("E5", "12n", Tone.now()); seSynth.triggerAttackRelease("A5", "12n", Tone.now() + 0.1); } }
    function playIncorrectSound() { if (!isMuted && seSynth) { seSynth.triggerAttackRelease("E3", "8n", Tone.now()); seSynth.triggerAttackRelease("C3", "8n", Tone.now() + 0.15); } }
    function playPassSound() {
        if (!isMuted && seSynth) {
            const melody = ["C5", "E5", "G5", "C6"];
            melody.forEach((note, i) => seSynth.triggerAttackRelease(note, "16n", Tone.now() + i * 0.15));
        }
    }
    function playFailSound() { if (!isMuted && seSynth) { seSynth.triggerAttackRelease("G3", "8n", Tone.now()); seSynth.triggerAttackRelease("C3", "8n", Tone.now() + 0.2); } }

    // イベントリスナー
    startBtn.addEventListener('click', startQuiz);
    soundControl.addEventListener('click', toggleMute);

    async function initializeAudio() {
        if (isSoundInitialized) return;
        try {
            await Tone.start();
            seSynth = new Tone.Synth().toDestination();
            bgmSynth = new Tone.Synth({ volume: -12 }).toDestination();
            bgm = new Tone.Sequence((time, note) => {
                if (bgmSynth) bgmSynth.triggerAttackRelease(note, "8n", time);
            }, ["C4", "E4", "G4", "C5", "E4", "G4", "A4", "G4"], "4n").start(0);
            Tone.Transport.bpm.value = 100;
            isSoundInitialized = true;
        } catch (e) {
            console.error("Sound init failed", e);
            isMuted = true;
            soundControl.style.display = 'none';
            isSoundInitialized = true;
        }
    }

    function toggleMute() {
        if (!isSoundInitialized && isMuted) return;
        isMuted = !isMuted;
        if (isSoundInitialized && Tone.Master) Tone.Master.mute = isMuted;
        iconSoundOn.style.display = isMuted ? 'none' : 'block';
        iconSoundOff.style.display = isMuted ? 'block' : 'none';
        if (isSoundInitialized && Tone.Transport && !quizScreen.classList.contains('hidden')) {
            isMuted ? Tone.Transport.pause() : Tone.Transport.start();
        }
    }

    async function startQuiz() {
        await initializeAudio();
        playClickSound();
        if (!isMuted && isSoundInitialized && Tone.Transport) Tone.Transport.start();
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        resetTimer();
        const currentQuestion = quizData[currentQuestionIndex];
        questionCounterEl.textContent = `Q.${currentQuestionIndex + 1} / ${quizData.length}`;
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
        requestAnimationFrame(() => {
            timerBar.style.transition = `width ${COUNTDOWN_SECONDS}s linear`;
            timerBar.style.width = '0%';
        });
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                selectAnswer(null, null);
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
        isCorrect ? playCorrectSound() : playIncorrectSound();
        
        Array.from(optionsContainer.children).forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === quizData[currentQuestionIndex].answer) btn.classList.add('correct');
            else if (btn === selectedButton) btn.classList.add('incorrect');
        });

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) showQuestion();
            else finishQuiz();
        }, 1200);
    }

    async function finishQuiz() {
        if (isSoundInitialized && Tone.Transport) Tone.Transport.stop();
        quizScreen.innerHTML = `<div style="padding:2rem;"><h2 class="result-title">採点中...</h2><p>結果を作成しています</p></div>`;
        
        let score = 0;
        const questionResults = [];
        quizData.forEach((data, index) => {
            const isCorrect = userAnswers[index] === data.answer;
            questionResults.push(isCorrect);
            if (isCorrect) score++;
        });

        const percentage = Math.round((score / quizData.length) * 100);
        const isPass = percentage >= 80;
        isPass ? playPassSound() : playFailSound();

        // GAS送信 (エラーでも画面表示は止めない)
        fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ percentage, score, totalQuestions: quizData.length, isPass, results: questionResults }),
        }).catch(e => console.error('GAS Error', e));

        showCompletionMessage(isPass, score);
    }

    // ★★★ 認定証生成部分 ★★★
    function showCompletionMessage(isPass, score) {
        const today = new Date().toLocaleDateString('ja-JP');
        let html = '';

        if (isPass) {
            html = `
                <div class="certificate-card">
                    <div class="cert-title">小樽観光<br>マナーマスター認定証</div>
                    <div class="cert-grade">Excellent!</div>
                    <p>あなたは高いマナー意識を持った<br>素晴らしい旅行者です。</p>
                    <div class="cert-date">Date: ${today}</div>
                </div>
                <div class="incentive-text">
                    合格おめでとうございます！<br>
                    この画面を提示すると特典が受けられます(予定)
                </div>
                <a href="https://otaru.gr.jp/" target="_blank" class="incentive-link">観光ガイドを受け取る</a>
            `;
        } else {
            html = `
                <h2 class="result-title fail" style="margin-top:2rem;">惜しい！</h2>
                <p class="result-message">
                    正解数: ${score} / ${quizData.length}<br>
                    あと少しで合格です。<br>もう一度挑戦してみましょう！
                </p>
                <a href="quiz-ja.html" class="retry-btn">もう一度挑戦する</a>
            `;
        }
        quizContainer.innerHTML = html;
    }
});

