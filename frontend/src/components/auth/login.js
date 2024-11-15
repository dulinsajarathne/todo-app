
import { Input, Button, Form } from 'antd';
import { useAuth } from '../../context/authContext'; // Use the auth context

const Login = () => {
  const { handleLogin, setEmail, setPassword } = useAuth(); // Get functions from context

  // Handler for input changes
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <Form>
        <Input
          placeholder="Email"
          onChange={onEmailChange}
        />
        <Input.Password
          placeholder="Password"
          onChange={onPasswordChange}
        />
        <Button type="primary" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
