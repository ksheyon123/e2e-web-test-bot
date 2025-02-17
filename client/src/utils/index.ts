// 타입 정의
type RGB = [number, number, number];
type ComponentType = "input" | "button" | "link" | "unknown";

interface Point {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface Region extends Point, Size {}

interface Component extends Region {
  type: ComponentType;
}

interface AnalyzedComponent extends Component {
  avgBrightness: number;
  blueRatio: number;
}

interface ImageContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  imageData: ImageData;
}

interface RegionMetrics {
  hasBlueText: boolean;
  hasBackground: boolean;
  borderDetected: boolean;
  aspectRatio: number;
}

interface PixelStats {
  avgBrightness: number;
  bluePixels: number;
  totalPixels: number;
}

interface DetectionOptions {
  normalize?: boolean;
  gridSize?: Point;
}

// 이미지 컨텍스트 생성
const createImageContext = (imageElement: HTMLImageElement): ImageContext => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  ctx.drawImage(imageElement, 0, 0);

  return {
    ctx,
    width: canvas.width,
    height: canvas.height,
    imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
  };
};

// 픽셀 데이터 가져오기
const getPixelData = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): RGB => {
  const pixelData = ctx.getImageData(x, y, 1, 1).data;
  return [pixelData[0], pixelData[1], pixelData[2]];
};

// 픽셀이 컴포넌트에 속하는지 판단
const isComponentPixel = ([r, g, b]: RGB): boolean => {
  const brightness = (r + g + b) / 3;
  return brightness < 250;
};

// 컴포넌트의 하단 경계 찾기
const findComponentBottom = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  height: number
): number => {
  const hasComponentPixelInRow = (y: number): boolean => {
    for (let x = startX; x < endX; x++) {
      if (isComponentPixel(getPixelData(ctx, x, y))) {
        return true;
      }
    }
    return false;
  };

  let y = startY;
  while (y < height && hasComponentPixelInRow(y)) {
    y++;
  }
  return y;
};

// 영역 분석
const analyzeRegion = (
  ctx: CanvasRenderingContext2D,
  region: Region
): RegionMetrics => {
  const { x, y, width, height } = region;
  const imageData = ctx.getImageData(x, y, width, height).data;

  const metrics = Array.from({ length: imageData.length / 4 }).reduce<
    Omit<RegionMetrics, "aspectRatio">
  >(
    (acc, _, i) => {
      const idx = i * 4;
      const [r, g, b] = [
        imageData[idx],
        imageData[idx + 1],
        imageData[idx + 2],
      ];

      return {
        hasBlueText: acc.hasBlueText || (b > r + 50 && b > g + 50),
        hasBackground: acc.hasBackground || r !== 255 || g !== 255 || b !== 255,
        borderDetected:
          acc.borderDetected ||
          ((idx < width * 4 || idx >= (height - 1) * width * 4) &&
            (r !== 255 || g !== 255 || b !== 255)),
      };
    },
    { hasBlueText: false, hasBackground: false, borderDetected: false }
  );

  return {
    ...metrics,
    aspectRatio: width / height,
  };
};

// 컴포넌트 타입 판별
const determineComponentType = (
  ctx: CanvasRenderingContext2D,
  region: Region
): ComponentType => {
  const metrics = analyzeRegion(ctx, region);

  if (metrics.aspectRatio > 3 && metrics.borderDetected) {
    return "input";
  }
  if (metrics.hasBackground && metrics.aspectRatio < 3) {
    return "button";
  }
  if (metrics.hasBlueText) {
    return "link";
  }
  return "unknown";
};

// 컴포넌트 탐지
const detectComponents = ({
  ctx,
  width,
  height,
}: ImageContext): Component[] => {
  const components: Component[] = [];
  let isSearching = false;
  let startX = 0,
    startY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelData = getPixelData(ctx, x, y);

      if (!isSearching && isComponentPixel(pixelData)) {
        isSearching = true;
        startX = x;
        startY = y;
        continue;
      }

      if (isSearching && !isComponentPixel(pixelData)) {
        const endX = x;
        const endY = findComponentBottom(ctx, startX, startY, endX, height);
        const region: Region = {
          x: startX,
          y: startY,
          width: endX - startX,
          height: endY - startY,
        };

        components.push({
          ...region,
          type: determineComponentType(ctx, region),
        });

        isSearching = false;
      }
    }
    isSearching = false;
  }

  return components;
};

// 픽셀 분포 분석
const analyzePixelDistribution = (
  components: Component[],
  ctx: CanvasRenderingContext2D
): AnalyzedComponent[] => {
  return components.map((component) => {
    const { x, y, width, height } = component;
    const imageData = ctx.getImageData(x, y, width, height).data;

    const pixelStats = Array.from({
      length: imageData.length / 4,
    }).reduce<PixelStats>(
      (acc, _, i) => {
        const idx = i * 4;
        const [r, g, b] = [
          imageData[idx],
          imageData[idx + 1],
          imageData[idx + 2],
        ];
        return {
          avgBrightness: acc.avgBrightness + (r + g + b) / 3,
          bluePixels: acc.bluePixels + (b > r + 50 && b > g + 50 ? 1 : 0),
          totalPixels: acc.totalPixels + 1,
        };
      },
      { avgBrightness: 0, bluePixels: 0, totalPixels: 0 }
    );

    return {
      ...component,
      avgBrightness: pixelStats.avgBrightness / pixelStats.totalPixels,
      blueRatio: pixelStats.bluePixels / pixelStats.totalPixels,
    };
  });
};

// 좌표 정규화
const normalizeCoordinates = (
  components: AnalyzedComponent[],
  gridSize: Point
): AnalyzedComponent[] => {
  return components.map((comp) => ({
    ...comp,
    x: Math.round(comp.x / gridSize.x) * gridSize.x,
    y: Math.round(comp.y / gridSize.y) * gridSize.y,
    width: Math.round(comp.width / gridSize.x) * gridSize.x,
    height: Math.round(comp.height / gridSize.y) * gridSize.y,
  }));
};

// 메인 함수
const detectUIComponents = async (
  imageElement: HTMLImageElement,
  options: DetectionOptions = {}
): Promise<AnalyzedComponent[]> => {
  try {
    const context = createImageContext(imageElement);
    const components = detectComponents(context);
    const analyzedComponents = analyzePixelDistribution(
      components,
      context.ctx
    );

    return options.normalize && options.gridSize
      ? normalizeCoordinates(analyzedComponents, options.gridSize)
      : analyzedComponents;
  } catch (error) {
    console.error("Error detecting UI components:", error);
    throw error;
  }
};

// 유틸리티 함수 - 에러 처리
const safeExecute = async <T>(
  fn: () => Promise<T>,
  errorMessage: string
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

// 사용 예시
export const findComponents = async (
  imageElement: HTMLImageElement,
  options: DetectionOptions = {}
): Promise<AnalyzedComponent[]> => {
  return safeExecute(
    () => detectUIComponents(imageElement, options),
    "Failed to detect UI components"
  );
};
