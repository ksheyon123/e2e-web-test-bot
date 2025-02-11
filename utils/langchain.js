const { ChatAnthropic } = require("@langchain/anthropic");
const { MessagesPlaceholder } = require("@langchain/core/prompts");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

const createModel = () => {
  console.log("Claude 모델 생성...");
  return new ChatAnthropic({
    cache: false,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    modelName: "claude-3-5-sonnet-20240620",
    temperature: 0,
  });
};

const createMessage = async (base64Image) => {
  console.log("Claude 요청 메세지 생성...");

  const systemPrompt = `당신은 웹 UI 테스트 자동화 전문가입니다. 1920x1080 해상도의 웹 페이지 스크린샷을 분석하여 다음 작업을 수행하세요:

1. 뷰포트 정보:
  - 너비: 1920px (48px * 40 섹션)
  - 높이: 1080px (27px * 40 섹션)
  - 스케일: 1
  - 좌표계: 좌상단이 (0,0)

2. 그리드 기반 레이아웃 분석:
  2-1. 기본 그리드 구조:
    - 40x40 그리드 (가로 48px, 세로 27px 단위)
    - 가로 섹션: 각 48px (1920/40)
    - 세로 섹션: 각 27px (1080/40)
    - 섹션 번호는 0부터 시작 (예: 섹션[0,0]은 좌상단 첫 번째 섹션)
    - 가로 세로 섹션은 각각 40개 (섹션번호 : [0, 0] ~ [40, 40])

  2-2. 그리드 좌표 매핑:
    - 각 UI 컴포넌트의 그리드 좌표 (예: [20,15]는 가로 20번째, 세로 15번째 섹션)
    - 컴포넌트가 차지하는 그리드 섹션 범위
    - 그리드 내 정렬 (시작, 중앙, 끝)

  2-3. 컴포넌트 상세 정보:
    - 컴포넌트 유형
    - 시작 그리드 좌표 [x,y]
    - 차지하는 그리드 섹션 수 [width,height]
    - 픽셀 좌표 (그리드 좌표 * 단위크기)
    - 섹션 내 상대적 위치 (오프셋)

  2-4. 레이아웃 패턴 분석:
    - 수평/수직 정렬 패턴
    - 컴포넌트 간 그리드 간격
    - 그리드 섹션 활용 패턴

3. UI 컴포넌트 분류:
  3-1. 입력 요소 (Input, Textarea 등):
    - 텍스트 입력: 그리드 위치 및 크기
    - 비밀번호 입력: 그리드 위치 및 크기
  3-2. 컨트롤 요소 (Button, Link 등):
    - 버튼: 그리드 위치 및 크기
    - 링크: 그리드 위치 및 크기

4. JSON 결과:
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
        "gridPosition": {{
          "x": 0,
          "y": 0
        }},
        "gridSpan": {{
          "width": 0,
          "height": 0
        }},
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
    "layoutPattern": {{
      "alignment": "정렬 패턴",
      "spacing": "컴포넌트 간 그리드 간격",
      "distribution": "그리드 섹션 활용 방식"
    }}
  }}

  1. 문자열이 아닌 JSON 객체로 직접 응답하세요.
  2. 이스케이프된 문자나 줄바꿈 문자를 포함하지 마세요.`;

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
