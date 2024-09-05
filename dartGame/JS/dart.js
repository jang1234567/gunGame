// import Chart from './../lib/node_modules/chart.js/auto';

window.onload = function () {
  const resultDisplay = document.getElementById("resultDisplay"); // 결과 표시
  const scoreChartElement = document.getElementById("scoreChart"); // 차트
  const scoreBoard = document.querySelector(".scoreBoard"); // 스코어보드 판
  const tryLengthTable = document.querySelector(".tryLength table tbody tr"); // 표의 행
  const closeModal = document.querySelector(".closeModal");

  let scores = [];
  let attempts = 0;
  const maxAttempts = 10; // 최대 기회

  // 점수 계산 함수
  function calculateScore(x, y) {
    const distance = Math.sqrt(x * x + y * y); // 중심으로부터의 거리 계산

    // 점수 영역의 반지름 (반지름을 설정하여 각 영역을 정의)
    if (distance <= 42.5) return 10; // 반지름 42.5px 이하 (10점)
    else if (distance <= 85) return 9; // 반지름 85px 이하 (9점)
    else if (distance <= 127.5) return 8; // 반지름 127.5px 이하 (8점)
    else if (distance <= 170) return 7; // 반지름 170px 이하 (7점)
    else if (distance <= 212.5) return 6; // 반지름 212.5px 이하 (6점)
    else if (distance <= 255) return 5; // 반지름 255px 이하 (5점)
    else if (distance <= 297.5) return 4; // 반지름 297.5px 이하 (4점)
    else if (distance <= 340) return 3; // 반지름 340px 이하 (3점)
    else if (distance <= 382.5) return 2; // 반지름 382.5px 이하 (2점)
    else if (distance <= 425) return 1; // 반지름 425px 이하 (1점)
    else return 0; // 그 외 (0점)
  }

  // 좌표 계산 함수
  function getMousePosition(event) {
    const rect = scoreBoard.getBoundingClientRect(); // 스코어보드의 크기 및 위치
    const x = event.clientX - rect.left - rect.width / 2; // 스코어보드 중앙을 (0, 0)으로 변환
    const y = rect.height / 2 - (event.clientY - rect.top); // 스코어보드 중앙을 (0, 0)으로 변환
    return { x, y };
  }

  // 클릭 이벤트 핸들러
  scoreBoard.addEventListener("click", function (event) {
    if (attempts < maxAttempts) {
      const { x, y } = getMousePosition(event); // 클릭한 좌표 얻기
      const points = calculateScore(x, y); // 점수 계산
      updateScore(points); // 점수 업데이트
      resultDisplay.innerHTML += `<br>클릭 좌표: (${x.toFixed(2)}, ${y.toFixed(
        2
      )})`; // 좌표 표시

      // 클릭 위치에 마커 추가
      addClickMarker(event);
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
      // 기회가 있을 경우
      scores.push(points); // 점수를 배열에 저장
      attempts++; // 시도 횟수 증가

      // 표에 값 업데이트
      tryLengthTable.children[attempts - 1].textContent = points;
      tryLengthTable.children[10].textContent = scores.reduce(
        (a, b) => a + b,
        0
      ); 
      // 총점
      tryLengthTable.children[11].textContent = (
        scores.reduce((a, b) => a + b, 0) / attempts
      ).toFixed(2); // 평균

      resultDisplay.innerHTML = `점수 : ${points}<br> 
        기회 : ${attempts}/${maxAttempts}<br>`;

      // 차트 업데이트: 새로운 라벨(시도 횟수)과 데이터(점수) 추가
      scoreChart.data.labels.push(`시도 ${attempts}`);
      scoreChart.data.datasets[0].data.push(points); // 현재 점수를 추가
      scoreChart.update(); // 차트 업데이트

      // 평균 점수 계산
      const averageScore = (
        scores.reduce((a, b) => a + b, 0) / attempts
      ).toFixed(2);

      let message =
        averageScore >= 5.0 ? "조준을 잘하시는군요!" : "연습이 매우 필요합니다"; // 합/불 여부 결정
      // 스타일 적용
      closeModal.style.fontSize = "1.5em"; // 폰트 크기 설정
      closeModal.style.fontWeight = "bold"; // 폰트 굵기 설정
      closeModal.style.color = "#ffffff"; // 텍스트 색상 설정
      closeModal.style.backgroundColor = "#ff5733"; // 배경색 설정
      closeModal.style.padding = "10px"; // 여백 설정
      closeModal.style.borderRadius = "5px"; // 모서리 둥글게 설정
      closeModal.style.border = "2px solid #c70039"; // 테두리 색상 설정
      closeModal.style.textAlign = "center"; // 텍스트 중앙 정렬 설정
      closeModal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)"; // 그림자 설정

      closeModal.innerHTML = `총 점수 : ${scores.reduce(
          (a, b) => a + b,0)}
          <br>평균점수 : ${averageScore}<br> 
         <span class="highLight-message">결과 : ${message}</span><br>`;

      // 평균 점수 라인을 추가
      if (attempts === maxAttempts) {
        resultDisplay.innerHTML += `<br>총 점수 : ${scores.reduce(
          (a, b) => a + b,
          0
        )}, 평균 점수 : ${averageScore}`;

        // 평균 점수 라인을 추가
        scoreChart.options.plugins.annotation.annotations.push({
          type: "line",
          borderColor: "red",
          borderWidth: 2,
          label: {
            content: `평균: ${averageScore}`,
            enabled: true,
            position: "end",
          },
          scaleID: "y",
          value: averageScore,
          borderDash: [10, 5],
        });

        scoreChart.update(); // 차트 업데이트
      }
    } else {
      resultDisplay.innerHTML = `모든 기회를 다 사용했습니다!<br><br>총 점수 : ${scores.reduce(
        (a, b) => a + b,
        0
      )}<br> 평균 점수 : ${(
        scores.reduce((a, b) => a + b, 0) / maxAttempts
      ).toFixed(2)}`;
    }

    // 값 출력하기
    console.log(`기회 : ${attempts}/${maxAttempts}`);
    console.log("점수 배열 : ", scores);
  }

  // Chart.js를 이용한 라인 차트 초기화
  const scoreChart = new Chart(scoreChartElement, {
    type: "line",
    data: {
      labels: [], // 시도 횟수
      datasets: [
        {
          label: "각 시도에서의 점수",
          data: [], // 각 시도에서의 점수 데이터 저장
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
          min: 0, // y축 최소값 설정
          max: 10, // y축 최대값 설정
          stepSize: 1, // y축 간격을 1단위로 설정
        },
      },
      plugins: {
        annotation: {
          annotations: [],
        },
      },
    },
  });
  const modalOpenButton = document.getElementById("modalOpenButton");
  const modalCloseButton = document.getElementById("modalCloseButton");
  const modal = document.getElementById("modalContainer");

  modalOpenButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  modalCloseButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
};
