import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import NavMenu from './components/NavMenu';
import React, { useEffect, useState } from 'react';

export const UserInfo = React.createContext();

const App = () => {

  const [user, setUser] = useState({});

  useEffect(() => {

    setTimeout(() => {
      setUser({ isSignedIn: true })
    }, 2000);
  })

  return (
    <UserInfo.Provider value={user}>
      <BrowserRouter>
        <NavMenu />
        <Switch>
          <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/home' component={Home} />
            <Route path='/home2' component={Home} />
          </Layout>
        </Switch>
      </BrowserRouter>
    </UserInfo.Provider>
  );

}

export default App;