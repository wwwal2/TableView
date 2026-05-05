import { useEffect, useState } from 'react'

function App() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/count')
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json() as Promise<{ count: number }>
      })
      .then((data) => setCount(data.count))
      .catch(() => setCount(0))
  }, [])

  return (
      <section id="center">
      
        <button
          type="button"
          className="counter"
          disabled={count === null}
          onClick={() => setCount((c) => (c === null ? 0 : c + 1))}
        >
          Count is {count === null ? '…' : count}
        </button>
      </section>
  )
}

export default App
