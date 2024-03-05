import { Redirect, Route, Switch } from 'react-router-dom';
import { ProductPage, MainPage } from 'pages';

const App = () => {
  return (
    <div className='app'>
      <Switch>
        <Route path='/translator/:productId'>
          <ProductPage />
        </Route>
        <Route path='/translator'>
          <MainPage />
        </Route>

        <Route>
          <Redirect to='/translator' />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
