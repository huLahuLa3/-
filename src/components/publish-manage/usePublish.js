import axios from "axios";
import React, { useEffect, useState } from "react";
import {notification} from 'antd'
function usePublish(type) {
  const { username } = JSON.parse(window.sessionStorage.getItem("token"));

  const [dataSource, setdataSource] = useState([]);
  useEffect(() => {
    axios
      .get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then((res) => {
        // console.log(res.data);
        setdataSource(res.data);
      });
  }, [username, type]);

  const handlePublish = (id) => {
    //   console.log(id);
    setdataSource(dataSource.filter(item => item.id !== id))

    axios.patch(`/news/${id}`, {
        'publishState': 2,
        'publishTime': Date.now()
      }).then(res => {
        notification.info({
          message: `通知`,
          description:
            `您可以到【发布管理/已经发布】已发布中查看您的新闻`,
          placement:'bottomRight'
        })
      })
  };

  const handleSunset = (id) => {
    setdataSource(dataSource.filter(item => item.id !== id))

    axios.patch(`/news/${id}`, {
        'publishState': 3
      }).then(res => {
        notification.info({
          message: `通知`,
          description:
            `您可以到【发布管理/已经下线】已发布中查看您的新闻`,
          placement:'bottomRight'
        })
      })
  };

  const handleDelete = (id) => {
    setdataSource(dataSource.filter(item => item.id !== id))

    axios.delete(`/news/${id}`).then(res => {
        notification.info({
          message: `通知`,
          description:
            `您已经删除了已下线的新闻了`,
          placement:'bottomRight'
        })
      })
  };
  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
  };
}

export default usePublish;
