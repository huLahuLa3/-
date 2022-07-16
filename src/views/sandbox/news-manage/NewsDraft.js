import React, { useState, useEffect } from "react";
import { Button, Table, Modal, notification } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UploadOutlined
} from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;
export default function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([]);

  const { username } = JSON.parse(window.sessionStorage.getItem("token"));
  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => {
        const list = res.data;
        list.forEach((item) => {
          if (item.children?.length === 0) {
            item.children = "";
          }
        });
        setDataSource(list);
      });
  }, [username]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <div>{id}</div>;
      },
    },
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return (
          <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
        )
      }
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "分类",
      dataIndex: "category",
      render: (category) => {
        return category.title;
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethods(item)}
            />
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                props.history.push(`/news-manage/update/${item.id}`)
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
              onClick={() => handleCheck(item.id)}
            />
          </div>
        );
      },
    },
  ];

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState:1
    }).then(res => {
      props.history.push('/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以到${'审核列表'}中查看您的新闻`,
        placement:'bottomRight',
      })
    })
  }
  const confirmMethods = (item) => {
    confirm({
      title: "你确定要删除吗?",
      icon: <ExclamationCircleOutlined />,
      content: "delete？",
      onOk() {
        // console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const deleteMethod = (item) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id));
      axios.delete(`/news/${item.id}`);
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={item => item.id}
      />
    </div>
  );
}
