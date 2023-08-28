import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type UserData = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
  });

  const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password } = data;

    try {
      const response = await axios.post("/register", {
        name,
        email,
        password,
      });
      const responseData = response.data;

      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        setData({
          name: "",
          email: "",
          password: "",
        });
        toast.success("Register Successful. Welcome!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <form onSubmit={registerUser}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={data.name}
          onChange={handleInputChange}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={data.email}
          onChange={handleInputChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={data.password}
          onChange={handleInputChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
