document.addEventListener('DOMContentLoaded', function() {

    // --- 設定項目 ---
    // ★★★ ステップ1で準備したウェブアプリのURLをここに貼り付けてください ★★★
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwvLmuiLGx5e0QP6ozrzmRPWnLCmYfnTUNX4s2iGKL2mv-jdfnqQw8UKzpdduY-0-fN/exec";
    
    // ★★★ 合格者向けのインセンティブURL ★★★
    const INCENTIVE_URL = "https://otaru.gr.jp/";


    const quizData = [
        {
            question: "問1：小樽の歴史的建造物が多く残るエリアを散策する際、適切な行動はどれですか？",
            options: ["建物の壁に寄りかかって記念撮影をする", "私有地の庭に無断で入って花の写真を撮る", "建物の外観を静かに見学し、敷地内には入らない"],
            answer: "建物の外観を静かに見学し、敷地内には入らない"
        },
        {
            question: "問2：小樽運河沿いを歩いているとき、ゴミが出たらどうするのがベストですか？",
            options: ["人が見ていなければ、こっそり植え込みに捨てる", "近くのゴミ箱を探すか、見つからなければ持ち帰る", "カモメにあげて処理してもらう"],
            answer: "近くのゴミ箱を探すか、見つからなければ持ち帰る"
        },
        {
            question: "問3：飲食店で海鮮丼を食べる際、避けるべきマナー違反はどれですか？",
            options: ["大声で騒ぎながら食事をする", "お店の人におすすめを聞いてみる", "食べきれない量を注文しないように気をつける"],
            answer: "大声で騒ぎながら食事をする"
        },
        {
            question: "問4：ガラス工房やオルゴール堂などのお店で商品を見るとき、大切なことは何ですか？",
            options: ["商品を乱暴に扱って、音を確かめる", "「撮影禁止」の表示がなければ、自由に商品を撮影してSNSにアップする", "繊細な商品が多いので、優しく丁寧に扱う"],
            answer: "繊細な商品が多いので、優しく丁寧に扱う"
        },
        {
            question: "問5：冬の小樽は道が凍結していることがあります。歩行時に最も安全な方法は？",
            options: ["かかとから着地する大股で歩く", "小さな歩幅で、足の裏全体を地面につけるように歩く", "ポケットに手を入れて、バランスを取りながら歩く"],
            answer: "小さな歩幅で、足の裏全体を地面につけるように歩く"
        }
    ];

    const quizContainer = document.getElementById('quiz-container');
    const quizBody = document.getElementById('quiz-body');
    const submitBtn = document.getElementById('submit-btn');

    function buildQuiz() {
        quizData.forEach((data, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.className = 'question-block';
            const questionText = document.createElement('p');
            questionText.className = 'question-text';
            questionText.textContent = data.question;
            questionBlock.appendChild(questionText);
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options-container';
            const shuffledOptions = [...data.options].sort(() => Math.random() - 0.5);
            shuffledOptions.forEach(option => {
                const label = document.createElement('label');
                label.className = 'option-label';
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question${index}`;
                radio.value = option;
                label.appendChild(radio);
                const span = document.createElement('span');
                span.textContent = option;
                label.appendChild(span);
                optionsContainer.appendChild(label);
                label.addEventListener('click', () => {
                    document.querySelectorAll(`input[name="question${index}"]`).forEach(input => {
                        input.parentElement.classList.remove('selected');
                    });
                    label.classList.add('selected');
                });
            });
            questionBlock.appendChild(optionsContainer);
            quizBody.appendChild(questionBlock);
        });
    }

    async function submitResults() {
        for (let i = 0; i < quizData.length; i++) {
            if (!document.querySelector(`input[name="question${i}"]:checked`)) {
                alert('すべての質問に回答してください。');
                return;
            }
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '結果を送信中...';

        let score = 0;
        const questionResults = [];
        quizData.forEach((data, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`).value;
            const isCorrect = selectedOption === data.answer;
            questionResults.push(isCorrect);
            if (isCorrect) {
                score++;
            }
        });

        const totalQuestions = quizData.length;
        const percentage = Math.round((score / totalQuestions) * 100);
        const passThreshold = 80;
        const isPass = percentage >= passThreshold;

        const postData = {
            percentage: percentage,
            score: score,
            totalQuestions: totalQuestions,
            isPass: isPass,
            results: questionResults
        };

        try {
            await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(postData),
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
                <h2 class="result-title pass">🎉 合格です！ 🎉</h2>
                <p class="result-message">
                    おめでとうございます！あなたは小樽観光マナーマスターです。<br>
                    小樽の観光情報はこちらのサイトでチェック！
                </p>
                <a href="${INCENTIVE_URL}" target="_blank" class="incentive-link">小樽観光協会公式サイトへ</a>
            `;
        } else {
            messageHTML = `
                <h2 class="result-title fail">😢 不合格です 😢</h2>
                <p class="result-message">
                    ご協力ありがとうございます。<br>
                    もう一度挑戦して、小樽観光の知識を深めましょう！
                </p>
                <a href="" class="retry-btn">もう一度挑戦する</a>
            `;
        }
        quizContainer.innerHTML = `<div class="completion-message">${messageHTML}</div>`;
    }

    submitBtn.addEventListener('click', submitResults);
    buildQuiz();
});
