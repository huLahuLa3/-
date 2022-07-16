import React from "react";
import { Form, Button, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import axios from "axios";
export default function Login(props) {

  const onFinish = (value) => {
    console.log(value);
    axios.get(`/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`).then(res => {
      console.log(res);
      if(res.data.length === 0) {
        message.error('用户名或密码不匹配')
      } else {
        window.sessionStorage.setItem('token', JSON.stringify(res.data[0]))
        props.history.push('/')
      }
    })
  }

  return (
    <div style={{ backgroundColor: "rgba(35,39,65)", height: "100%" }}>
      <div className="formContainer">
        <div className="loginTitle">全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
