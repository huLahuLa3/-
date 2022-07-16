import React, { useEffect, useState } from "react";
import { PageHeader, Button, Descriptions} from "antd";
import { HeartTwoTone } from '@ant-design/icons';

import moment from "moment";
import axios from "axios";
export default function Detail(props) {
  const [newsIngo, setnewsInfo] = useState(null);
  useEffect(() => {
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        setnewsInfo({
            ...res.data,
            view: res.data.view+1
        });
        return res
      }).then(res => {
          axios.patch(`/news/${props.match.params.id}`, {
              view: res.data.view + 1
          })
      });
  }, [props.match.params.id]);


  const handleStar = () => {
      setnewsInfo({
          ...newsIngo,
          star: newsIngo.star + 1
      })

      axios.patch(`/news/${props.match.params.id}`, {
          star: newsIngo.star + 1
      })
  }
  return (
    <div>
      {newsIngo && (
        <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsIngo.title}
            subTitle={
                <div>{newsIngo.category.title} <HeartTwoTone twoToneColor="#eb2f96" onClick={() => handleStar()}/></div>
            }
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsIngo.author}</Descriptions.Item>
              <Descriptions.Item label="发布时间">
                  {
                      newsIngo.publishTime ? moment(newsIngo.createTime).format('YYYY/MM/DD HH:MM:SS') : '-'
                  }
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                  {
                      newsIngo.region
                  }
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">{newsIngo.view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{newsIngo.star}</Descriptions.Item>
              <Descriptions.Item label="发布数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>

          <div dangerouslySetInnerHTML={{__html:newsIngo.content}} style={{margin:'0 24px', border:'1px solid gray'}}></div>
        </div>
      )}
    </div>
  );
}
