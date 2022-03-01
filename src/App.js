import React from 'react';

//import devExtreme-react
import 'devextreme/dist/css/dx.light.css';

//import pages
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import SetPackaging from './pages/SetPackaging/SetPackaging';

//import react-router-dom
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


function App() {
  return (
    <Router>
      <div className="App">

        <Switch>

          <Route path="/" exact>
            <Login />
          </Route>

          <Route path="/home">
            <Home />
          </Route>

          <Route path="/setpackaging/:picklistnumber">
            <SetPackaging />
          </Route>

        </Switch>

      </div>
    </Router>

  );
}

export default App;
