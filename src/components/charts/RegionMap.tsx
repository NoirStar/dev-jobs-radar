import { MapPin } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { MOCK_REGION_MAP } from '@/data/chartMockData'
import { useMemo, useState } from 'react'

/** 보정된 SVG 좌표 변환 (경위도 → SVG 위치) */
function project(coords: [number, number]): [number, number] {
  const [lng, lat] = coords
  const x = ((lng - 124.5) / (131 - 124.5)) * 500 + 50
  const y = ((38.5 - lat) / (38.5 - 33)) * 380 + 20
  return [x, y]
}

function bubbleRadius(value: number, max: number): number {
  return 8 + (value / max) * 28
}

function bubbleColor(value: number, max: number): string {
  const ratio = value / max
  if (ratio >= 0.7) return '#ef4444'
  if (ratio >= 0.4) return '#f97316'
  if (ratio >= 0.2) return '#eab308'
  return '#22c55e'
}

/** ⑫ 채용 지역 버블 맵 — SVG */
export function RegionMap() {
  const [hovered, setHovered] = useState<string | null>(null)

  const maxVal = useMemo(
    () => Math.max(...MOCK_REGION_MAP.regions.map((r) => r.value)),
    [],
  )

  return (
    <ChartContainer
      title="지역별 채용 분포"
      icon={<MapPin className="size-4 text-red-500" />}
      description="지역별 IT 채용공고 밀도 (원 크기 = 공고 수)"
    >
      <svg viewBox="0 0 600 420" className="w-full" role="img" aria-label="지역별 채용 분포 버블 맵">
        {/* 한반도 윤곽 간이 표시 */}
        <rect
          x={80}
          y={10}
          width={440}
          height={400}
          rx={16}
          className="fill-muted/30 stroke-border"
          strokeWidth={1}
        />
        <text x={300} y={30} textAnchor="middle" className="fill-muted-foreground/40 text-[11px]">
          대한민국
        </text>

        {/* 버블 */}
        {MOCK_REGION_MAP.regions.map((region) => {
          const [x, y] = project(region.coordinates)
          const r = bubbleRadius(region.value, maxVal)
          const color = bubbleColor(region.value, maxVal)
          const isActive = hovered === null || hovered === region.code

          return (
            <g
              key={region.code}
              opacity={isActive ? 1 : 0.25}
              onMouseEnter={() => setHovered(region.code)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-opacity"
            >
              <circle cx={x} cy={y} r={r} fill={color} opacity={0.6} />
              <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={1.5} />
              <text
                x={x}
                y={y - 2}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-semibold"
              >
                {region.name}
              </text>
              <text
                x={x}
                y={y + 10}
                textAnchor="middle"
                className="fill-foreground text-[9px]"
              >
                {region.value}건
              </text>
            </g>
          )
        })}
      </svg>

      {/* 범례 */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        {[
          { color: '#ef4444', label: '500+' },
          { color: '#f97316', label: '100~500' },
          { color: '#eab308', label: '30~100' },
          { color: '#22c55e', label: '~30' },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </ChartContainer>
  )
}
