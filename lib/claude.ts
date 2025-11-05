import Anthropic from '@anthropic-ai/sdk'

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error(
    'ANTHROPIC_API_KEY is not set. Please set it in your environment variables.'
  )
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface ThemeRecommendation {
  concept: string
  score: number
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  typography: {
    title: {
      font: string
      size: string
      letterSpacing: string
      lineHeight: string
    }
    subtitle: {
      font: string
      size: string
      letterSpacing: string
    }
    body: {
      font: string
      size: string
    }
  }
  layout: {
    structure: string
    padding: string
    alignment: string
  }
  visuals: {
    imageStyle: string
    graphics: string
    effects: string
  }
  mood: string
}

export async function getThemeRecommendations(
  purpose: string,
  keywords: string,
  mood: string,
  existingThemes: ThemeRecommendation[] = []
) {
  const prompt = `
You are a senior web designer specializing in the Korean education industry with 10+ years of experience. You have deep knowledge of design patterns used by major Korean education platforms like Hunet, Kyung Young, Mega Academy, Withus, Seoul Digital, and Baeoom.

Based on the following information, recommend SIX diverse and creative banner design themes with varied color palettes:
- Purpose: ${purpose}
- Keywords: ${keywords}
- Mood: ${mood}
${existingThemes.length > 0 ? `\n\n**IMPORTANT: Avoid duplicating these existing themes:**\n${existingThemes.map((t, i) => `${i + 1}. ${t.concept} (Colors: ${t.colors.primary}, ${t.colors.secondary}, ${t.colors.accent})`).join('\n')}\n\nGenerate COMPLETELY DIFFERENT themes with unique color palettes and concepts.` : ''}

Analyze successful Korean education banner patterns and provide comprehensive design guides that can be directly used by designers. 

**IMPORTANT: Color Diversity Requirements:**
- DO NOT limit colors to only Navy/Blue + Orange/Gold combinations
- Explore diverse color palettes including:
  * Modern gradients (purple-pink, teal-cyan, coral-peach)
  * Earth tones (brown-beige, olive-sage, terracotta)
  * Vibrant combinations (magenta-cyan, yellow-lime, red-orange)
  * Monochrome variations (grayscale, sepia, duotone)
  * Pastel palettes (soft pink-lavender, mint-sky, peach-cream)
  * Bold contrasts (black-white, deep purple-gold, navy-coral)
- Each theme should have a UNIQUE color palette that stands out from others
- Consider color psychology: trust (blues), energy (oranges/reds), growth (greens), creativity (purples), warmth (yellows/peaches)

Provide the response in JSON format with a "themes" array. Each theme must include:

1. **concept** (string, Korean): 2-3 sentences describing the design direction
2. **score** (number, 0-100): How well this theme matches the requirements
3. **colors** (object): Specific hex codes with usage
   - primary: Main color (backgrounds, large blocks)
   - secondary: Supporting color (gradients, secondary elements)
   - accent: Highlight color (buttons, emphasis)
   - background: Background color
   - text: Main text color
4. **typography** (object): Complete font system
   - title: { font, size, letterSpacing, lineHeight }
   - subtitle: { font, size, letterSpacing }
   - body: { font, size }
5. **layout** (object): Structure guidelines
   - structure: Detailed layout description
   - padding: Spacing values
   - alignment: Alignment strategy
6. **visuals** (object): Visual element guidelines
   - imageStyle: Type of images to use
   - graphics: Graphic elements and icons
   - effects: Visual effects (shadows, gradients, etc.)
7. **mood** (string, Korean): 2-3 sentences about emotional tone

Korean education banner design patterns to reference:
- Color: While Navy/Blue (#0269cc, #5064c8) + Orange/Gold (#ff6465, #ffd800) is common, EXPLORE diverse palettes beyond this
- Fonts: Pretendard Bold 48-60px for titles, Medium 28-32px for subtitles, Regular 14-16px for body
- Layout: Left text (60%) + Right image (40%), generous padding (30-40px), or center-aligned, or asymmetric layouts
- Visuals: Real photos (classroom, students) + minimal icons + certificate badges, or illustrations, or abstract graphics
- Tone: Professional yet approachable, trustworthy yet warm, or modern and dynamic, or elegant and sophisticated

**All Korean text fields (concept, mood, and string values in objects) must be in Korean.**

Example format:
{
  "themes": [
    {
      "concept": "신뢰감 있는 전문 교육 기관 이미지 - 안정적이면서도 혁신적인 학습 경험을 강조합니다.",
      "score": 92,
      "colors": {
        "primary": "#0269cc",
        "secondary": "#5064c8",
        "accent": "#ff6465",
        "background": "#ffffff",
        "text": "#333333"
      },
      "typography": {
        "title": {
          "font": "Pretendard Bold",
          "size": "52px",
          "letterSpacing": "-1px",
          "lineHeight": "1.3"
        },
        "subtitle": {
          "font": "Pretendard Medium",
          "size": "28px",
          "letterSpacing": "-0.5px"
        },
        "body": {
          "font": "Pretendard Regular",
          "size": "16px"
        }
      },
      "layout": {
        "structure": "좌측 텍스트 블록(60%) + 우측 이미지 영역(40%), 중앙 정렬",
        "padding": "40px",
        "alignment": "좌측 정렬 텍스트, 전체 중앙 배치"
      },
      "visuals": {
        "imageStyle": "실사 이미지 (강의실 장면 또는 학습하는 학생들)",
        "graphics": "미니멀한 아이콘 + 자격증 배지 그래픽",
        "effects": "부드러운 그라데이션 오버레이, 미세한 그림자 효과"
      },
      "mood": "전문적이면서도 접근 가능한 분위기. 제도권 교육기관의 안정감과 현대적 학습 경험의 균형을 유지합니다."
    }
  ]
}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 3096,
      messages: [{ role: 'user', content: prompt }],
    })

    // Extract the JSON string from the response
    if (
      !response.content ||
      response.content.length === 0 ||
      response.content[0].type !== 'text'
    ) {
      throw new Error('Invalid response from AI: No text content found')
    }
    const responseText = response.content[0].text
    const jsonMatch = responseText.match(
      /```json\s*([\s\S]*?)\s*```|({[\s\S]*})/
    )
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI')
    }
    const jsonString = jsonMatch[1] || jsonMatch[2]

    const parsedResponse = JSON.parse(jsonString)
    return parsedResponse.themes
  } catch (error) {
    console.error('Error getting theme recommendations:', error)
    return []
  }
}

export async function generateLayout(
  theme: ThemeRecommendation,
  size: { width: number; height: number },
  textLines: string[],
  hasImage: boolean,
  imageType: string
) {
  const prompt = `
You are a senior web designer specializing in the Korean education industry. Generate a detailed, production-ready banner layout specification in Markdown format.

**Design Theme Guidelines:**
${JSON.stringify(theme, null, 2)}

**Banner Specifications:**
- Size: ${size.width}x${
    size.height
  }px (CRITICAL: All font sizes, spacing, and element sizes MUST be scaled proportionally to this banner size)
- Text Content: ${textLines.join('\n')}
- Image: ${hasImage ? `Yes, type: ${imageType}` : 'No'}

**IMPORTANT: Banner Size Scaling Rules:**
- Calculate scale factor: base size is 1200x628px
- For ${size.width}x${size.height}px banner, scale factor is approximately ${(
    size.width / 1200
  ).toFixed(2)}x
- ALL font sizes must be multiplied by this scale factor
- ALL spacing (padding, margins) must be multiplied by this scale factor
- ALL element sizes (icons, graphics) must be multiplied by this scale factor
- Example: If base font size is 52px and scale factor is 1.5x, use 78px
- Example: If base padding is 40px and scale factor is 0.8x, use 32px

**Your Task:**
Create a comprehensive layout specification that STRICTLY FOLLOWS the theme's design system AND the banner size. The output must be in Korean and include:

1. **배경 (Background)**
   - Use the theme's primary and secondary colors
   - Specify gradient type, angles, or solid color
   - Consider the theme's visual effects

2. **그래픽 요소 (Graphic Elements)**
   - Follow the theme's visual guidelines (imageStyle, graphics)
   - Include at least 2 graphic elements:
     * One relevant icon/logo based on keywords
     * One decorative element (shape, pattern) using accent color
   - Specify exact position (X%, Y%), size, color, rotation, opacity, shadows

3. **텍스트 요소 (Text Elements)**
   - **Intelligently determine text hierarchy** from the provided lines
   - Apply the theme's typography system:
     * Title: Use theme.typography.title specifications
     * Subtitle: Use theme.typography.subtitle specifications
     * Body: Use theme.typography.body specifications
   - For each text element, specify:
     * Exact content in quotes
     * Position (X%, Y%)
     * Font, size, letter-spacing, line-height (from theme)
     * Color (from theme.colors)
     * Any effects (shadows, opacity)

4. **여백 및 정렬 (Spacing & Alignment)**
   - Follow theme.layout guidelines
   - Specify padding values
   - Describe alignment strategy

**Korean Education Banner Best Practices:**
- Left-align major text blocks with generous left padding (8-12% of banner width)
- Place primary CTA or image on the right (60-80% X position)
- Vertical spacing: Title at 20-25% Y, subtitle at 35-40% Y, body at 50-55% Y
- Use theme colors consistently throughout
- Ensure readability with sufficient contrast
- **CRITICAL: All measurements must be calculated based on the actual banner size (${
    size.width
  }x${size.height}px), not fixed pixel values**

**Output Format (in Korean):**
## 디자인 컨셉
[Brief summary of the theme concept]

### 배경
- 타입: [gradient/solid]
- 색상: [colors with hex codes]
- 각도: [if gradient]

### 그래픽 요소

**[Element Name 1]**
- 위치: (X: [%], Y: [%])
- 크기: [px] x [px]
- 색상: [hex]
- 효과: [shadows, rotation, opacity]

**[Element Name 2]**
- ...

### 텍스트 요소

**[Hierarchy Level] "[Actual Text Content]"**
- 위치: (X: [%], Y: [%])
- 폰트: [from theme] [size]
- 자간: [letterSpacing]
- 행간: [lineHeight if title]
- 색상: [hex]
- 효과: [if any]

[Repeat for each text line]

### 레이아웃 구조
- 전체 구조: [describe layout]
- 여백: [padding values]
- 정렬: [alignment]

### 전체 무드
[Describe overall visual mood based on theme]`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 3096,
      messages: [{ role: 'user', content: prompt }],
    })

    if (
      !response.content ||
      response.content.length === 0 ||
      response.content[0].type !== 'text'
    ) {
      console.error(
        'Error generating layout: No text content found in response'
      )
      return 'Error generating layout: No text content found.'
    }
    return response.content[0].text
  } catch (error) {
    console.error('Error generating layout:', error)
    return 'Error generating layout.'
  }
}
