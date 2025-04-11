"use client";

import React from "react";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, Button, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { IDetailComic, IComic } from "../../interfaces";

const DetailComicCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<IDetailComic>({
    resource: "detail_comics",
    onMutationSuccess: () => {
      message.success("Chi tiết truyện đã được tạo thành công!");
    },
    onMutationError: (error) => {
      message.error("Có lỗi xảy ra khi tạo chi tiết truyện.");
      console.error("Creation error:", error);
    },
  });

  const { selectProps: comicSelectProps } = useSelect<IComic>({
    resource: "comics",
    optionLabel: "title",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps} goBack={false}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Truyện"
          name="comicId"
          rules={[{ required: true, message: "Vui lòng chọn truyện" }]}
        >
          <Select {...comicSelectProps} placeholder="Chọn truyện" />
        </Form.Item>

        <Form.List name="sourceRead" initialValue={[""]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Form.Item
                  key={key}
                  label={`Nội dung ${name + 1}`}
                  {...restField}
                  name={[name]}
                  rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Input.TextArea rows={4} />
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                        style={{ marginTop: 8, alignSelf: "flex-start" }}
                      >
                        Xóa nội dung này
                      </Button>
                    )}
                  </div>
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm nội dung
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.List name="sourceAudio">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Form.Item
                  key={key}
                  label={`Audio ${name + 1}`}
                  {...restField}
                  name={[name]}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Input placeholder="Đường dẫn tới file audio (tùy chọn)" />
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                        style={{ marginTop: 8, alignSelf: "flex-start" }}
                      >
                        Xóa audio này
                      </Button>
                    )}
                  </div>
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm audio
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Create>
  );
}
export default DetailComicCreate