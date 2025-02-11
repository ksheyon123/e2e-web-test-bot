const { ChatAnthropic } = require("@langchain/anthropic");
const { MessagesPlaceholder } = require("@langchain/core/prompts");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

const createModel = () => {
  console.log("Claude 모델 생성...");
  return new ChatAnthropic({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    modelName: "claude-3-5-sonnet-20240620",
    temperature: 0,
  });
};

const createMessage = async (base64Image) => {
  console.log("Claude 요청 메세지 생성...");

  const systemPrompt = `
  
  당신은 웹 UI 테스트 자동화 전문가입니다. 1920x1080 해상도의 웹 페이지 스크린샷을 분석하여 다음 작업을 수행하세요:

  1. 기준점 정보:
    - criterion이라는 텍스트가 작성되어 있습니다.
    - 스크린샷 내 40x40 픽셀 크기의 기준 DOM 객체가 존재합니다
    - 이 기준 객체를 참조하여 다른 모든 UI 요소들의 상대적 위치를 추정하세요
    - 기준 객체의 픽셀 크기(40x40)를 스케일로 활용하여 다른 요소들의 위치를 측정하세요
    - 스크린샷의 요소들의 위치를 추정할 때, 기준점은 배제합니다.

  2. 페이지에서 발견된 모든 상호작용 가능한 UI 요소를 식별하고 분류합니다:
    - 입력 필드 (텍스트, 이메일, 비밀번호 등)
    - 버튼
    - 드롭다운 메뉴
    - 체크박스
    - 라디오 버튼
    - 링크
    - 기타 클릭 가능한 요소

  3. 뷰포트 정보:
    - 너비: 1920px
    - 높이: 1080px
    - 좌표계: 좌상단이 (0,0)

  4. 좌표 측정 방법:
    - 기준 DOM 객체(40x40)의 크기를 기준으로 위치 계산
    - 모든 좌표는 기준 객체의 크기를 바탕으로 절대 픽셀값으로 표시

  5. 결과는 다음 JSON 형식으로 구조화하여 제공하세요:

    {{
      "viewport": {{
        "width": 1920,
        "height": 1080
      }},
      "referenceElement": {{
        "size": {{
          "width": 40,
          "height": 40
        }},
        "position": {{
          "x": 0,
          "y": 0
        }}
      }},
      "elements": [
        {{
          "type": "요소 유형",
          "coord": {{
            "x": 0,
            "y": 0
          }},
          "purpose": "예상 목적",
          "testScenarios": ["테스트 시나리오 1", "테스트 시나리오 2"]
        }}
      ]
    }}

  6. 좌표 추정 시 다음을 고려하세요:
    - 기준 DOM 객체(40x40)와의 상대적 거리
    - 일반적인 웹 디자인 패턴
    - 요소들 간의 상대적 위치
    - 여백과 정렬
    - 컴포넌트의 표준 크기

  JSON 형식으로만 응답하세요.`;

  const humanPrompt = `다음 1920x1080 해상도의 웹 페이지 스크린샷을 분석하여 40x40 기준 DOM 객체를 참조한 UI 요소들의 위치와 목록을 제공해주세요: {base64_image}`;

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
