import { RootContext, rootStore } from './stores/RootStore';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { observer } from "mobx-react-lite";
import './App.css';

import Giveaway from './scenes/Giveaway';
import Entry from "./scenes/Entry";
import BackgroundGrid from './components/BackgroundGrid';

const App = observer((props) => {
  return (
    <Router>
      <RootContext.Provider value={rootStore}>
        <Switch>
          <Route
            exact
            path="/home"
            name="Home"
            render={(props) => <Giveaway {...props} />}
          />
          <Route
            path="/"
            name="Entry"
            render={(props) => <Entry {...props} />}
          />
        </Switch>
      </RootContext.Provider>
      <BackgroundGrid />
    </Router>
  );
});

export default App;
