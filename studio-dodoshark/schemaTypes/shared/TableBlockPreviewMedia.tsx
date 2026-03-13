export default function TableBlockPreviewMedia() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minWidth: 40,
        minHeight: 40,
        borderRadius: 10,
        border: '1px solid #cbd5e1',
        background:
          'linear-gradient(180deg, #f8fafc 0%, #eef2f7 52%, #e2e8f0 100%)',
        boxSizing: 'border-box',
        padding: 6,
        display: 'grid',
        gridTemplateRows: '10px repeat(3, 1fr)',
        gap: 4,
      }}
    >
      <div
        style={{
          borderRadius: 5,
          background: 'linear-gradient(90deg, #0f172a 0%, #334155 100%)',
        }}
      />
      {Array.from({length: 3}, (_, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.35fr 1fr 1fr',
            gap: 3,
          }}
        >
          {Array.from({length: 3}, (_, columnIndex) => (
            <div
              key={columnIndex}
              style={{
                borderRadius: 4,
                border: '1px solid rgba(100, 116, 139, 0.28)',
                background:
                  rowIndex === 0
                    ? 'rgba(148, 163, 184, 0.28)'
                    : 'rgba(255, 255, 255, 0.9)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
