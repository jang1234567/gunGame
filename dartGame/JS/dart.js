window.onload = function() {
    const resultDisplay = document.getElementById('resultDisplay'); // 결과 표시 
    const scoreChartElement = document.getElementById('scoreChart'); // 차트 
    const scoreBoard = document.querySelector('.scoreBoard'); // 스코어보드 판

    let scores = [];
    let attempts = 0;
    const maxAttempts = 5; // 최대 기회

    // 점수 계산 함수
    function calculateScore(x, y) {
        const distance = Math.sqrt(x * x + y * y); // 중심으로부터의 거리 계산

        // 점수 영역의 반지름 (반지름을 설정하여 각 영역을 정의)
        if (distance <= 50) return 5; // 반지름 100px 이하
        else if (distance <= 100) return 4; // 반지름 200px 이하
        else if (distance <= 175) return 3; // 반지름 300px 이하
        else if (distance <= 250) return 2; // 반지름 400px 이하
        else if (distance <= 325) return 1; // 반지름 400px 이하
        else return 0; // 그 외
    }

    // 좌표 계산 함수
    function getMousePosition(event) {
        const rect = scoreBoard.getBoundingClientRect(); // 스코어보드의 크기 및 위치
        const x = event.clientX - rect.left - rect.width / 2; // 스코어보드 중앙을 (0, 0)으로 변환
        const y = rect.height / 2 - (event.clientY - rect.top); // 스코어보드 중앙을 (0, 0)으로 변환
        return { x, y };
    }

    // 클릭 이벤트 핸들러
    scoreBoard.addEventListener('click', function(event) {
        if (attempts < maxAttempts) {
            const { x, y } = getMousePosition(event); // 클릭한 좌표 얻기
            const points = calculateScore(x, y); // 점수 계산
            updateScore(points); // 점수 업데이트
            resultDisplay.innerHTML += `<br>클릭 좌표: (${x.toFixed(2)}, ${y.toFixed(2)})`; // 좌표 표시

            // 클릭 위치에 마커 추가
            addClickMarker(event);
        }
    });

    // 클릭 위치에 마커를 추가하는 함수
    function addClickMarker(event) {
        const marker = document.createElement('div');
        marker.className = 'click-marker';

        const rect = scoreBoard.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        marker.style.left = `${x - 5}px`; // 마커의 중심을 클릭 위치에 맞추기 위해 offset 조정
        marker.style.top = `${y - 5}px`;

        scoreBoard.appendChild(marker);
    }

    // 점수 업데이트 함수
    function updateScore(points) {
        if (attempts < maxAttempts) { // 기회가 있을 경우
            scores.push(points); // 점수를 배열에 저장
            attempts++; // 시도 횟수 증가

            let message = (points >= 3) ? '합격' : '불합격'; // 합/불 여부 결정
            resultDisplay.innerHTML = `점수 : ${points}<br> 누적: ${scores}<br> 결과 : ${message}<br>기회 : ${attempts}/${maxAttempts}<br>`;

            // 차트 업데이트: 새로운 라벨(시도 횟수)과 데이터(점수) 추가
            scoreChart.data.labels.push(`시도 ${attempts}`);
            scoreChart.data.datasets[0].data.push(points); // 현재 점수를 추가
            scoreChart.update(); // 차트 업데이트

            // 평균 점수 계산
            const averageScore = (scores.reduce((a, b) => a + b, 0) / attempts).toFixed(2);

            // 평균 점수를 빨간 선으로 추가
            if (attempts === maxAttempts) {
                resultDisplay.innerHTML += `<br>총 점수 : ${scores.reduce((a, b) => a + b, 0)}, 평균 점수 : ${averageScore}`;

                // 평균 점수 라인을 추가
                scoreChart.options.plugins.annotation.annotations.push({
                    type: 'line',
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        content: `평균: ${averageScore}`,
                        enabled: true,
                        position: 'end'
                    },
                    scaleID: 'y',
                    value: averageScore,
                    borderDash: [10, 5]
                });

                scoreChart.update(); // 차트 업데이트
            }
        } else {
            resultDisplay.innerHTML = `모든 기회를 다 사용했습니다!<br><br>총 점수 : ${scores.reduce((a, b) => a + b, 0)}<br> 평균 점수 : ${(scores.reduce((a, b) => a + b, 0) / maxAttempts).toFixed(2)}`;
        }
        
        // 값 출력하기
        console.log(`기회 : ${attempts}/${maxAttempts}`);
        console.log('점수 배열 : ', scores);
    }

    // Chart.js를 이용한 라인 차트 초기화
    const scoreChart = new Chart(scoreChartElement, {
        type: 'line',
        data: {
            labels: [], // 시도 횟수
            datasets: [{
                label: '각 시도에서의 점수',
                data: [], // 각 시도에서의 점수 데이터 저장
                borderColor: 'blue',
                fill: false,
                tension: 0
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '시도 횟수'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '점수'
                    },
                    beginAtZero: true,
                    min: 1, // y축 최소값 설정
                    max: 5, // y축 최대값 설정
                    stepSize: 1 // y축 간격을 1단위로 설정
                }
            },
            plugins: {
                annotation: {
                    annotations: []
                }
            }
        }
    });
};
