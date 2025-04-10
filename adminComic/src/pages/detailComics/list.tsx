import React from "react";
import { useTable, List, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table, Space, Button, message } from "antd";
import { IDetailComic } from "../../interfaces";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

export const DetailComicList: React.FC = () => {
  const { tableProps } = useTable<IDetailComic>({
    resource: "detail_comics",
    meta: {
      include: ["comic"],
    },
  });
  
  return (
    <List 
      headerButtons={
        <Link to="/detail_comics/create">
          <Button type="primary">Tạo mới</Button>
        </Link>
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
              <Link to={`/detail_comics/show/${record.id}`}>
                <Button size="small">Xem</Button>
              </Link>
              <Link to={`/detail_comics/edit/${record.id}`}>
                <Button size="small" icon={<EditOutlined />} />
              </Link>
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
};