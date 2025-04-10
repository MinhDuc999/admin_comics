import React from "react";
import { useLogin } from "@refinedev/core";
import { Row, Col, Layout, Card, Typography } from "antd";
import { GoogleLogin } from "@react-oauth/google";

const { Title } = Typography;
const { Content } = Layout;

export const LoginPage: React.FC = () => {
  const { mutateAsync: login } = useLogin();

  const onSuccess = async (credentialResponse: any) => {
    if (credentialResponse?.credential) {
      const result = await login({ credential: credentialResponse.credential });

    
      if (result?.success && result?.redirectTo) {
        window.dispatchEvent(new Event("authChanged")); 
        window.location.href = result.redirectTo;
      }
    } else {
      console.error("Google login failed: no credential received.");
    }
  };

  return (
    <Layout style={{ height: "100vh", background: "#f0f2f5" }}>
      <Content>
        <Row justify="center" align="middle" style={{ height: "100%" }}>
          <Col xs={22} sm={18} md={12} lg={8} xl={6}>
            <Card
              style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
              title={
                <Title level={3} style={{ textAlign: "center", margin: 0 }}>
                  Đăng nhập quản trị
                </Title>
              }
            >
              <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
                <GoogleLogin
                  onSuccess={onSuccess}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
