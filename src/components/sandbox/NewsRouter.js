import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";

import Home from "../../views/sandbox/home/Home";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NoPermission from "../../views/sandbox/nopermission/NoPermission";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import RightLIst from "../../views/sandbox/right-manage/RightLIst";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import UserList from "../../views/sandbox/user-manage/UserList";
import NewsPreview from "../../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../../views/sandbox/news-manage/NewsUpdate";
import { Spin } from "antd";
import { connect } from "react-redux";
const LocalRoutermap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightLIst,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/audit-manage/audit": Audit,

  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
};
function NewsRouter(props) {
  const [BackRouteList, setBackRouteList] = useState([]);
  useEffect(() => {
    Promise.all([axios.get("/rights"), axios.get("/children")]).then((res) => {
      // console.log(res);
      setBackRouteList([...res[0].data, ...res[1].data]);
    });
  }, []);

  const {
    role: { rights },
  } = JSON.parse(window.sessionStorage.getItem("token"));
  const checkRoute = (item) => {
    return (
      LocalRoutermap[item.key] && (item.pagepermisson || item.routepermisson)
    );
  };

  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };

  return (
    <Spin size="large" spinning={props.isLoading}>
      <Switch>
        {BackRouteList.map((item) => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return (
              <Route
                path={item.key}
                key={item.key}
                component={LocalRoutermap[item.key]}
                exact
              ></Route>
            );
          }
          return null;
        })}
        <Redirect from="/" to="/home" exact></Redirect>
        {BackRouteList.length > 0 && (
          <Route path="*" component={NoPermission}></Route>
        )}
      </Switch>
    </Spin>
  );
}

const mapStateToProps = ({LoadingReducer:{isLoading}}) => ({
    isLoading
  })
export default connect(mapStateToProps)(NewsRouter)