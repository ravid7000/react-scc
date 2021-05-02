some html here

## markdown heading

```jsx
import createSCC from 'react-scc'

const App = createSCC({
  state: 0,
  component: ({ state }) => {
    return <div>counter: {state}</div>
  }
})

export default App
```

```sh
npm install react-scc
```

or using yarn

```sh
yarn add react-scc
```
