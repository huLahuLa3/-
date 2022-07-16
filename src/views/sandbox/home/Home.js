import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, List, Avatar, Drawer } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import axios from "axios";
import * as Echarts from "echarts";
import _ from "lodash";
const { Meta } = Card;
export default function Home() {
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [allList, setallList] = useState([]);
  const [visible, setvisible] = useState(false);
  const [pieChart, setpieChart] = useState(null);
  const barRef = useRef();
  const pieRef = useRef();
  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`
      )
      .then((res) => {
        // console.log(res.data);
        setviewList(res.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`
      )
      .then((res) => {
        // console.log(res.data);
        setstarList(res.data);
        // console.log(_.groupBy(res.data, item => item.category.title));
      });
  }, []);

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      // console.log(res.data);
      console.log(_.groupBy(res.data, (item) => item.category.title));
      renderBarView(_.groupBy(res.data, (item) => item.category.title));
      setallList(res.data)
    });

    return () => {
      window.onresize = null;
    };
  }, []);

  const renderBarView = (obj) => {
    var myChart = Echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "ECharts 入门示例",
      },
      tooltip: {},
      legend: {
        data: ["数量"],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      // console.log(1);
      myChart.resize();
    };
  };

  const renderPieView = (obj) => {

    var currentList = allList.filter(item => item.author === username)
    // console.log(currentList);
    var groupobj = _.groupBy(currentList, item => item.category.title)
    var list = []
    for(var i in groupobj) {
      list.push({
        name:i,
        value: groupobj[i].length
      })
    }
    console.log(list);
    var myChart
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current);
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;

    option = {
      title: {
        text: "当前用户的新闻分类",
        // subtext: "Fake Data",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "发布数量",
          type: "pie",
          radius: "50%",
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    option && myChart.setOption(option);
  };

  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(window.sessionStorage.getItem("token"));
  return (
    <div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                // bordered
                dataSource={viewList}
                renderItem={(item) => (
                  <List.Item>
                    <a href={`#/news-manage/preview/${item.id}`}>
                      {item.title}
                    </a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered={true}>
              <List
                // bordered
                dataSource={starList}
                renderItem={(item) => (
                  <List.Item>
                    <a href={`#/news-manage/preview/${item.id}`}>
                      {item.title}
                    </a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <SettingOutlined
                  key="setting"
                  onClick={() => {
                    setTimeout(() => {
                      setvisible(true);
                      renderPieView();
                    }, 0);
                  }}
                />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={
                  <div>
                    <b>{region ? region : "全球"}</b>
                    <span style={{ paddingLeft: "30px" }}>{roleName}</span>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>

        <Drawer
          width="500px"
          title="个人新闻分类"
          placement="right"
          onClose={() => {
            setvisible(false);
          }}
          visible={visible}
        >
          <div
            ref={pieRef}
            style={{
              height: "400px",
              marginTop: "30px",
            }}
          ></div>
        </Drawer>

        <div
          ref={barRef}
          style={{
            height: "400px",
            marginTop: "30px",
          }}
        ></div>
      </div>
      ,
    </div>
  );
}
