import { GitBranch } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { useJobStore } from '@/stores/jobStore'
import { computeSankey } from '@/services/chartDataService'
import { useMemo, useState } from 'react'

const EXP_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
const SKILL_COLORS: Record<string, string> = {
  'sk-java': '#e76f00',
  'sk-python': '#3776ab',
  'sk-react': '#61dafb',
  'sk-spring': '#6db33f',
  'sk-k8s': '#326ce5',
  'sk-aws': '#ff9900',
  'sk-typescript': '#3178c6',
  'sk-docker': '#2496ed',
}

const WIDTH = 600
const HEIGHT = 300
const PAD = { top: 20, right: 100, bottom: 20, left: 100 }

/** ⑪ 경력별 기술 요구 Sankey — 간이 SVG 구현, jobStore 실시간 계산 */
export function ExperienceSankey() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const jobs = useJobStore((s) => s.jobs)
  const sankeyData = useMemo(() => computeSankey(jobs), [jobs])

  const { expNodes, skillNodes, links } = useMemo(() => {
    const exps = sankeyData.nodes.filter((n) => n.id.startsWith('exp-'))
    const skills = sankeyData.nodes.filter((n) => n.id.startsWith('sk-'))

    // 경력 노드 — y 위치
    const expTotals = exps.map((e) => ({
      ...e,
      total: sankeyData.links.filter((l) => l.source === e.id).reduce((s, l) => s + l.value, 0),
    }))
    const totalAll = expTotals.reduce((s, e) => s + e.total, 0) || 1
    const availH = HEIGHT - PAD.top - PAD.bottom
    let yAcc = PAD.top
    const expPos = expTotals.map((e, i) => {
      const h = Math.max((e.total / totalAll) * availH * 0.85, 8)
      const pos = { ...e, x: PAD.left, y: yAcc, h, color: EXP_COLORS[i % EXP_COLORS.length] }
      yAcc += h + 8
      return pos
    })

    // 스킬 노드 — y 위치
    const skillTotals = skills.map((s) => ({
      ...s,
      total: sankeyData.links.filter((l) => l.target === s.id).reduce((sum, l) => sum + l.value, 0),
    }))
    const skillTotalAll = skillTotals.reduce((s, sk) => s + sk.total, 0) || 1
    let yAcc2 = PAD.top
    const skillPos = skillTotals.map((s) => {
      const h = Math.max((s.total / skillTotalAll) * availH * 0.85, 8)
      const pos = { ...s, x: WIDTH - PAD.right, y: yAcc2, h, color: SKILL_COLORS[s.id] ?? '#888' }
      yAcc2 += h + 8
      return pos
    })

    // 링크 경로 계산
    const expOffsets = new Map<string, number>()
    const skillOffsets = new Map<string, number>()
    expPos.forEach((e) => expOffsets.set(e.id, 0))
    skillPos.forEach((s) => skillOffsets.set(s.id, 0))

    const linkPaths = sankeyData.links.map((l) => {
      const src = expPos.find((e) => e.id === l.source)
      const tgt = skillPos.find((s) => s.id === l.target)
      if (!src || !tgt) return null

      const srcOff = expOffsets.get(l.source) ?? 0
      const tgtOff = skillOffsets.get(l.target) ?? 0

      const srcRatio = l.value / (src.total || 1)
      const tgtRatio = l.value / (tgt.total || 1)
      const srcH = srcRatio * src.h
      const tgtH = tgtRatio * tgt.h

      const y1 = src.y + srcOff
      const y2 = tgt.y + tgtOff

      expOffsets.set(l.source, srcOff + srcH)
      skillOffsets.set(l.target, tgtOff + tgtH)

      const x1 = PAD.left + 14
      const x2 = WIDTH - PAD.right - 14
      const mx = (x1 + x2) / 2

      return {
        key: `${l.source}-${l.target}`,
        path: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}
               L ${x2} ${y2 + tgtH} C ${mx} ${y2 + tgtH}, ${mx} ${y1 + srcH}, ${x1} ${y1 + srcH} Z`,
        color: src.color,
        value: l.value,
        srcLabel: src.label,
        tgtLabel: tgt.label,
      }
    }).filter(Boolean) as Array<{ key: string; path: string; color: string; value: number; srcLabel: string; tgtLabel: string }>

    return { expNodes: expPos, skillNodes: skillPos, links: linkPaths }
  }, [sankeyData])

  return (
    <ChartContainer
      title="경력별 기술 요구 흐름"
      icon={<GitBranch className="size-4 text-violet-500" />}
      description="경력 구간별로 어떤 기술이 가장 많이 요구되는지"
    >
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="경력별 기술 요구 흐름 차트">
        {/* 링크 */}
        {links.map((l) => (
          <path
            key={l.key}
            d={l.path}
            fill={l.color}
            opacity={hoveredLink === null || hoveredLink === l.key ? 0.35 : 0.06}
            className="cursor-pointer transition-opacity"
            onMouseEnter={() => setHoveredLink(l.key)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <title>{`${l.srcLabel} → ${l.tgtLabel}: ${l.value}건`}</title>
          </path>
        ))}

        {/* 경력 노드 (좌) */}
        {expNodes.map((e) => (
          <g key={e.id}>
            <rect x={e.x - 14} y={e.y} width={14} height={e.h} rx={3} fill={e.color} />
            <text
              x={e.x - 20}
              y={e.y + e.h / 2}
              textAnchor="end"
              dominantBaseline="central"
              className="fill-foreground text-[9px] font-medium"
            >
              {e.label}
            </text>
          </g>
        ))}

        {/* 스킬 노드 (우) */}
        {skillNodes.map((s) => (
          <g key={s.id}>
            <rect x={s.x} y={s.y} width={14} height={s.h} rx={3} fill={s.color} />
            <text
              x={s.x + 20}
              y={s.y + s.h / 2}
              dominantBaseline="central"
              className="fill-foreground text-[9px] font-medium"
            >
              {s.label}
            </text>
          </g>
        ))}
      </svg>
    </ChartContainer>
  )
}
