"use client";

import React from "react";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Divider, Rate, Tabs, Card } from "antd";
import { IComic } from "../../../interfaces";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function ComicShow({ params }: { params: { id: string } }) {
  const { queryResult } = useShow<IComic>({
    resource: "comics",
    id: params.id,
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    
    <Show isLoading={isLoading}>
      {record && (
        <>
          <Title level={5}>Tiêu đề</Title>
          <Text>{record.title}</Text>

          <Title level={5}>Tác giả</Title>
          <Text>{record.author}</Text>

          <Title level={5}>Ảnh bìa</Title>
          <img
            src={record.image}
            alt={record.title}
            style={{ maxWidth: "300px" }}
          />

          <Title level={5}>Đánh giá</Title>
          <Rate disabled defaultValue={parseFloat(record.star)} />

          <Divider orientation="left">Chi tiết truyện</Divider>

          {record.detailComics && record.detailComics.length > 0 && (
            <Tabs defaultActiveKey="1">
              <TabPane tab="Nội dung" key="1">
                {record.detailComics[0].sourceRead.map((content, index) => (
                  <Card key={index} style={{ marginBottom: 16 }}>
                    <Text>{content}</Text>
                  </Card>
                ))}
              </TabPane>
              <TabPane tab="Audio" key="2">
                {record.detailComics[0].sourceAudio.map((audioUrl, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                    <audio controls src={audioUrl} style={{ width: "100%" }} />
                  </div>
                ))}
              </TabPane>
            </Tabs>
          )}
        </>
      )}
    </Show>
  );
}