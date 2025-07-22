document.addEventListener('DOMContentLoaded', function() {

    // --- 設定項目 ---
    // ★★★ ステップ1でコピーしたウェブアプリのURLをここに貼り付けてください ★★★
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwqyYxFlTHUEi1-hXXxuA_8ygEtvIY7MX3YJ_5BhF02_ck34tVVcHzX_UWreKky3S6g/exec";

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
        // (この関数の中身は変更ありません)
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
        // 全ての質問に回答したかチェック
        for (let i = 0; i < quizData.length; i++) {
            if (!document.querySelector(`input[name="question${i}"]:checked`)) {
                alert('すべての質問に回答してください。');
                return;
            }
        }

        // ボタンを無効化し、メッセージを表示
        submitBtn.disabled = true;
        submitBtn.textContent = '結果を送信中...';

        // スコア計算
        let score = 0;
        quizData.forEach((data, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`).value;
            if (selectedOption === data.answer) {
                score++;
            }
        });

        const totalQuestions = quizData.length;
        const percentage = Math.round((score / totalQuestions) * 100);
        const passThreshold = 80;
        const isPass = percentage >= passThreshold;

        // GASに送信するデータを作成
        const postData = {
            percentage: percentage,
            score: score,
            totalQuestions: totalQuestions,
            isPass: isPass
        };

        // GASに結果を送信
        try {
            await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', // CORSエラーを回避
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
        } catch (error) {
            console.error('結果の送信に失敗しました:', error);
            // エラーが発生してもユーザーには完了メッセージを表示する
        }

        // ユーザーに完了メッセージを表示
        showCompletionMessage(isPass);
    }

    function showCompletionMessage(isPass) {
        quizContainer.innerHTML = `
            <div class="completion-message">
                <h2 class="result-title">ご回答ありがとうございました！</h2>
                <p class="result-message">
                    ${isPass ? 'おめでとうございます！あなたは小樽観光マナーマスターです。' : 'ご協力ありがとうございます。'}
                </p>
                ${!isPass ? '<a href="" class="retry-btn">もう一度挑戦する</a>' : ''}
            </div>
        `;
    }

    submitBtn.addEventListener('click', submitResults);
    buildQuiz();
});
