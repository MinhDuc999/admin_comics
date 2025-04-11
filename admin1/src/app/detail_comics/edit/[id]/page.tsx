"use client";

import React, { useEffect } from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, Button, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { IDetailComic, IComic } from "../../../interfaces";

export default function Page({ params }: { params: { id: string } }) {
  const { formProps, saveButtonProps, queryResult, form } = useForm<IDetailComic>({
    resource: "detail_comics",
    id: params.id,
    action: "edit",
    onMutationSuccess: () => {
      message.success("Chi tiết truyện đã được cập nhật thành công!");
    },
    onMutationError: (error) => {
      message.error("Có lỗi xảy ra khi cập nhật chi tiết truyện.");
      console.error("Lỗi cập nhật:", error);
    },
  });

  const detailComicData = queryResult?.data?.data;

  const { selectProps: comicSelectProps } = useSelect<IComic>({
    resource: "comics",
    optionLabel: "title",
    optionValue: "id",
    defaultValue: detailComicData?.comicId,
  });

  useEffect(() => {
    if (queryResult?.data?.data) {
      form.setFieldsValue(queryResult.data.data);
    }
  }, [queryResult?.data?.data, form]);

  const handleOnFinish = (values: any) => {
    const { id, ...dataWithoutId } = values;
    console.log("Dữ liệu gửi lên API:", dataWithoutId);
    formProps.onFinish?.(dataWithoutId);
  };

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      isLoading={queryResult?.isLoading}
      headerButtons={() => null}
    >
      <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item label="ID" name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Truyện"
          name="comicId"
          rules={[{ required: true, message: "Vui lòng chọn truyện" }]}
        >
          <Select
            {...comicSelectProps}
            placeholder="Chọn truyện"
            disabled
          />
        </Form.Item>

        <Form.List name="sourceRead">
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

        <Form.List name="sourceAudio" initialValue={[]}>
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
                    <Input placeholder="Đường dẫn tới file audio" />
                    <Button
                      type="text"
                      onClick={() => remove(name)}
                      icon={<MinusCircleOutlined />}
                      style={{ marginTop: 8, alignSelf: "flex-start" }}
                    >
                      Xóa audio này
                    </Button>
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
    </Edit>
  );
}