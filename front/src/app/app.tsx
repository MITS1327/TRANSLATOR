import { Redirect, Route, Switch } from 'react-router-dom';
import Topbar from 'topbar/Topbar';
import { ProductPage, MainPage } from 'pages';
import { IS_EU_PROD } from 'shared/config';

const App = () => {
  return (
    <div className='app'>
      <Topbar isVisibleTopbarProductMenu isNewAccountList isEuropeHost={IS_EU_PROD} />
      <Switch>
        <Route path='/:productId'>
          <ProductPage />
        </Route>
        <Route path='/'>
          <MainPage />
        </Route>

        <Route>
          <Redirect to='/' />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
