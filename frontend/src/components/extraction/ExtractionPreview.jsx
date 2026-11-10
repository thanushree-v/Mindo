import { useState } from 'react'
import ExtractionCard from './ExtractionCard'

export default function ExtractionPreview({ items, onConfirm, onDiscard }) {
  const [editableItems, setEditableItems] = useState(items)
  const [includedMap, setIncludedMap] = useState(
    () => new Map(items.map((_, i) => [i, true]))
  )

  function handleItemChange(index, updatedItem) {
    setEditableItems((prev) => {
      const next = [...prev]
      next[index] = updatedItem
      return next
    })
  }

  function toggleIncluded(index) {
    setIncludedMap((prev) => {
      const next = new Map(prev)
      next.set(index, !next.get(index))
      return next
    })
  }

  function handleConfirm() {
    const confirmedItems = editableItems.filter((_, i) => includedMap.get(i))
    onConfirm(confirmedItems)
  }

  const includedCount = [...includedMap.values()].filter(Boolean).length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 font-medium">
          {items.length} item{items.length !== 1 ? 's' : ''} extracted
          {includedCount !== items.length && (
            <span className="text-gray-400">
              {' '}
              ({includedCount} selected)
            </span>
          )}
        </p>
      </div>

      <div className="space-y-3">
        {editableItems.map((item, index) => (
          <ExtractionCard
            key={index}
            item={item}
            onChange={(updated) => handleItemChange(index, updated)}
            included={includedMap.get(index)}
            onToggle={() => toggleIncluded(index)}
          />
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onDiscard}
          className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Discard All
        </button>
        <button
          onClick={handleConfirm}
          disabled={includedCount === 0}
          className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Confirm {includedCount > 0 ? `(${includedCount})` : ''}
        </button>
      </div>
    </div>
  )
}
