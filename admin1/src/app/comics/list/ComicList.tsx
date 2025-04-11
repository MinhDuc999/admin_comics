"use client";

import React from "react";
import { useTable, List, DeleteButton } from "@refinedev/antd";
import { Table, Space, Rate, Button } from "antd";
import { IComic } from "../../interfaces";
import { useNavigation } from "@refinedev/core";

interface CustomError {
  message?: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
      statusCode?: number;
    };
  };
}

export default function ComicList() {
  const { tableProps } = useTable<IComic>({
    resource: "comics",
  });

  const { create, edit } = useNavigation();

  return (
    <List
      headerButtons={
        <Button type="primary" onClick={() => create("comics")}>
          Tạo mới
        </Button>
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="title" title="Tiêu đề" />
        <Table.Column dataIndex="author" title="Tác giả" />
        <Table.Column
          dataIndex="image"
          title="Ảnh bìa"
          render={(value) => (
            <img src={value} alt="cover" style={{ height: "50px" }} />
          )}
        />
        <Table.Column
          dataIndex="star"
          title="Đánh giá"
          render={(value) => <Rate allowHalf disabled value={parseFloat(value)} />}
        />
        <Table.Column
          dataIndex="favorite"
          title="Yêu thích"
          render={(value) => (value ? "Có" : "Không")}
        />
        <Table.Column
          title="Thao tác"
          render={(_, record: IComic) => (
            <Space>
              <Button
                size="small"
                onClick={() => edit("comics", record.id)}
                icon={<span>✏️</span>}
              />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                resource="comics"
                successNotification={() => ({
                  message: "Xóa thành công",
                  description: "Truyện đã được xóa thành công",
                  type: "success",
                })}
                errorNotification={(error: unknown) => {
                  const typedError = error as CustomError;

                  const message =
                    typedError?.response?.data?.message || typedError?.message || "";
                  const errorDetail =
                    typedError?.response?.data?.error || "";

                  if (
                    message.includes("foreign key") ||
                    errorDetail.includes("foreign key") ||
                    message.includes("detail_comics") ||
                    errorDetail.includes("detail_comics")
                  ) {
                    return {
                      message: "Không thể xóa",
                      description:
                        "Truyện này có liên quan đến chi tiết truyện, không thể xóa.",
                      type: "error",
                    };
                  }

                  return {
                    message: "Xóa thất bại",
                    description: "Có lỗi xảy ra khi xóa truyện.",
                    type: "error",
                  };
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
