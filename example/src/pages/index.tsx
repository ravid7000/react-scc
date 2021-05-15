import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

const Page = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback="loading...">
        <Switch>
          <Route exact path="/" component={React.lazy(() => import('./home'))} />
          <Route exact path="/about" component={React.lazy(() => import('./about'))} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default Page;
