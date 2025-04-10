import React, { useState } from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Switch, InputNumber, message, Button, Upload } from "antd";
import { IComic } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";

export const ComicCreate: React.FC = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const { formProps, saveButtonProps } = useForm<IComic>({
    resource: "comics",
    onMutationSuccess: (data) => {
      message.success("Truyện đã được tạo thành công!");
      console.log("Creation successful:", data);
      navigate("/comics");
    },
    onMutationError: (error) => {
      message.error("Có lỗi xảy ra khi tạo truyện.");
      console.error("Creation error:", error);
    }
  });

  const onFinish = async (values: any) => {
    try {
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        
        const uploadResponse = await fetch('http://localhost:3000/uploads', {
          method: 'POST',
          body: uploadFormData
        });
        
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Upload failed: ${errorText}`);
        }
        
        const uploadResult = await uploadResponse.json();
        console.log("Upload response:", uploadResult);
        
        if (uploadResult.status && uploadResult.data && uploadResult.data.url) {
          const comicData = {
            title: values.title,
            author: values.author,
            star: values.star,
            favorite: values.favorite,
            image: uploadResult.data.url
          };
          
          console.log("Sending comic data:", comicData);
          
          const comicResponse = await fetch('http://localhost:3000/comics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
            },
            body: JSON.stringify(comicData)
          });
          
          if (!comicResponse.ok) {
            const errorText = await comicResponse.text();
            throw new Error(`Comic creation failed: ${errorText}`);
          }
          
          const comicResult = await comicResponse.json();
          console.log("Comic creation result:", comicResult);
          
          message.success("Truyện đã được tạo thành công!");
          navigate("/comics");
        } else {
          throw new Error('Invalid upload response format');
        }
      } else {
        throw new Error('No image file selected');
      }
    } catch (error) {
      message.error(`Có lỗi xảy ra`);
      console.error("Error:", error);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const customFormProps = {
    ...formProps,
    onFinish: onFinish
  };

  return (
    <Create saveButtonProps={saveButtonProps} goBack={false}>
      <Form {...customFormProps} layout="vertical">
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
        
        {/* Upload ảnh từ máy tính */}
        <Form.Item
          label="Tải ảnh lên"
          name="imageUpload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng tải ảnh lên" }]}
        >
          <Upload
            name="file"
            listType="picture"
            maxCount={1}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              if (!isImage) {
                message.error('Chỉ chấp nhận file ảnh!');
                return Upload.LIST_IGNORE;
              }
              setImageFile(file);
              console.log("Image file set:", file.name);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
        
        <Form.Item
          label="Đánh giá"
          name="star"
          rules={[{ required: true, message: "Vui lòng nhập đánh giá" }]}
        >
          <InputNumber min={0} max={5} step={0.1} />
        </Form.Item>
        <Form.Item
          label="Yêu thích"
          name="favorite"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
};