import { Share2 } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { MOCK_NETWORK } from '@/data/chartMockData'
import { useMemo, useState } from 'react'

const GROUP_COLORS: Record<string, string> = {
  frontend: '#3b82f6',
  backend: '#10b981',
  infra: '#f59e0b',
}

/** 간단한 원형 레이아웃 (force simulation 대체) */
function computeLayout(nodes: typeof MOCK_NETWORK.nodes) {
  const cx = 300
  const cy = 180
  const radius = 130
  return nodes.map((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2
    return {
      ...n,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  })
}

/** ⑦ 기술 조합 네트워크 그래프 — SVG Circular Layout */
export function SkillNetworkGraph() {
  const [hovered, setHovered] = useState<string | null>(null)

  const positioned = useMemo(() => computeLayout(MOCK_NETWORK.nodes), [])
  const posMap = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>()
    for (const n of positioned) m.set(n.id, { x: n.x, y: n.y })
    return m
  }, [positioned])

  const maxSize = useMemo(() => Math.max(...MOCK_NETWORK.nodes.map((n) => n.size)), [])

  return (
    <ChartContainer
      title="기술 조합 네트워크"
      icon={<Share2 className="size-4 text-amber-500" />}
      description="채용공고에서 함께 요구되는 기술의 동시 출현 관계"
    >
      <svg viewBox="0 0 600 360" className="w-full" role="img" aria-label="기술 조합 네트워크 그래프">
        {/* 링크 */}
        {MOCK_NETWORK.links.map((link) => {
          const s = posMap.get(link.source)
          const t = posMap.get(link.target)
          if (!s || !t) return null
          const active =
            hovered === null || hovered === link.source || hovered === link.target
          return (
            <line
              key={`${link.source}-${link.target}`}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke={active ? '#888' : '#333'}
              strokeWidth={link.strength * 3}
              opacity={active ? 0.5 : 0.08}
              className="transition-opacity"
            />
          )
        })}

        {/* 노드 */}
        {positioned.map((node) => {
          const r = 10 + (node.size / maxSize) * 18
          const color = GROUP_COLORS[node.group] ?? '#888'
          const active = hovered === null || hovered === node.id
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
              opacity={active ? 1 : 0.2}
            >
              <circle cx={node.x} cy={node.y} r={r} fill={color} opacity={0.8} />
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-white text-[9px] font-semibold"
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + r + 12}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {node.size}건
              </text>
            </g>
          )
        })}
      </svg>

      {/* 그룹 범례 */}
      <div className="flex justify-center gap-4 text-[10px] text-muted-foreground">
        {Object.entries(GROUP_COLORS).map(([key, color]) => (
          <span key={key} className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full" style={{ backgroundColor: color }} />
            {key === 'frontend' ? '프론트엔드' : key === 'backend' ? '백엔드' : '인프라'}
          </span>
        ))}
      </div>
    </ChartContainer>
  )
}
