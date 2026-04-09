export default function RatingInput({ scale, selected, onSelect }) {
  if (scale === 10) {
    return (
      <div>
        <div className="rating-row-10">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`rating-btn rating-btn-10 ${selected === n ? 'selected' : ''}`}
              onClick={() => onSelect(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="rating-scale-labels" style={{ marginTop: 8 }}>
          <span className="rating-scale-label">NOT THERE YET</span>
          <span className="rating-scale-label">FULLY LOCKED IN</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="rating-row-5">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`rating-btn rating-btn-5 ${selected === n ? 'selected' : ''}`}
            onClick={() => onSelect(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="rating-scale-labels" style={{ marginTop: 8 }}>
        <span className="rating-scale-label">NOT ME AT ALL</span>
        <span className="rating-scale-label">GENUINE STRENGTH</span>
      </div>
    </div>
  )
}
