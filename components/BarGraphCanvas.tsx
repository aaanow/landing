'use client'

import { useRef, useEffect } from 'react'

const CONFIG = {
  numCols: 8,
  blockMin: 16,
  gridCells: 24,
  spawnWindowMs: 12000,
  travelBufferMs: 800,
  fadeInDurationMs: 800,
  paleModeTransitionMs: 4000,
  blueGrowthDelayMs: 533,
  blueGrowthDelayVariationMs: 533,
  bluePulseAmplitudeBlocks: 0.6,
  bluePulsePeriodMs: 4667,
  mainBarIndices: [3, 4, 6],
  riskBarIndex: 4,
  riskBarTriggerRows: 10,
  paleBurstIntervalMinMs: 1000,
  paleBurstIntervalMaxMs: 2200,
  blockFadeDurationMs: 300,
  riskBlurDurationMs: 1000,
  riskBlurDelayMs: 2000,
  valueBlurDurationMs: 1000,
  valueBlurDelayMs: 2000,
}

const BARS = [
  { width: 1, color: '#E0B1CE' },
  { width: 1, color: '#6C1446' },
  { width: 1, color: '#F24D40' },
  { width: 6, color: '#12D863' },
  { width: 6, color: '#D2407F' },
  { width: 1, color: '#D3D142' },
  { width: 7, color: '#004552' },
  { width: 1, color: '#FF6B35' },
]

const TARGET = [6, 4, 7, 132, 18, 7, 124, 5]
const INITIAL = [5, 3, 7, 12, 108, 4, 0, 6]

const BAR_OFFSETS = (() => {
  const out = new Array(BARS.length)
  out[0] = 0
  for (let i = 1; i < BARS.length; i++) out[i] = out[i - 1] + BARS[i - 1].width
  return out
})()

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)) }

function makeRng(seed = 1337) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff)
}

interface Geom {
  width: number
  height: number
  blockSize: number
  baselineY: number
  leftX: number
  maxRows: number
  barLeftX: (col: number) => number
  cellCenterY: (row: number) => number
  cellCenterX: (col: number) => number
}

function computeGeometry(canvas: HTMLCanvasElement): Geom {
  const dpr = Math.max(1, window.devicePixelRatio || 1)
  const parent = canvas.parentElement || document.body
  const parentW = Math.max(1, parent.clientWidth || parent.offsetWidth || 400)
  const parentH = Math.max(1, parent.clientHeight || parent.offsetHeight || 400)
  const cells = CONFIG.gridCells
  const blockSize = Math.max(CONFIG.blockMin, Math.floor(Math.min(parentW, parentH) / cells))
  canvas.width = Math.floor(parentW * dpr)
  canvas.height = Math.floor(parentH * dpr)
  canvas.style.width = parentW + 'px'
  canvas.style.height = parentH + 'px'
  const ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const width = parentW
  const height = parentH
  const baselineY = height - Math.floor(blockSize * 0.5) + 6
  const totalCells = BAR_OFFSETS[BARS.length - 1] + BARS[BARS.length - 1].width
  const totalWidthPx = totalCells * blockSize
  const leftX = Math.max(0, Math.floor((width - totalWidthPx) / 2))

  return {
    width, height, blockSize, baselineY, leftX,
    maxRows: Math.floor((height - blockSize) / blockSize),
    barLeftX: (col) => leftX + BAR_OFFSETS[col] * blockSize,
    cellCenterY: (row) => baselineY - (row + 0.5) * blockSize,
    cellCenterX: (col) => leftX + (col + 0.5) * blockSize,
  }
}

function useBarGraphAnimation(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const host = canvas.parentElement
    if (!host) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let geom = computeGeometry(canvas)
    let raf = 0
    let running = true
    let now0 = performance.now()
    let lastRetarget = now0
    const rng = makeRng(42)

    const barBlocks: boolean[][][] = new Array(CONFIG.numCols)
    const targetCells: number[] = new Array(CONFIG.numCols).fill(0)
    const lastOpAt: number[] = new Array(CONFIG.numCols).fill(now0)
    const placedAt: number[][][] = new Array(CONFIG.numCols)

    let showCenterBlue = false
    let blueGrowthLevel: number | { base: number; offset: number } = 0
    let bluePulseStartAt = 0
    let blueLastGrowthAt = 0
    let blueStartAtMs = 0
    let blueRingAppearedAt: number[] = []
    let paleMode = false
    let paleStartAtMs = 0
    let revenueBoxHidden = false

    function countCells(col: number) {
      const w = BARS[col].width
      let n = 0
      const colRows = barBlocks[col] || []
      for (let r = 0; r < colRows.length; r++) {
        for (let i = 0; i < w; i++) if (colRows[r][i]) n++
      }
      return n
    }

    function countRowsUsed(col: number) {
      const w = BARS[col].width
      const colRows = barBlocks[col] || []
      let rowsUsed = 0
      for (let r = 0; r < colRows.length; r++) {
        let any = false
        for (let i = 0; i < w; i++) { if (colRows[r][i]) { any = true; break } }
        if (any) rowsUsed = r + 1
      }
      return rowsUsed
    }

    function trimTopEmptyRows(col: number) {
      const colRows = barBlocks[col]
      const colPlacedAt = placedAt[col]
      if (!colRows) return
      const w = BARS[col].width
      while (colRows.length > 0) {
        const row = colRows[colRows.length - 1]
        let any = false
        for (let i = 0; i < w; i++) { if (row[i]) { any = true; break } }
        if (any) break
        colRows.pop()
        if (colPlacedAt) colPlacedAt.pop()
      }
    }

    function addBlock(col: number) {
      const w = BARS[col].width
      if (!barBlocks[col]) { barBlocks[col] = []; placedAt[col] = [] }
      const colRows = barBlocks[col]
      const colPlacedAt = placedAt[col]
      for (let r = 0; r < colRows.length; r++) {
        for (let i = 0; i < w; i++) {
          if (!colRows[r][i]) {
            colRows[r][i] = true
            colPlacedAt[r][i] = now0 + (performance.now() - now0)
            return true
          }
        }
      }
      if (colRows.length >= geom.maxRows) return false
      const row = new Array(w).fill(false)
      const placedAtRow = new Array(w).fill(-1)
      const idx = Math.floor(rng() * w)
      row[idx] = true
      placedAtRow[idx] = now0 + (performance.now() - now0)
      colRows.push(row)
      colPlacedAt.push(placedAtRow)
      return true
    }

    function removeBlock(col: number) {
      const w = BARS[col].width
      const colRows = barBlocks[col]
      const colPlacedAt = placedAt[col]
      if (!colRows || colRows.length === 0) return false
      for (let r = colRows.length - 1; r >= 0; r--) {
        const filledInRow: number[] = []
        for (let i = 0; i < w; i++) {
          if (colRows[r][i] && (colPlacedAt[r][i] >= -1)) filledInRow.push(i)
        }
        if (filledInRow.length > 0) {
          const randomIndex = filledInRow[Math.floor(rng() * filledInRow.length)]
          colPlacedAt[r][randomIndex] = -(now0 + (performance.now() - now0))
          setTimeout(() => {
            if (colRows[r] && colRows[r][randomIndex]) {
              colRows[r][randomIndex] = false
              colPlacedAt[r][randomIndex] = -1
              trimTopEmptyRows(col)
            }
          }, CONFIG.blockFadeDurationMs)
          return true
        }
      }
      return false
    }

    function initializeBarBlocks() {
      for (let c = 0; c < CONFIG.numCols; c++) {
        const w = BARS[c].width
        let total = w === 1 ? 1 + Math.floor(rng() * 10) : INITIAL[c]
        const rows = Math.min(Math.ceil(total / w), geom.maxRows)
        const colRows: boolean[][] = []
        const colPlacedAt: number[][] = []
        for (let r = 0; r < rows; r++) {
          colRows.push(new Array(w).fill(false))
          colPlacedAt.push(new Array(w).fill(-1))
        }
        let left = total
        for (let r = 0; r < rows && left > 0; r++) {
          const n = Math.min(w, left)
          const idxs = Array.from({ length: w }, (_, i) => i)
          for (let i = idxs.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1))
            ;[idxs[i], idxs[j]] = [idxs[j], idxs[i]]
          }
          for (let i = 0; i < n; i++) colRows[r][idxs[i]] = true
          left -= n
        }
        barBlocks[c] = colRows
        placedAt[c] = colPlacedAt
        targetCells[c] = TARGET[c]
      }
    }

    initializeBarBlocks()

    function retarget() {
      const now = performance.now()
      lastRetarget = now
      for (let col = 0; col < CONFIG.numCols; col++) {
        if (BARS[col].width === 1) {
          const current = targetCells[col]
          const dirs: number[] = []
          if (current > 1) dirs.push(current - 1)
          if (current < 9) dirs.push(current + 1)
          dirs.push(current)
          targetCells[col] = dirs[Math.floor(rng() * dirs.length)]
        } else if (col === 3 || col === 4 || col === 6) {
          const current = targetCells[col]
          const baseTarget = TARGET[col]
          const currentActual = countCells(col)
          if (col === 4) {
            const animationAge = now - now0
            if (animationAge < CONFIG.riskBlurDelayMs + CONFIG.riskBlurDurationMs) {
              targetCells[col] = current
              lastOpAt[col] = now + 60
              continue
            }
          } else if (col === 3) {
            const animationAge = now - now0
            if (animationAge < CONFIG.valueBlurDelayMs + CONFIG.valueBlurDurationMs) {
              targetCells[col] = current
              lastOpAt[col] = now + 60
              continue
            }
          }
          let nearTarget = col === 4
            ? currentActual <= baseTarget * 1.1 && currentActual >= baseTarget * 0.9
            : currentActual >= baseTarget * 0.9
          if (nearTarget) {
            const fluctuationRange = Math.max(3, Math.floor(baseTarget * 0.02))
            const dirs: number[] = []
            if (current > baseTarget - fluctuationRange) dirs.push(current - 1)
            if (current < baseTarget + fluctuationRange) dirs.push(current + 1)
            dirs.push(current)
            targetCells[col] = dirs[Math.floor(rng() * dirs.length)]
          } else {
            targetCells[col] = baseTarget
          }
        }
        lastOpAt[col] = performance.now() + (CONFIG.mainBarIndices.includes(col) ? 60 : Math.floor(rng() * 160))
      }
    }

    function drawBaseline() {
      ctx.save()
      ctx.fillStyle = '#ffffff'
      const totalCells = BAR_OFFSETS[BARS.length - 1] + BARS[BARS.length - 1].width
      ctx.fillRect(geom.leftX, geom.baselineY, totalCells * geom.blockSize, 4)
      ctx.restore()
    }

    function drawLabels() {
      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const fontPx = clamp(Math.floor(geom.blockSize * 1.2), 10, Math.floor(geom.blockSize * 1.5))
      ctx.font = `${fontPx}px 'optima-lt-pro', 'Optima LT Pro', 'Optima', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif`
      const labels = [
        { col: 3, text: 'Value' },
        { col: 4, text: 'Risk' },
        { col: 6, text: 'Revenue' },
      ]
      for (const { col, text } of labels) {
        const x0 = geom.barLeftX(col)
        const widthPx = BARS[col].width * geom.blockSize
        const cx = x0 + widthPx / 2
        const cy = geom.cellCenterY(0) - geom.blockSize * 0.45
        ctx.fillStyle = text === 'Revenue' ? '#D2F9C5' : '#ffffff'
        ctx.fillText(text, cx, cy)
      }
      ctx.restore()
    }

    function drawCenterBlueBlock(now: number) {
      if (!showCenterBlue) return
      const cells = CONFIG.gridCells
      const cx = 9
      const cy = Math.floor(cells / 2)
      ctx.save()
      ctx.fillStyle = '#04A1E9'
      const radius = typeof blueGrowthLevel === 'number' ? blueGrowthLevel : Math.max(0, blueGrowthLevel.base + blueGrowthLevel.offset)
      const horizontalRadius = Math.max(0, radius - 3)
      const verticalRadius = radius * 0.6
      for (let dy = -Math.ceil(verticalRadius); dy <= Math.ceil(verticalRadius); dy++) {
        for (let dx = -Math.ceil(horizontalRadius); dx <= Math.ceil(horizontalRadius); dx++) {
          const gx = cx + dx
          const gy = cy + dy
          if (gx < 0 || gx >= cells || gy < 0 || gy >= cells) continue
          if (horizontalRadius <= 0 || verticalRadius <= 0) continue
          const nX = dx / horizontalRadius
          const nY = dy / verticalRadius
          if (nX * nX + nY * nY > 1) continue
          const sHR = Math.max(0, horizontalRadius - 1)
          const sVR = Math.max(0, verticalRadius - 0.6)
          const sNX = sHR > 0 ? dx / sHR : 1
          const sNY = sVR > 0 ? dy / sVR : 1
          const iHR = Math.max(0, horizontalRadius - 2)
          const iVR = Math.max(0, verticalRadius - 1.2)
          const iNX = iHR > 0 ? dx / iHR : 1
          const iNY = iVR > 0 ? dy / iVR : 1
          if (iNX * iNX + iNY * iNY <= 1) ctx.globalAlpha = 1.0
          else if (sNX * sNX + sNY * sNY <= 1) ctx.globalAlpha = 0.66
          else ctx.globalAlpha = 0.33
          const x = geom.cellCenterX(gx) - geom.blockSize / 2
          const y = geom.cellCenterY(gy) - geom.blockSize / 2
          ctx.fillRect(x, y, geom.blockSize, geom.blockSize)
        }
      }
      ctx.globalAlpha = 1
      ctx.restore()
    }

    function drawCenterOpportunity() {
      const radius = typeof blueGrowthLevel === 'number' ? blueGrowthLevel : Math.max(0, blueGrowthLevel.base + blueGrowthLevel.offset)
      if (!showCenterBlue || radius < 4) return
      const cells = CONFIG.gridCells
      const cx = 9
      const cy = Math.floor(cells / 2)
      const x = geom.cellCenterX(cx)
      const y = geom.cellCenterY(cy)
      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      const fontPx = clamp(Math.floor(geom.blockSize * 1.3), 10, Math.floor(geom.blockSize * 1.6))
      ctx.font = `${fontPx}px 'optima-lt-pro', 'Optima LT Pro', 'Optima', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif`
      ctx.fillText('Confidence', x, y)
      ctx.restore()
    }

    function drawRevenueDashedBox() {
      const col = 6
      const { blockSize, baselineY } = geom
      const x = geom.barLeftX(col)
      const w = BARS[col].width * blockSize
      const h = 15 * blockSize
      const y = baselineY - h
      ctx.save()
      ctx.setLineDash([4, 6])
      ctx.lineWidth = 3
      ctx.strokeStyle = '#87AAA8'
      let rowsUsed = 0
      const colRows = barBlocks[col] || []
      for (let r = 0; r < colRows.length; r++) {
        let any = false
        for (let i = 0; i < BARS[col].width; i++) { if (colRows[r][i]) { any = true; break } }
        if (any) rowsUsed = r + 1
      }
      ctx.globalAlpha = rowsUsed > 14 ? 0 : 1
      const visibleHeight = Math.max(0, h - rowsUsed * blockSize)
      if (visibleHeight > 0 && ctx.globalAlpha > 0) {
        ctx.beginPath()
        ctx.rect(x, y, w, visibleHeight)
        ctx.clip()
        ctx.strokeRect(x, y, w, h)
      }
      ctx.restore()
    }

    function drawBars() {
      const currentTime = now0 + (performance.now() - now0)
      const animationAge = currentTime - now0
      let riskBlurAmount = 0
      let valueBlurAmount = 0
      const riskTotalBlurTime = CONFIG.riskBlurDelayMs + CONFIG.riskBlurDurationMs
      if (animationAge < riskTotalBlurTime) {
        riskBlurAmount = animationAge < CONFIG.riskBlurDelayMs ? 100 : 100 * (1 - (animationAge - CONFIG.riskBlurDelayMs) / CONFIG.riskBlurDurationMs)
      }
      const valueTotalBlurTime = CONFIG.valueBlurDelayMs + CONFIG.valueBlurDurationMs
      if (animationAge < valueTotalBlurTime) {
        valueBlurAmount = animationAge < CONFIG.valueBlurDelayMs ? 100 : 100 * (1 - (animationAge - CONFIG.valueBlurDelayMs) / CONFIG.valueBlurDurationMs)
      }

      for (let col = 0; col < CONFIG.numCols; col++) {
        const x0 = geom.barLeftX(col)
        const w = BARS[col].width
        const colRows = barBlocks[col] || []
        const colPlacedAt = placedAt[col] || []

        if (col === 4 && riskBlurAmount > 0) {
          ctx.save()
          ctx.filter = `blur(${riskBlurAmount}px)`
          ctx.fillStyle = BARS[col].color
          ctx.globalAlpha = 1.0
          const barHeight = Math.ceil(108 / w) * geom.blockSize
          ctx.fillRect(x0, geom.baselineY - barHeight, w * geom.blockSize, barHeight)
          ctx.restore()
        } else if (col === 3 && valueBlurAmount > 0) {
          ctx.save()
          ctx.filter = `blur(${valueBlurAmount}px)`
          ctx.fillStyle = BARS[col].color
          ctx.globalAlpha = 1.0
          const barHeight = geom.blockSize * 2
          ctx.fillRect(x0, geom.baselineY - barHeight, w * geom.blockSize, barHeight)
          ctx.restore()
        } else {
          ctx.fillStyle = BARS[col].color
          for (let r = 0; r < colRows.length; r++) {
            const y = geom.cellCenterY(r) - geom.blockSize / 2
            const row = colRows[r]
            const placedAtRow = colPlacedAt[r] || []
            for (let i = 0; i < w; i++) {
              if (!row[i]) continue
              const blockPlacedAt = placedAtRow[i] || -1
              let opacity = 1.0
              if (blockPlacedAt > 0) {
                const ageMs = currentTime - blockPlacedAt
                if (ageMs < CONFIG.blockFadeDurationMs) opacity = 0.5 + 0.5 * (ageMs / CONFIG.blockFadeDurationMs)
              } else if (blockPlacedAt < -1) {
                const fadeElapsed = currentTime - (-blockPlacedAt)
                if (fadeElapsed < CONFIG.blockFadeDurationMs) opacity = 1.0 - 0.5 * (fadeElapsed / CONFIG.blockFadeDurationMs)
                else opacity = 0.5
              }
              ctx.globalAlpha = opacity
              ctx.fillRect(x0 + i * geom.blockSize, y, geom.blockSize, geom.blockSize)
            }
          }
        }
      }
      ctx.globalAlpha = 1.0
    }

    function frame(now: number) {
      if (now - lastRetarget > 800) retarget()

      for (let col = 0; col < CONFIG.numCols; col++) {
        if (col === 4 && now - now0 < CONFIG.riskBlurDelayMs + CONFIG.riskBlurDurationMs) continue
        if (col === 3 && now - now0 < CONFIG.valueBlurDelayMs + CONFIG.valueBlurDurationMs) continue
        const interval = BARS[col].width === 1 ? 40 : 80
        if (now - lastOpAt[col] < interval) continue
        lastOpAt[col] = now
        const cur = countCells(col)
        const tgt = targetCells[col]
        if (cur < tgt) addBlock(col)
        else if (cur > tgt) removeBlock(col)
      }

      if (!showCenterBlue) {
        if (countRowsUsed(6) >= 15) {
          showCenterBlue = true
          blueGrowthLevel = 0
          blueLastGrowthAt = now - now0
          blueStartAtMs = now - now0
          blueRingAppearedAt = []
        }
      } else {
        const cells = CONFIG.gridCells
        const maxRadius = Math.ceil(cells / 2)
        const gap = CONFIG.blueGrowthDelayMs + Math.floor(rng() * CONFIG.blueGrowthDelayVariationMs)
        const elapsed = now - now0
        const lvl = typeof blueGrowthLevel === 'number' ? blueGrowthLevel : blueGrowthLevel.base
        if (lvl < maxRadius) {
          if (elapsed - blueLastGrowthAt >= gap) {
            blueGrowthLevel = lvl + 1
            blueLastGrowthAt = elapsed
            blueRingAppearedAt[lvl + 1] = elapsed
            if (lvl + 1 >= maxRadius) bluePulseStartAt = now
          }
        } else {
          const t = ((now - bluePulseStartAt) % CONFIG.bluePulsePeriodMs) / CONFIG.bluePulsePeriodMs
          const sine = Math.sin(2 * Math.PI * t)
          blueGrowthLevel = { base: maxRadius, offset: (CONFIG.bluePulseAmplitudeBlocks / 2) * sine }
        }
        if (!paleMode && lvl / maxRadius >= 0.5) {
          paleMode = true
          paleStartAtMs = now - now0
        }
      }

      if (!revenueBoxHidden && countRowsUsed(6) > 14) revenueBoxHidden = true

      ctx.clearRect(0, 0, geom.width, geom.height)
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, geom.width, geom.baselineY + 12)
      ctx.clip()
      if (!revenueBoxHidden) drawRevenueDashedBox()
      drawBars()
      drawCenterBlueBlock(now)
      drawCenterOpportunity()
      drawLabels()
      drawBaseline()
      ctx.restore()

      if (running) raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(() => { geom = computeGeometry(canvas) })
    ro.observe(host)

    const onVis = () => {
      if (document.hidden) { running = false }
      else { running = true; raf = requestAnimationFrame(frame) }
    }
    document.addEventListener('visibilitychange', onVis)

    geom = computeGeometry(canvas)
    now0 = performance.now()
    lastRetarget = now0
    retarget()
    raf = requestAnimationFrame(frame)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [canvasRef])
}

export function BarGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useBarGraphAnimation(canvasRef)

  return (
    <div className="nhero__canvas-wrapper">
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: 'transparent', display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}
