# react-scc

> React Js design pattern for creating components

[![NPM](https://img.shields.io/npm/v/react-scc.svg)](https://www.npmjs.com/package/react-scc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-scc
```

## Usage

```tsx
import * as React from 'react'

import { useMyHook } from 'react-scc'

const Example = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
```

## License

MIT © [ravid7000](https://github.com/ravid7000)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
