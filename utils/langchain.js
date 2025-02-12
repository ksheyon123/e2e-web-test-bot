const { ChatAnthropic } = require("@langchain/anthropic");
const { MessagesPlaceholder } = require("@langchain/core/prompts");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

const createModel = () => {
  console.log("Claude 모델 생성...");
  return new ChatAnthropic({
    cache: false,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    modelName: "claude-3-5-sonnet-20240620",
    temperature: 0.1,
  });
};

const createMessage = async (base64Image) => {
  console.log("Claude 요청 메세지 생성...");

  const systemPrompt = `당신은 웹 UI 테스트 자동화 전문가입니다. 1920x1080 해상도의 웹 페이지 스크린샷을 분석하여 다음 작업을 수행하세요:

0. 분석에 앞서 화면에 실제로 보이는 컴포넌트를 목록화합니다.

1. 분석 범위 및 주의사항 (엄격히 준수)
  A. 필수 준수사항
    - 화면에 실제로 보이는 컴포넌트만 분석에 포함
    - 각 컴포넌트는 반드시 다음 중 하나의 시각적 특징을 가져야 함:
      * 명확한 테두리(border)
      * 뚜렷한 배경색
      * 밑줄 또는 다른 텍스트와 구분되는 색상
    - 컴포넌트의 purpose는 실제 화면에 표시된 텍스트나 역할만 포함
    - 테스트 시나리오는 실제 보이는 기능에 대해서만 작성
  
  B. 엄격한 제외 대상
    - 화면에 없는 요소 절대 포함 금지
    - 일반적인 웹사이트 구조(검색, 네비게이션 등) 절대 가정 금지
    - 보이지 않는 상태나 기능 절대 추측 금지
    - 그리드나 여백 등 레이아웃 요소 절대 포함 금지

2. 뷰포트
 - 크기: 1920x1080px
 - 그리드: 40x40 (단위: 가로 48px, 세로 27px)
 - 좌표계: 좌상단 (0,0) 기준

3. 그리드 시스템
 3-1. 픽셀 눈금
   - X축: 0, 48, 96, 144, 192, 240, ..., 1872, 1920
   - Y축: 0, 27, 54, 81, 108, 135, ..., 1053, 1080
 
 3-2. 그리드 구조
   - 가로/세로 40등분
   - 격자 단위: 가로 48px, 세로 27px
   - 밝은 회색 선으로 표시
   - 축 좌표값: X축은 상단, Y축은 좌측에 표시

4. 분석 규칙
 - 추측되는 레이아웃 구조 제외
 - 보이지 않는 컨테이너 요소 제외
 - 일반적인 웹사이트 구조 요소(header, navigation 등) 가정 제외
 - 컴포넌트의 좌표(pixelCoord)는 좌상단에서 시작하여 격자선이 컴포넌트의 border와 처음 만나는 교차점

5. 컴포넌트 분석 항목
 - 유형 (Input, Button, Link, Dropdown 등)
 - 픽셀 좌표 (그리드 좌표 * 단위크기)
 - 크기 정보 
 - 용도 
 - 테스트 시나리오

6. 컴포넌트 식별 기준
  - border로 명확하게 구분된 input 필드
  - 배경색으로 구분되는 버튼
  - 밑줄이나 색상으로 구분되는 링크

7. 결과: (결과에 JSON 외에 다른 정보를 넣지 않는다.)
  {{
    "viewport": {{
      "width": 1920,
      "height": 1080,
      "gridSize": 40,
      "unitWidth": 48,
      "unitHeight": 27
    }},
    "elements": [
      {{
        "type": "요소 유형",
        "pixelCoord": {{
          "x": 0,
          "y": 0
        }},
        "size": {{
          "width": 0,
          "height": 0
        }},
        "purpose": "예상 목적",
        "testScenarios": ["테스트 시나리오 1", "테스트 시나리오 2"]
      }}
    ],
  }}

  1. 응답값에 JSON 만!!!!
  1. 응답값에 JSON 만!!!!
  1. 응답값에 JSON 만!!!!
  `;

  const humanPrompt = `다음 1920x1080 해상도의 웹 페이지 스크린샷을 분석하여 UI 컴포넌트들의 위치와 목록을 제공해주세요: {base64_image}`;

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", humanPrompt],
    new MessagesPlaceholder("chat_history"),
  ]);

  const formattedPrompt = await chatPrompt.formatMessages({
    base64_image: base64Image ? `data:image/jpeg;base64,${base64Image}` : "",
    chat_history: [],
  });

  return formattedPrompt;
};

const requestMessage = async (model, messages) => {
  try {
    console.log("요청 전송 중...");
    const response = await model.invoke(messages);

    try {
      const parsedResponse = JSON.parse(response.content);
      return parsedResponse;
    } catch (parseError) {
      console.warn("JSON 파싱 실패:", parseError);
      return response.content;
    }
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
};

module.exports = {
  createModel,
  createMessage,
  requestMessage,
};
