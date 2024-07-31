import './App.css';
import { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom/cjs/react-router-dom';
import ProductList from './ProductList';
import ProductEdit from './ProductEdit';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact={true} component={ProductList}/>
          <Route path="/products/:code" component={ProductEdit}/>
          <Route path="/products/new" component={ProductEdit}/>
        </Switch>
      </Router>
    )
  }
}

export default App;
