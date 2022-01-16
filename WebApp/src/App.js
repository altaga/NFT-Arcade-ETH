// Basic
import { Component } from "react";

// Router
import {
  Router,
  Route,
  Switch
} from "react-router-dom";

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

// Pages
import Main from "./pages/main";
import history from "./utils/history";
import Upload from "./pages/upload";
import Nft from "./pages/nft";
import Streamer from "./pages/streamer";
import Artist from "./pages/artist";
import Gallery from "./pages/gallery";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import OrderRev from "./pages/order-review";
import Session from "./pages/session";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/streamers" component={Gallery} />
            <Route exact path="/streamer/:pub" component={Streamer} />
            <Route exact path="/session/:pub" component={Session} />
            <Route exact path="/nft/:pub" component={Nft} />
            <Route exact path="/artist/:pub" component={Artist} />
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/terms" component={Terms} />
            <Route exact path="/order-review" component={OrderRev} />
            <Route path="*" component={Main} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
