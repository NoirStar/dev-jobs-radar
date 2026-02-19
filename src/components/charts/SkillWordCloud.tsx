import { Cloud } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { MOCK_WORDCLOUD } from '@/data/chartMockData'
import { useMemo } from 'react'

const CATEGORY_COLORS: Record<string, string> = {
  language: '#3b82f6',
  framework: '#10b981',
  infra: '#f59e0b',
  cloud: '#8b5cf6',
  database: '#ef4444',
  runtime: '#06b6d4',
  api: '#ec4899',
}

/** ⑩ 기술 워드클라우드 — SVG 기반 */
export function SkillWordCloud() {
  const words = useMemo(() => {
    const sorted = [...MOCK_WORDCLOUD.words].sort((a, b) => b.value - a.value)
    const maxVal = sorted[0]?.value ?? 1
    const minFont = 12
    const maxFont = 40

    // 간단한 그리드 배치
    return sorted.map((w, i) => {
      const fontSize = minFont + ((w.value / maxVal) * (maxFont - minFont))
      return {
        ...w,
        fontSize,
        color: CATEGORY_COLORS[w.category] ?? '#888',
        rotation: i % 5 === 0 ? -15 : i % 7 === 0 ? 15 : 0,
      }
    })
  }, [])

  return (
    <ChartContainer
      title="기술 워드클라우드"
      icon={<Cloud className="size-4 text-sky-500" />}
      description="채용공고에서 가장 많이 언급된 기술 키워드"
    >
      <div className="flex min-h-[260px] flex-wrap items-center justify-center gap-x-3 gap-y-1 py-4">
        {words.map((w) => (
          <span
            key={w.text}
            className="cursor-default transition-transform hover:scale-110"
            style={{
              fontSize: `${w.fontSize}px`,
              color: w.color,
              fontWeight: w.fontSize > 24 ? 700 : 500,
              transform: `rotate(${w.rotation}deg)`,
              lineHeight: 1.2,
            }}
            title={`${w.text}: ${w.value}개 공고`}
          >
            {w.text}
          </span>
        ))}
      </div>

      {/* 카테고리 범례 */}
      <div className="flex flex-wrap justify-center gap-3 text-[10px] text-muted-foreground">
        {Object.entries(CATEGORY_COLORS).map(([key, color]) => (
          <span key={key} className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full" style={{ backgroundColor: color }} />
            {key}
          </span>
        ))}
      </div>
    </ChartContainer>
  )
}
