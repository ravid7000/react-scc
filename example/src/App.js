import React from 'react'

import reactSCC from 'react-scc'

const App = reactSCC({
  state: 0,
  controller: () => {
    const handleChange = () => {}

    return { handleChange };
  },
  component: ({ componentState, handleChange }) => {
    return <div>counter {componentState}</div>
  }
})

export default App
