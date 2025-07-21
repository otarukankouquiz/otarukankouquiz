document.addEventListener('DOMContentLoaded', function() {

    // --- 設定項目 ---
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

    const incentiveURL = "https://www.google.com/search?q=Otaru+special+coupon"; // ★ここに合格者向けページのURLを入力してください

    // --- DOM要素の取得 ---
    const quizBody = document.getElementById('quiz-body');
    const submitBtn = document.getElementById('submit-btn');
    const modal = document.getElementById('result-modal');
    const resultTitle = document.getElementById('result-title');
    const resultScore = document.getElementById('result-score');
    const resultMessage = document.getElementById('result-message');
    const resultLinkContainer = document.getElementById('result-link-container');
    const closeBtn = document.getElementById('close-btn');
    
    // AI機能関連のDOM要素
    const aiExplanationSection = document.getElementById('ai-explanation-section');
    const incorrectQuestionsContainer = document.getElementById('incorrect-questions-container');
    const aiPlannerSection = document.getElementById('ai-planner-section');
    const createPlanBtn = document.getElementById('create-plan-btn');
    const plannerKeywords = document.getElementById('planner-keywords');
    const planResult = document.getElementById('plan-result');

    // --- Gemini API呼び出し関数 ---
    async function callGeminiAPI(prompt) {
        const apiKey = ""; // Canvas環境では不要
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else {
                console.error("Unexpected API response structure:", result);
                return "有効な回答をAIから取得できませんでした。";
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            throw error;
        }
    }

    // --- AI機能のロジック ---

    // AIにマナー解説を依頼する関数
    async function getAIExplanation(questionText, buttonElement, resultBox) {
        buttonElement.disabled = true;
        resultBox.innerHTML = '<p class="loading-text">AIが解説を生成中です...</p>';
        const prompt = `あなたは日本の「小樽」の観光を案内するプロのガイドです。以下のクイズで問われている観光マナーについて、なぜそれが大切なのか、観光客に親しみやすく、そして具体的に解説してください。\n\nクイズの内容：\n「${questionText}」`;
        
        try {
            const explanation = await callGeminiAPI(prompt);
            resultBox.innerHTML = explanation;
        } catch (error) {
            resultBox.innerHTML = '<p class="error-text">エラーが発生しました。しばらくしてからもう一度お試しください。</p>';
            buttonElement.disabled = false;
        }
    }

    // AIに観光プランを依頼する関数
    async function getAITourPlan() {
        const keywords = plannerKeywords.value.trim();
        if (!keywords) {
            alert("キーワードを入力してください。");
            return;
        }

        createPlanBtn.disabled = true;
        planResult.style.display = 'block';
        planResult.innerHTML = '<p class="loading-text">AIがあなただけのプランを作成中です...</p>';
        const prompt = `あなたは日本の「小樽」の観光を案内するプロのガイドです。以下のキーワードをすべて盛り込んで、具体的でユニークなショートトリッププランを提案してください。移動手段やおおよその所要時間も考慮に入れた、魅力的なプランを作成してください。\n\nキーワード：\n「${keywords}」`;

        try {
            const plan = await callGeminiAPI(prompt);
            planResult.innerHTML = plan;
        } catch (error) {
            planResult.innerHTML = '<p class="error-text">エラーが発生しました。しばらくしてからもう一度お試しください。</p>';
        } finally {
            createPlanBtn.disabled = false;
        }
    }

    // --- クイズのメインロジック ---

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

    function showResults() {
        let score = 0;
        const totalQuestions = quizData.length;
        const incorrectAnswers = [];

        for (let i = 0; i < totalQuestions; i++) {
            const selectedOption = document.querySelector(`input[name="question${i}"]:checked`);
            if (!selectedOption) {
                alert('すべての質問に回答してください。');
                return;
            }
        }

        quizData.forEach((data, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            if (selectedOption.value === data.answer) {
                score++;
            } else {
                incorrectAnswers.push(data);
            }
        });

        const percentage = Math.round((score / totalQuestions) * 100);
        const passThreshold = 80;

        // 結果表示エリアをリセット
        resultLinkContainer.innerHTML = '';
        incorrectQuestionsContainer.innerHTML = '';
        aiExplanationSection.style.display = 'none';
        aiPlannerSection.style.display = 'none';
        planResult.style.display = 'none';
        plannerKeywords.value = '';

        resultScore.textContent = `あなたの正解率： ${percentage}% (${totalQuestions}問中 ${score}問正解)`;

        if (percentage >= passThreshold) {
            // 合格時の処理
            resultTitle.textContent = '🎉 合格です！ 🎉';
            resultTitle.className = 'pass';
            resultMessage.textContent = 'おめでとうございます！あなたは小樽観光マナーマスターです。';
            
            // 合格者向け特典リンク
            const link = document.createElement('a');
            link.href = incentiveURL;
            link.textContent = '従来のプレゼントを受け取る';
            link.target = '_blank';
            resultLinkContainer.appendChild(link);

            // AI観光プランナーを表示
            aiPlannerSection.style.display = 'block';

        } else {
            // 不合格時の処理
            resultTitle.textContent = '😢 不合格です 😢';
            resultTitle.className = 'fail';
            resultMessage.textContent = '残念...！でも、大丈夫。間違えたマナーについて、AIに解説してもらいましょう！';
            
            // AI解説セクションを表示
            if (incorrectAnswers.length > 0) {
                aiExplanationSection.style.display = 'block';
                incorrectAnswers.forEach(incorrect => {
                    const incorrectDiv = document.createElement('div');
                    incorrectDiv.className = 'incorrect-question';
                    
                    const questionP = document.createElement('p');
                    questionP.textContent = incorrect.question;
                    
                    const explainBtn = document.createElement('button');
                    explainBtn.className = 'ai-explain-btn';
                    explainBtn.textContent = '✨ AIに解説してもらう';
                    
                    const resultBox = document.createElement('div');
                    resultBox.className = 'ai-result-box';
                    resultBox.style.display = 'none';
                    
                    explainBtn.addEventListener('click', () => {
                        resultBox.style.display = 'block';
                        getAIExplanation(incorrect.question, explainBtn, resultBox);
                    });
                    
                    incorrectDiv.appendChild(questionP);
                    incorrectDiv.appendChild(explainBtn);
                    incorrectDiv.appendChild(resultBox);
                    incorrectQuestionsContainer.appendChild(incorrectDiv);
                });
            }
        }

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('visible'), 10);
    }

    // イベントリスナーを設定
    submitBtn.addEventListener('click', showResults);
    createPlanBtn.addEventListener('click', getAITourPlan);
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.style.display = 'none', 300);
    });

    buildQuiz();
});
