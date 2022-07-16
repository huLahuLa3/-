import React, { useState } from "react";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from "@ant-design/icons";
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
const { Header } = Layout;
function TopHeader(props) {
  // console.log(props);
  // const [collapsed, setCollapsed] = useState(false);
  const changeCollApsed = () => {
    // console.log(props);
    props.changeCollapsed()
  };

  const {role:{roleName}, username} = JSON.parse(window.sessionStorage.getItem('token'))

  const menu = (
    <Menu>
      <Menu.Item>
        {roleName}
      </Menu.Item>
      <Menu.Item danger onClick={() => {
        window.sessionStorage.removeItem('token')
        props.history.replace('/login')
      }}>退出</Menu.Item>
    </Menu>
  );
  return (
    <Header className="site-layout-background" style={{ padding: "0px 16px" }}>
      {props.isCollapsed ? (
        <MenuUnfoldOutlined onClick={changeCollApsed} />
      ) : (
        <MenuFoldOutlined onClick={changeCollApsed} />
      )}
      {/* {React.createElement(
        this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
        {
          className: "trigger",
          onClick: this.toggle,
        }
      )} */}
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{color: "#1890ff"}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
        <Avatar size="large" icon={<UserOutlined />} />

        </Dropdown>
      </div>
    </Header>
  );
}

const mapStateTpProps = ({CollapsedReducer:{isCollapsed}}) => {
  // console.log(state);
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'change_collapsed'
    }
  }
}
export default connect(mapStateTpProps, mapDispatchToProps)(withRouter(TopHeader))