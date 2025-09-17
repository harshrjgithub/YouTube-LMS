import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { Loader, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "@/features/api/authApi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [activeTab, setActiveTab] = useState("login"); // Default to login tab

  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [registerUser, { data: registerData, error: registerError, isLoading: registerLoading, isSuccess: registerSuccess }] = useRegisterMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginLoading, isSuccess: loginSuccess }] = useLoginMutation();

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    type === "signup"
      ? setSignupInput({ ...signupInput, [name]: value })
      : setLoginInput({ ...loginInput, [name]: value });
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerSuccess && registerData) {
      toast.success(registerData.message || "🎉 Registered Successfully!");
      // Switch to login tab after successful registration
      setActiveTab("login");
      // Clear registration form
      setSignupInput({ name: "", email: "", password: "" });
    }
    if (registerError) {
      toast.error(registerError.data?.message || "❌ Couldn't register you.");
    }
    if (loginSuccess && loginData) {
      toast.success(loginData.message || "🔥 Logged In!");
      
      // Update auth context
      authLogin(loginData.user);
      
      // Role-based redirection
      if (loginData.user.role === 'admin' && loginData.user.email === 'adminlms@gmail.com') {
        console.log('🔑 Admin login detected, redirecting to admin dashboard');
        navigate("/admin/dashboard");
      } else {
        console.log('👤 Student login detected, redirecting to courses');
        navigate("/courses");
      }
    }
    if (loginError) {
      toast.error(loginError.data?.message || "😓 Invalid login credentials.");
    }
  }, [registerData, registerError, loginData, loginError, authLogin, navigate]);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white dark:bg-[#0e0c1b] px-4 transition-all duration-500">
      {/* Theme Toggle Button */}
      <Button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-5 right-5 rounded-full p-2 bg-gray-200 dark:bg-gray-800"
        variant="ghost"
      >
        {theme === "dark" ? <Sun className="text-yellow-300" /> : <Moon className="text-purple-700" />}
      </Button>

      {/* Tab Switcher */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* Animate switching between the tabs */}
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "signup" ? (
            <TabsContent value="signup" forceMount>
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white dark:bg-[#1c1a2e] transition-colors border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Start your learning journey 🚀</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input name="name" value={signupInput.name} placeholder="John Doe" onChange={(e) => handleInputChange(e, "signup")} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input name="email" value={signupInput.email} type="email" placeholder="you@example.com" onChange={(e) => handleInputChange(e, "signup")} />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input name="password" value={signupInput.password} type="password" placeholder="••••••••" onChange={(e) => handleInputChange(e, "signup")} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button disabled={registerLoading} onClick={() => handleRegistration("signup")} className="w-full">
                      {registerLoading ? <Loader className="animate-spin" /> : "Sign Up"}
                    </Button>
                    <Button variant="outline" className="w-full">Continue with Google</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
          ) : (
            <TabsContent value="login" forceMount>
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white dark:bg-[#1c1a2e] transition-colors border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Welcome Back 👋</CardTitle>
                    <CardDescription>Log in to your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input name="email" value={loginInput.email} type="email" placeholder="you@example.com" onChange={(e) => handleInputChange(e, "login")} />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input name="password" value={loginInput.password} type="password" placeholder="••••••••" onChange={(e) => handleInputChange(e, "login")} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button disabled={loginLoading} onClick={() => handleRegistration("login")} className="w-full">
                      {loginLoading ? <Loader className="animate-spin" /> : "Login"}
                    </Button>
                    <Button variant="outline" className="w-full">Continue with Google</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default Login;
