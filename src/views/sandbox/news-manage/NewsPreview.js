import React, { useEffect, useState } from "react";
import { PageHeader, Button, Descriptions} from "antd";
import moment from "moment";
import axios from "axios";
export default function NewsPreview(props) {
  const [newsIngo, setnewsInfo] = useState(null);
  useEffect(() => {
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        setnewsInfo(res.data);
      });
  }, [props.match.params.id]);

  const auditList = ['未审核','审核中','已通过','未通过']
  const publishList = ['未发布','待发布','已上线','已下线']
  const colorList = ['black', 'orange', 'green', 'red']
  return (
    <div>
      {newsIngo && (
        <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsIngo.title}
            subTitle={newsIngo.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsIngo.author}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{moment(newsIngo.createTime).format('YYYY/MM/DD HH:MM:SS')}</Descriptions.Item>
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
              <Descriptions.Item label="审核状态" >
                  <span style={{color:colorList[newsIngo.auditState]}}>
                  {
                      auditList[newsIngo.auditState]
                  }
                  </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态" >
                  <span style={{color:colorList[newsIngo.publishState]}}>
                  {
                      publishList[newsIngo.publishState]
                  }
                  </span>
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
