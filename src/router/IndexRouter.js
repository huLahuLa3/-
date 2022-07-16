import React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import Login from "../views/Login/Login";
import Detail from "../views/news/Detail";
import News from "../views/news/News";
import NewsSandBox from "../views/sandbox/NewsSandBox";

export default function IndexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/news" component={News}></Route>
        <Route path="/detail/:id" component={Detail}></Route>
        <Route path="/" render={() => window.sessionStorage.getItem('token') ? <NewsSandBox></NewsSandBox> : <Redirect to="/login"></Redirect>}></Route>
        {/* <Route path="/" component={NewsSandBox}></Route> */}
      </Switch>
    </HashRouter>
  );
}
