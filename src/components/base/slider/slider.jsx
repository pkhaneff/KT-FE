import { useMemo, useRef, useState } from 'react'
import { cn } from '../../../core/utils/cn'

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  value,
  onValueChange,
  labelPosition = 'top-floating',
  labelFormatter,
  labelEditable = false,
  labelInputValue,
  onLabelInputChange,
  onLabelInputBlur,
  labelInputMode = 'numeric',
  labelPlaceholder = '',
  showValueOnThumb = false,
  className,
  ...props
}) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? min)
  const currentValue = isControlled ? value : internalValue
  const trackRef = useRef(null)

  const label = useMemo(() => {
    if (typeof labelFormatter === 'function') {
      return labelFormatter(currentValue)
    }

    return `${currentValue}`
  }, [currentValue, labelFormatter])

  const handleChange = (event) => {
    const nextValue = Number(event.target.value)
    if (!Number.isFinite(nextValue)) {
      return
    }

    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  const clampValue = (nextValue) => Math.min(Math.max(nextValue, min), max)
  const applyStep = (nextValue) => {
    if (!step) {
      return clampValue(nextValue)
    }

    const snapped = Math.round((nextValue - min) / step) * step + min
    return clampValue(snapped)
  }

  const getValueFromPointer = (clientX) => {
    if (!trackRef.current) {
      return currentValue
    }

    const rect = trackRef.current.getBoundingClientRect()
    if (!rect.width) {
      return currentValue
    }

    const ratio = (clientX - rect.left) / rect.width
    const rawValue = min + ratio * (max - min)
    return applyStep(rawValue)
  }

  const handleThumbPointerDown = (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    const nextValue = getValueFromPointer(event.clientX)
    if (nextValue !== currentValue) {
      onValueChange?.(nextValue)
      if (!isControlled) {
        setInternalValue(nextValue)
      }
    }
  }

  const handleThumbPointerMove = (event) => {
    if (!event.buttons) {
      return
    }

    const nextValue = getValueFromPointer(event.clientX)
    if (nextValue !== currentValue) {
      onValueChange?.(nextValue)
      if (!isControlled) {
        setInternalValue(nextValue)
      }
    }
  }

  const percent = max === min ? 0 : ((currentValue - min) / (max - min)) * 100

  return (
    <div className={cn('relative w-full', className)}>
      {labelPosition === 'top-floating' ? (
        <div className="absolute -top-6 left-0 right-0 flex items-center justify-end text-xs font-semibold text-slate-600">
          {labelEditable ? (
            <input
              value={labelInputValue ?? ''}
              onChange={onLabelInputChange}
              onBlur={onLabelInputBlur}
              inputMode={labelInputMode}
              placeholder={labelPlaceholder}
              className={cn(
                'min-w-[112px] rounded-full bg-slate-100 px-3 py-1 text-right text-xs font-semibold text-slate-800',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200',
              )}
            />
          ) : (
            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-800">{label}</span>
          )}
        </div>
      ) : null}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        ref={trackRef}
        className={cn(
          'h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200',
        )}
        {...props}
      />
      {showValueOnThumb ? (
        <div
          className="pointer-events-none absolute left-0 top-1/2 z-10 -translate-y-1/2"
          style={{ left: `${percent}%` }}
        >
          <div className="pointer-events-auto -translate-x-1/2">
            {labelEditable ? (
              <input
                value={labelInputValue ?? ''}
                onChange={onLabelInputChange}
                onBlur={onLabelInputBlur}
                onPointerDown={handleThumbPointerDown}
                onPointerMove={handleThumbPointerMove}
                inputMode={labelInputMode}
                placeholder={labelPlaceholder}
                className={cn(
                  'h-8 w-[120px] rounded-full border border-slate-200 bg-white px-3 text-center text-xs font-semibold text-slate-800 shadow-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200',
                )}
              />
            ) : (
              <button
                type="button"
                onPointerDown={handleThumbPointerDown}
                onPointerMove={handleThumbPointerMove}
                className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 shadow-sm"
              >
                {label}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
