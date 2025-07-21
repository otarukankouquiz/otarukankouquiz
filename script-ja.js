document.addEventListener('DOMContentLoaded', function() {

    // --- 設定項目 ---
    // ここでクイズの問題、選択肢、正解、そして解説を編集します
    const quizData = [
        {
            question: "問1：小樽の歴史的建造物が多く残るエリアを散策する際、適切な行動はどれですか？",
            options: ["建物の壁に寄りかかって記念撮影をする", "私有地の庭に無断で入って花の写真を撮る", "建物の外観を静かに見学し、敷地内には入らない"],
            answer: "建物の外観を静かに見学し、敷地内には入らない",
            explanation: "歴史的建造物の多くは今も個人が所有し、生活している大切な住居です。外観を静かに楽しむだけに留め、敷地内への無断立ち入りや建物に触れる行為は控えましょう。"
        },
        {
            question: "問2：小樽運河沿いを歩いているとき、ゴミが出たらどうするのがベストですか？",
            options: ["人が見ていなければ、こっそり植え込みに捨てる", "近くのゴミ箱を探すか、見つからなければ持ち帰る", "カモメにあげて処理してもらう"],
            answer: "近くのゴミ箱を探すか、見つからなければ持ち帰る",
            explanation: "美しい景観を守るため、ゴミのポイ捨ては絶対にやめましょう。また、野生動物への餌やりは生態系に影響を与える可能性があるため、控えるのがマナーです。"
        },
        {
            question: "問3：飲食店で海鮮丼を食べる際、避けるべきマナー違反はどれですか？",
            options: ["大声で騒ぎながら食事をする", "お店の人におすすめを聞いてみる", "食べきれない量を注文しないように気をつける"],
            answer: "大声で騒ぎながら食事をする",
            explanation: "他のお客様も食事を楽しんでいます。お店の雰囲気を壊さないよう、大きな声での会話は避け、静かに食事を楽しみましょう。"
        },
        {
            question: "問4：ガラス工房やオルゴール堂などのお店で商品を見るとき、大切なことは何ですか？",
            options: ["商品を乱暴に扱って、音を確かめる", "「撮影禁止」の表示がなければ、自由に商品を撮影してSNSにアップする", "繊細な商品が多いので、優しく丁寧に扱う"],
            answer: "繊細な商品が多いので、優しく丁寧に扱う",
            explanation: "ガラス製品やオルゴールは非常にデリケートです。お店の許可なく触れたり、乱暴に扱ったりすると破損の原因になります。大切な商品ですので、敬意をもって見学しましょう。"
        },
        {
            question: "問5：冬の小樽は道が凍結していることがあります。歩行時に最も安全な方法は？",
            options: ["かかとから着地する大股で歩く", "小さな歩幅で、足の裏全体を地面につけるように歩く", "ポケットに手を入れて、バランスを取りながら歩く"],
            answer: "小さな歩幅で、足の裏全体を地面につけるように歩く",
            explanation: "凍結した路面（アイスバーン）では、ペンギンのように小さな歩幅で歩く「すり足」が最も安全です。転倒防止のため、滑りにくい靴を履き、両手はいつでも使えるようにしておきましょう。"
        }
    ];

    const quizContainer = document.getElementById('quiz-container');
    const quizBody = document.getElementById('quiz-body');
    const submitBtn = document.getElementById('submit-btn');

    // クイズのHTMLを生成する関数
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

    // 結果を表示する関数
    function showResults() {
        // 全ての質問に回答したかチェック
        for (let i = 0; i < quizData.length; i++) {
            if (!document.querySelector(`input[name="question${i}"]:checked`)) {
                alert('すべての質問に回答してください。');
                return;
            }
        }

        let score = 0;
        const userAnswers = [];
        quizData.forEach((data, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`).value;
            userAnswers.push(selectedOption);
            if (selectedOption === data.answer) {
                score++;
            }
        });

        const percentage = Math.round((score / quizData.length) * 100);
        const passThreshold = 80;
        const isPass = percentage >= passThreshold;

        // クイズコンテナの中身を結果表示に差し替え
        quizContainer.innerHTML = '';

        // 結果サマリーのHTMLを生成
        let summaryHTML = `
            <div class="result-summary">
                <h2 class="result-title ${isPass ? 'pass' : 'fail'}">${isPass ? '🎉 合格です！ 🎉' : '😢 不合格です 😢'}</h2>
                <p class="result-score">あなたの正解率： ${percentage}% (${quizData.length}問中 ${score}問正解)</p>
                <p class="result-message">${isPass ? 'おめでとうございます！あなたは小樽観光マナーマスターです。' : 'もう一度挑戦して、小樽観光の知識を深めましょう！'}</p>
            </div>
        `;

        // 各問題の答え合わせHTMLを生成
        let detailsHTML = quizData.map((data, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === data.answer;
            return `
                <div class="result-question-block ${isCorrect ? 'correct' : 'incorrect'}">
                    <p class="result-question-text">${data.question}</p>
                    <p class="user-answer ${isCorrect ? 'correct' : 'incorrect'}">あなたの回答: ${userAnswer}</p>
                    <div class="explanation">
                        <strong>💡 解説</strong>
                        ${data.explanation}
                    </div>
                </div>
            `;
        }).join('');

        // もう一度挑戦するボタンを追加
        const retryButtonHTML = `<a href="" class="retry-btn">もう一度挑戦する</a>`;

        quizContainer.innerHTML = summaryHTML + detailsHTML + retryButtonHTML;
    }

    // イベントリスナーを設定
    submitBtn.addEventListener('click', showResults);

    // クイズを初期化
    buildQuiz();
});

