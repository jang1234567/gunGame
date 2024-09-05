window.onload = function () {
  const scoreChartElement = document.getElementById("scoreChart"); // 차트
  const scoreBoard = document.querySelector(".scoreBoard"); // 스코어보드 판
  const tryLengthTable = document.querySelector(".tryLength table tbody tr"); // 표의 행

  // 새로 추가된 요소들
  const score = document.getElementById("score");
  const chance = document.getElementById("chance");
  const totalScore = document.getElementById("totalScore");
  const averageScore = document.getElementById("averageScore");
  const resultDisplay = document.getElementById("resultDisplay");

    // 좌표 표시 요소
    const xSpan = document.getElementById("x");
    const ySpan = document.getElementById("y");

  let scores = [];
  let attempts = 0;
  const maxAttempts = 10; // 최대 기회

  // 점수 계산 함수
  function calculateScore(x, y) {
    const distance = Math.sqrt(x * x + y * y); // 중심으로부터의 거리 계산
    if (distance <= 32.5) return 10;
    else if (distance <= 65) return 9;
    else if (distance <= 97.5) return 8;
    else if (distance <= 130) return 7;
    else if (distance <= 162.5) return 6;
    else if (distance <= 195) return 5;
    else if (distance <= 227.5) return 4;
    else if (distance <= 260) return 3;
    else if (distance <= 292.5) return 2;
    else if (distance <= 325) return 1;
    else return 0;
  }

 // 좌표 계산 함수
function getMousePosition(event) {
  const rect = scoreBoard.getBoundingClientRect(); // 스코어보드의 크기 및 위치
  const x = event.clientX - rect.left - rect.width / 2; // 스코어보드 중앙을 (0, 0)으로 변환
  const y = rect.height / 2 - (event.clientY - rect.top); // 스코어보드 중앙을 (0, 0)으로 변환
  
  // 좌표를 콘솔에 출력
  console.log(`Mouse Position - X: ${x}, Y: ${y}`);
  
  return { x, y };
}


  // 클릭 이벤트 핸들러
  scoreBoard.addEventListener("click", function (event) {
    if (attempts < maxAttempts) {
      const { x, y } = getMousePosition(event);
      const points = calculateScore(x, y);
      updateScore(points);
      addClickMarker(event); // 클릭 위치에 마커 추가

       // 좌표 표시 업데이트
       xSpan.textContent = x.toFixed(2);
       ySpan.textContent = y.toFixed(2);
    }
  });

  // 클릭 위치에 마커를 추가하는 함수
  function addClickMarker(event) {
    const marker = document.createElement("div");
    marker.className = "click-marker";

    const rect = scoreBoard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    marker.style.left = `${x - 5}px`; // 마커의 중심을 클릭 위치에 맞추기 위해 offset 조정
    marker.style.top = `${y - 5}px`;
    marker.style.width = "20px";
    marker.style.height = "20px";
    marker.style.backgroundColor =
      "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(34,34,34,1) 30%, rgba(0,0,0,0) 100%)"; // 총알자국의 그라데이션 효과
    marker.style.border = "solid 3px rgba(255,255,255,0.5)"; // 반투명한 하얀색 테두리
    marker.style.boxShadow =
      "0 0 15px rgba(255,255,255,0.8), inset 0 0 10px rgba(0,0,0,0.7)"; // 외부 및 내부 그림자 효과
    marker.style.borderRadius = "50%";
    marker.style.transform = `rotate(${Math.random() * 360}deg)`; // 임의의 회전 효과

    scoreBoard.appendChild(marker);
  }

  // 점수 업데이트 함수
  function updateScore(points) {
    if (attempts < maxAttempts) {
      scores.push(points);
      attempts++;

      // 표에 값 업데이트 및 색상 변경
      tryLengthTable.children[attempts - 1].textContent = points;
      tryLengthTable.children[attempts - 1].style.color = "yellow"; // 시도한 점수의 텍스트 색상 변경

      tryLengthTable.children[10].textContent = scores.reduce((a, b) => a + b, 0);
      tryLengthTable.children[10].style.color = "yellow"; // 총점의 텍스트 색상 변경

      tryLengthTable.children[11].textContent = (
        scores.reduce((a, b) => a + b, 0) / attempts
      ).toFixed(2);
      tryLengthTable.children[11].style.color = "yellow"; // 평균 점수의 텍스트 색상 변경

      // 차트 업데이트
      scoreChart.data.labels.push(`시도 ${attempts}`);
      scoreChart.data.datasets[0].data.push(points);
      scoreChart.update();

      // 평균 점수 계산
      const total = scores.reduce((a, b) => a + b, 0);
      const average = (total / attempts).toFixed(2);

      // HTML 요소들에 값 업데이트
      score.textContent = `${points}`;
      chance.textContent = `${attempts}/${maxAttempts}`;
      totalScore.textContent = `${total}`;
      averageScore.textContent = `${average}`;

     // 평균 점수 라인을 추가
    if (attempts === maxAttempts) {
      scoreChart.options.plugins.annotation.annotations.push({
        type: "line",
        borderColor: "red",
        borderWidth: 2,
        label: {
          content: `평균: ${average}`,
          enabled: true,
          position: "end",
          backgroundColor: "rgba(255,0,0,0.75)",
          color: "white",
        },
        scaleID: "y",
        value: average,
        borderDash: [10, 5], // 점선 스타일
      });

      scoreChart.update(); // 차트 업데이트
    }}

    // 값 출력하기
    console.log(`기회 : ${attempts}/${maxAttempts}`);
    console.log("점수 배열 : ", scores);
  }

  // Chart.js를 이용한 라인 차트 초기화
  const scoreChart = new Chart(scoreChartElement, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "각 시도에서의 점수",
          data: [],
          borderColor: "blue",
          fill: false,
          tension: 0,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "시도 횟수",
          },
        },
        y: {
          title: {
            display: true,
            text: "점수",
          },
          beginAtZero: true,
          min: 0,
          max: 10,
          stepSize: 1,
        },
      },
      plugins: {
        annotation: {
          annotations: [],
        },
      },
    },
  });
};
