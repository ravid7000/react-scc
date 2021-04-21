import React from 'react'

import { useMyHook } from 'react-scc'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App
