import React, { useEffect, useState, useRef } from "react";
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from "antd";
import style from "./News.module.css";
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";
const { Step } = Steps;
const { Option } = Select;
// import style from 'newssystem3\src\views\sandbox\news-manage\News.module.css'

export default function NewsUpdate(props) {
  const [current, setcurrent] = useState(0);
  const [categoryList, setcategoryList] = useState([]);
  const [formInfo, setformInfo] = useState({});
  const [content, setcontent] = useState("");
//   const User = JSON.parse(window.sessionStorage.getItem("token"));
  const handelNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setformInfo(res);
          setcurrent(current + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // console.log(formInfo, content);
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空");
      } else {
        setcurrent(current + 1);
      }
    }
  };
  const hnadelPrevious = () => {
    setcurrent(current - 1);
  };
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const NewsForm = useRef(null);
  useEffect(() => {
    axios.get("/categories").then((res) => {
      // console.log(res.data);
      setcategoryList(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        // setnewsInfo(res.data);
        const {title, categoryId, content} = res.data
        NewsForm.current.setFieldsValue({
            title,
            categoryId
        })
        setcontent(content)
      });
  }, [props.match.params.id]);


  const handleSave = (auditState) => {
    axios.patch(`/news/${props.match.params.id}`, {
      ...formInfo,
      'content': content,
      'auditState': auditState,
      // 'publishTime': 0,
    }).then(res => {
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement:'bottomRight',
      })
    })
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={() => props.history.goBack()}
        subTitle="This is a subtitle"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>

      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form {...layout} name="basic" ref={NewsForm}>
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Select>
                {categoryList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>
          <NewsEditor
            getContent={(value) => {
              setcontent(value);
            }}
            content={content}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.active}></div>
      </div>

      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button type="danger" onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={() => handelNext()}>
            下一步
          </Button>
        )}
        {current > 0 && (
          <Button onClick={() => hnadelPrevious()}>上一步</Button>
        )}
      </div>
    </div>
  );
}
