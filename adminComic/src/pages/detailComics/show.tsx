import React from "react";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Card, Tabs, Divider } from "antd";
import { useParams } from "react-router-dom"; 
import { IDetailComic } from "../../interfaces";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const DetailComicShow: React.FC = () => {
  const { id } = useParams(); 

  const { queryResult } = useShow<IDetailComic>({
    resource: "detail_comics",
    id, 
    meta: {
      include: ["comic"],
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading} headerButtons={() => null}>
      {record && (
        <>
          <Title level={5}>ID</Title>
          <Text>{record.id}</Text>

          <Title level={5}>Truyện liên kết</Title>
          <Text>{record.comic?.title || "Không có thông tin"}</Text>

          <Divider orientation="left">Chi tiết nội dung</Divider>

          <Tabs defaultActiveKey="1">
            <TabPane tab="Nội dung" key="1">
              {record.sourceRead && record.sourceRead.length > 0 ? (
                record.sourceRead.map((content, index) => (
                  <Card key={index} style={{ marginBottom: 16 }}>
                    <Title level={5}>Nội dung {index + 1}</Title>
                    <Text>{content}</Text>
                  </Card>
                ))
              ) : (
                <Text>Không có nội dung</Text>
              )}
            </TabPane>
            <TabPane tab="Audio" key="2">
              {record.sourceAudio && record.sourceAudio.length > 0 ? (
                record.sourceAudio.map((audioUrl, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                    <Title level={5}>Audio {index + 1}</Title>
                    <audio controls src={audioUrl} style={{ width: "100%" }} />
                  </div>
                ))
              ) : (
                <Text>Không có audio</Text>
              )}
            </TabPane>
          </Tabs>
        </>
      )}
    </Show>
  );
};
