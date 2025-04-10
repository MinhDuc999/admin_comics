import React, { useEffect, useState } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, InputNumber, message, Button, Upload } from "antd";
import { IComic } from "../../interfaces";
import { useNavigate, useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

export const ComicEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    formProps,
    saveButtonProps,
    queryResult,
    form,
  } = useForm<IComic>({
    resource: "comics",
    id: id as string,
    action: "edit",
    onMutationSuccess: () => {
      message.success("Truyện đã được cập nhật thành công!");
      navigate("/comics");
    },
    onMutationError: (error) => {
      message.error("Có lỗi xảy ra khi cập nhật truyện.");
      console.error("Lỗi cập nhật:", error);
      console.error("Chi tiết lỗi từ server:", error.response?.data);
    },
  });

  useEffect(() => {
    if (queryResult?.data?.data) {
      form.setFieldsValue(queryResult.data.data);
    }
  }, [queryResult?.data?.data, form]);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleOnFinish = async (values: any) => {
    try {
      let imageUrl = values.image;
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);

        const uploadResponse = await fetch("http://localhost:3000/uploads", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();
        if (uploadResult.status && uploadResult.data?.url) {
          imageUrl = uploadResult.data.url;
        } else {
          throw new Error("Upload response format is invalid");
        }
      }

      const formattedData = {
        title: values.title,
        author: values.author,
        image: imageUrl,
        star: Number(values.star),
        favorite: Boolean(values.favorite),
      };

      console.log("Dữ liệu gửi lên API:", formattedData);
      formProps.onFinish?.(formattedData);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật truyện.");
      console.error("Upload or update error:", error);
    }
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
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tác giả"
          name="author"
          rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
        >
          <Input />
        </Form.Item>

        {/* Upload ảnh */}
        <Form.Item
          label="Tải ảnh mới (nếu muốn thay đổi)"
          name="imageUpload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="file"
            listType="picture"
            maxCount={1}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("Chỉ chấp nhận file ảnh!");
                return Upload.LIST_IGNORE;
              }

              setImageFile(file);
              return false; 
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {/* Hiện đường dẫn ảnh hiện tại */}
        {queryResult?.data?.data?.image && (
          <Form.Item label="Ảnh hiện tại">
            <img
              src={queryResult.data.data.image}
              alt="current"
              style={{ maxWidth: "200px", borderRadius: 8 }}
            />
          </Form.Item>
        )}

        <Form.Item
          label="Đánh giá"
          name="star"
          rules={[{ required: true, message: "Vui lòng nhập đánh giá" }]}
        >
          <InputNumber min={0} max={5} step={0.1} />
        </Form.Item>
        <Form.Item label="Yêu thích" name="favorite" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
};
