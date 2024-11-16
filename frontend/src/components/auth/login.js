import { Input, Button, Form } from "antd";
import { useAuth } from "../../context/authContext"; // Use the auth context
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../common/backgroundImage.jpg";
import "../pages/landingPage.css";

const Login = () => {
  const { handleLogin, setEmail, setPassword } = useAuth(); // Get functions from context
  const navigate = useNavigate();

  // Handler for input changes
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Navigate to Forgot Password page
  const goToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="landing-container">
    <div className='text-section' style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{padding:'20px 0'}}>Login</h2>
      <Form >
        <Form.Item>
          <Input placeholder="Email" onChange={onEmailChange} />
        </Form.Item>
        <Form.Item>
          <Input.Password placeholder="Password" onChange={onPasswordChange} />
        </Form.Item>
        <Button type="primary" onClick={handleLogin}>
          Login
        </Button>
        <Button type="link" onClick={goToForgotPassword}>
          Forgot Password?
        </Button>

      </Form>
      
    </div>
    <div className="image-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}></div>
    </div>
  );
};

export default Login;
