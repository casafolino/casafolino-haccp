// ⚠️ IMPORTANTE: sostituisci i workcenter_ids con i valori reali di Odoo
// Vai su Odoo → Produzione → Configurazione → Centri di Lavoro
// e prendi gli ID di ogni linea

export const PRODUCTION_LINES = {
  miele: {
    label: 'Linea Miele',
    icon: '🍯',
    workcenter_ids: [] as number[],
    color: '#C8830A',
  },
  creme: {
    label: 'Creme Spalmabili',
    icon: '🫙',
    workcenter_ids: [] as number[],
    color: '#2D4A2D',
  },
  cantucci_gf: {
    label: 'Cantucci GF',
    icon: '🍪',
    workcenter_ids: [] as number[],
    color: '#185FA5',
  },
  cioccolato: {
    label: 'Cioccolato',
    icon: '🍫',
    workcenter_ids: [] as number[],
    color: '#3d2b1f',
  },
  crispy: {
    label: 'Crispy Chili',
    icon: '🌶️',
    workcenter_ids: [] as number[],
    color: '#B53B2A',
  },
  risotto: {
    label: 'Risotto',
    icon: '🍚',
    workcenter_ids: [] as number[],
    color: '#888780',
  },
  biscotteria: {
    label: 'Altra Biscotteria',
    icon: '🥐',
    workcenter_ids: [] as number[],
    color: '#6B6560',
  },
} as const

export type ProductionLine = keyof typeof PRODUCTION_LINES

export function getLineByWorkcenter(workcenterId: number): ProductionLine {
  for (const [key, line] of Object.entries(PRODUCTION_LINES)) {
    if ((line.workcenter_ids as number[]).includes(workcenterId)) {
      return key as ProductionLine
    }
  }
  return 'biscotteria'
}