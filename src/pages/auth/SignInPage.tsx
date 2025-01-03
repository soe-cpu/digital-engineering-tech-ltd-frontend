import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthResponse } from "@/types/auth";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { NavLink, useNavigate } from "react-router-dom";
interface FormValues {
  email: string;
  password: string;
}

const SignInPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = import.meta.env.VITE_BACKEND_PORT;
      const email = formData.email;
      const password = formData.password;
      const response = await axios.post<AuthResponse>(`${url}auth/sign-in`, {
        email,
        password,
      });

      if (response.data.status == 200) {
        // Store token in localStorage
        localStorage.setItem("jwtToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        navigate("/");
      } else {
        if (response.data.validate_error_message.email) {
          setErrorEmail(response.data.validate_error_message.email[0]);
        }
        if (response.data.validate_error_message.password) {
          setErrorPassword(response.data.validate_error_message.password[0]);
        }
        if (response.data.message) {
          setErrorMessage(response.data.message);
        }
      }
    } catch (error) {
      setErrorMessage("Credentials does not match!");
    }
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>DETL - SignIn</title>
      </Helmet>
      <div className="w-full min-h-[100vh]  flex justify-center items-center">
        <div className="bg-white lg:min-w-[400px] rounded shadow-lg p-10">
          <p className="text-center text-slate-600 text-xl font-semibold mb-6">
            Sign In
          </p>
          {errorMessage ? (
            <Alert variant={"destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : (
            ""
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <div>
              <Label
                htmlFor="email"
                className={errorEmail ? "text-red-500" : ""}
              >
                Email
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={errorEmail ? "border-red-500" : ""}
              />
              {errorEmail ? (
                <p className="text-red-500 text-sm">{errorEmail}</p>
              ) : (
                ""
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errorPassword ? (
                <p className="text-red-500 text-sm">{errorPassword}</p>
              ) : (
                ""
              )}
            </div>
            <div>
              <Button
                type="submit"
                disabled={submitted}
                className="w-full flex"
              >
                Sign In
              </Button>
            </div>
            <div>
              <p>
                Do not have an account?{" "}
                <NavLink to={"/sign-up"} className={"text-blue-500 underline"}>
                  Sign Up
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
