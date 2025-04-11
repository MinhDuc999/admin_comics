"use client";

import React from "react";
import { useTable, List, DeleteButton } from "@refinedev/antd";
import { Table, Space, Button } from "antd";
import { IDetailComic } from "../../../src/app/interfaces";
import { useNavigation } from "@refinedev/core";

export default function DetailComicList() {
  const { tableProps } = useTable<IDetailComic>({
    resource: "detail_comics",
    meta: {
      include: ["comic"],
    },
  });

  const { create, edit, show } = useNavigation();

  return (
    <List
      headerButtons={
        <Button type="primary" onClick={() => create("detail_comics")}>
          Tạo mới
        </Button>
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column
          dataIndex={["comic", "title"]}
          title="Truyện"
          render={(value) => value || "Không có thông tin"}
        />
        <Table.Column
          dataIndex="sourceRead"
          title="Số phần nội dung"
          render={(value) => value?.length || 0}
        />
        <Table.Column
          dataIndex="sourceAudio"
          title="Số phần audio"
          render={(value) => value?.length || 0}
        />
        <Table.Column
          title="Thao tác"
          render={(_, record: IDetailComic) => (
            <Space>
              <Button size="small" onClick={() => show("detail_comics", record.id)}>
                Xem
              </Button>
              <Button
                size="small"
                onClick={() => edit("detail_comics", record.id)}
                icon={<span>✏️</span>}
              />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                resource="detail_comics"
                successNotification={() => ({
                  message: "Xóa thành công",
                  description: "Chi tiết truyện đã được xóa thành công",
                  type: "success",
                })}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}