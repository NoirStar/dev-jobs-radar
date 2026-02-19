// ============================================================
// 지역 분류 데이터
// ============================================================

export interface RegionInfo {
  code: string
  name: string
  nameEn: string
  coordinates: [number, number] // [lat, lng]
}

/** 한국 시도 기준 지역 분류 */
export const REGIONS: RegionInfo[] = [
  { code: 'seoul', name: '서울', nameEn: 'Seoul', coordinates: [37.5665, 126.978] },
  { code: 'gyeonggi', name: '경기', nameEn: 'Gyeonggi', coordinates: [37.4138, 127.5183] },
  { code: 'incheon', name: '인천', nameEn: 'Incheon', coordinates: [37.4563, 126.7052] },
  { code: 'busan', name: '부산', nameEn: 'Busan', coordinates: [35.1796, 129.0756] },
  { code: 'daegu', name: '대구', nameEn: 'Daegu', coordinates: [35.8714, 128.6014] },
  { code: 'daejeon', name: '대전', nameEn: 'Daejeon', coordinates: [36.3504, 127.3845] },
  { code: 'gwangju', name: '광주', nameEn: 'Gwangju', coordinates: [35.1595, 126.8526] },
  { code: 'ulsan', name: '울산', nameEn: 'Ulsan', coordinates: [35.5384, 129.3114] },
  { code: 'sejong', name: '세종', nameEn: 'Sejong', coordinates: [36.48, 127.0] },
  { code: 'gangwon', name: '강원', nameEn: 'Gangwon', coordinates: [37.8228, 128.1555] },
  { code: 'chungbuk', name: '충북', nameEn: 'Chungbuk', coordinates: [36.6357, 127.4912] },
  { code: 'chungnam', name: '충남', nameEn: 'Chungnam', coordinates: [36.6588, 126.6728] },
  { code: 'jeonbuk', name: '전북', nameEn: 'Jeonbuk', coordinates: [35.7175, 127.153] },
  { code: 'jeonnam', name: '전남', nameEn: 'Jeonnam', coordinates: [34.8161, 126.4629] },
  { code: 'gyeongbuk', name: '경북', nameEn: 'Gyeongbuk', coordinates: [36.4919, 128.8889] },
  { code: 'gyeongnam', name: '경남', nameEn: 'Gyeongnam', coordinates: [35.4606, 128.2132] },
  { code: 'jeju', name: '제주', nameEn: 'Jeju', coordinates: [33.4996, 126.5312] },
  { code: 'remote', name: '원격근무', nameEn: 'Remote', coordinates: [0, 0] },
  { code: 'overseas', name: '해외', nameEn: 'Overseas', coordinates: [0, 0] },
]

/** 지역 코드 → 정보 맵 */
export const REGION_MAP = new Map(REGIONS.map((r) => [r.code, r]))

/** 주소 문자열에서 지역 코드 추출 */
export function extractRegionCode(address: string): string {
  if (!address) return 'remote'
  const lower = address.toLowerCase()

  if (lower.includes('서울')) return 'seoul'
  if (lower.includes('경기') || lower.includes('성남') || lower.includes('판교') || lower.includes('분당') || lower.includes('수원') || lower.includes('안양')) return 'gyeonggi'
  if (lower.includes('인천')) return 'incheon'
  if (lower.includes('부산')) return 'busan'
  if (lower.includes('대구')) return 'daegu'
  if (lower.includes('대전')) return 'daejeon'
  if (lower.includes('광주')) return 'gwangju'
  if (lower.includes('울산')) return 'ulsan'
  if (lower.includes('세종')) return 'sejong'
  if (lower.includes('강원') || lower.includes('춘천')) return 'gangwon'
  if (lower.includes('충북') || lower.includes('청주')) return 'chungbuk'
  if (lower.includes('충남') || lower.includes('천안')) return 'chungnam'
  if (lower.includes('전북') || lower.includes('전주')) return 'jeonbuk'
  if (lower.includes('전남') || lower.includes('나주') || lower.includes('목포')) return 'jeonnam'
  if (lower.includes('경북') || lower.includes('포항')) return 'gyeongbuk'
  if (lower.includes('경남') || lower.includes('창원')) return 'gyeongnam'
  if (lower.includes('제주')) return 'jeju'
  if (lower.includes('remote') || lower.includes('원격') || lower.includes('재택')) return 'remote'
  if (lower.includes('해외') || lower.includes('japan') || lower.includes('us')) return 'overseas'

  return 'seoul' // 기본값
}

/** 수도권 지역 코드 */
export const METRO_REGIONS = ['seoul', 'gyeonggi', 'incheon']

/** 총 지역 수 */
export const TOTAL_REGIONS = REGIONS.length
