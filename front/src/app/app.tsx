import { Redirect, Route, Switch } from 'react-router-dom';
import Topbar from 'topbar/Topbar';
import { ProductPage, MainPage } from 'pages';
import { IS_EU_PROD } from 'shared/config';

const App = () => {
  return (
    <div className='app'>
      <Topbar isVisibleTopbarProductMenu isNewAccountList isEuropeHost={IS_EU_PROD} />
      <Switch>
        <Route path='/projects/:projectId'>
          <ProductPage />
        </Route>
        <Route path='/all'>
          <ProductPage />
        </Route>
        <Route path='/projects'>
          <MainPage />
        </Route>
        <Route>
          <Redirect to='/projects' />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
