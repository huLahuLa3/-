import { Table, Button, Modal, Tree } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setdataSource] = useState([]);
  const [rightList, setrightList] = useState([]);
  const [currentRights, securrentRights] = useState([]);
  const [currentId, securrentId] = useState(0);
  const [isModalVisible, setisModalVisible] = useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      render: (roleName) => {
        return <b>{roleName}</b>;
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
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setisModalVisible(true);
                securrentRights(item.rights)
                securrentId(item.id)
              }}
            />
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    axios.get("/roles").then((res) => {
      // console.log(res.data);
      setdataSource(res.data);
    });
    axios.get("/rights?_embed=children").then((res) => {
      // console.log(res.data);
      setrightList(res.data);
    });
  }, []);
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
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/roles/${item.id}`);
  };
  // 成功的函数
  const handleOk = () => {
    setisModalVisible(false);
    // console.log(currentRights);
    setdataSource(dataSource.map(item => {
      if(item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    })
  };
  const handleCancel = () => {
    setisModalVisible(false);
  };
  const onCheck = (chechKeys) => {
    // console.log(chechKeys);
    securrentRights(chechKeys.checked)
  }
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        title="权限分配"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree checkable treeData={rightList} checkedKeys = {currentRights} onCheck={onCheck} checkStrictly={true}/>
      </Modal>
    </div>
  );
}
