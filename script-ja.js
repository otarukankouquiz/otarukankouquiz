document.addEventListener('DOMContentLoaded', function() {

    // --- 設定項目 ---
    // ★★★ Google Apps ScriptのウェブアプリURLをここに貼り付けてください ★★★
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwvLmuiLGx5e0QP6ozrzmRPWnLCmYfnTUNX4s2iGKL2mv-jdfnqQw8UKzpdduY-0-fN/exec";
    
    // --- 新しいクイズの内容 (全6問) ---
    const quizData = [
        {
            question: "問1：歴史を感じる素敵な個人のお家を発見！写真を撮りたいとき、最も適切な行動はどれですか？",
            options: [
                "門から少しだけ中に入り、良いアングルで撮影する",
                "敷地には絶対に入らず、公道から静かに撮影する",
                "庭の木の枝を少しよけて、建物全体を撮影する"
            ],
            answer: "敷地には絶対に入らず、公道から静かに撮影する"
        },
        {
            question: "問2：映画のワンシーンのような線路。記念撮影をしたいとき、どうするべきですか？",
            options: [
                "電車が来ていないことを確認して、線路上で素早く撮影する",
                "線路のすぐそばに立って、迫力のある写真を撮る",
                "線路内への立ち入りは危険で禁止されているため、撮影は行わない"
            ],
            answer: "線路内への立ち入りは危険で禁止されているため、撮影は行わない"
        },
        {
            question: "問3：小樽の美しい坂道で写真を撮りたくなりました。最も安全な方法はどれですか？",
            options: [
                "車の通りが少ない一瞬を狙って、車道の真ん中で撮影する",
                "道の端にある歩道を使い、車や通行人に注意しながら撮影する",
                "友人に車を止めてもらい、その間だけ車道で撮影する"
            ],
            answer: "道の端にある歩道を使い、車や通行人に注意しながら撮影する"
        },
        {
            question: "問4：散策中に飲み終わったペットボトル。近くにゴミ箱が見つからない場合、どうしますか？",
            options: [
                "誰も見ていないので、植え込みの中に隠しておく",
                "自分のカバンに入れて持ち帰り、ホテルのゴミ箱などに捨てる",
                "近くのお店のゴミ箱に、無断で捨てさせてもらう"
            ],
            answer: "自分のカバンに入れて持ち帰り、ホテルのゴミ箱などに捨てる"
        },
        {
            question: "問5：観光中に市場で買った新鮮な海産物。これをすぐに食べたいとき、近くのレストランでどうするのが正しいですか？",
            options: [
                "レストランで席だけ借りて、持ち込んだ海産物を食べる",
                "お店の人に許可なく、注文した料理と一緒に持ち込み品を食べる",
                "持ち込みが可能かをお店の人に確認し、許可がない限り持ち込まない"
            ],
            answer: "持ち込みが可能かをお店の人に確認し、許可がない限り持ち込まない"
        },
        {
            question: "問6：「駐車禁止」の標識がある場所です。少しだけなら大丈夫だろう、と車を停めたいとき、どうするべきですか？",
            options: [
                "ハザードランプをつければ、5分くらいなら問題ない",
                "運転手が車内にいれば、すぐに動かせるので停めても良い",
                "駐車禁止の場所には、たとえ短時間でも車を停めてはいけない"
            ],
            answer: "駐車禁止の場所には、たとえ短時間でも車を停めてはいけない"
        }
    ];

    // --- ここから下のプログラムは変更ありません ---

    const quizContainer = document.getElementById('quiz-container');
    const quizBody = document.getElementById('quiz-body');
    const submitBtn = document.getElementById('submit-btn');

    function buildQuiz() {
        // quizBodyがnullの場合、処理を中断してエラーを防ぐ
        if (!quizBody) {
            console.error("エラー: HTML内に 'quiz-body' のIDを持つ要素が見つかりません。");
            return;
        }
        
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
                    小樽の観光に役立つサイトはこちらからどうぞ！
                </p>
                <div class="incentive-container">
                    <a href="https://otaru.gr.jp/project/otaru-tourist-brochure" target="_blank" class="incentive-link">観光ガイドマップ・パンフレット</a>
                    <a href="https://tsumugu-otaru.jp/" target="_blank" class="incentive-link">オンライン観光ガイド「つむぐおたる」</a>
                    <a href="https://otaru.gr.jp/" target="_blank" class="incentive-link">小樽観光協会ホームページ</a>
                </div>
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
