import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import NavMenu from './components/NavMenu';
import React, { useEffect, useState } from 'react';
import LogIn from './components/LogIn';

export const UserInfo = React.createContext({
  user: {},
  setUser: () => { }
});

const App = () => {

  const setUserState = newUser => {
    setUser({ ...user, user: newUser });
  }

  const initUser = {
    user: {},
    setUser: setUserState
  }

  const [user, setUser] = useState(initUser);

  return (
    <UserInfo.Provider value={user}>
      <BrowserRouter>
        <NavMenu />
        <Switch>
          <Layout>
            <Route exact path='/' component={Home} />
            <Route path="/sign-in" component={LogIn} />
            <Route path='/home' component={Home} />
            <Route path='/home2' component={Home} />
          </Layout>
        </Switch>
      </BrowserRouter>
    </UserInfo.Provider>
  );

}

export default App;