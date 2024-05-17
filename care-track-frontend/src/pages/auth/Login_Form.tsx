import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Login_Schema, Login_Schema_type } from "@/lib/validation_feed_post";
import { loginUser } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
const Login_Form = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);
  const form = useForm<Login_Schema_type>({
    resolver: zodResolver(Login_Schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user !== null) {
      navigate("/");
    }
  }, [user]);
  /**
   * Handles the form submission for logging in.
   */
  const onSubmit = (values: Login_Schema_type) => {
    // Attempt to log the user in with the given credentials.
    dispatch(loginUser(values)).then((resultAction) => {
      // If the login was successful, navigate to the root page.
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/");
      }
    });
  };

  return (
    <div className=" sm:py-10 ">
      <div className="w-full sm:max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="sm:text-xl flex flex-col items-center font-semibold max-w-prose sm:font-bold  text-center leading-snug ">
          Care Track Central
        </h1>
        <p className="sm:text-xl flex flex-col items-center font-medium max-w-prose sm:font-semibold text-center leading-snug">
          Login
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="John" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant={"secondary"}
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? <Loading /> : "Submit"}
            </Button>
          </form>
          <p className="mt-6 text-center text-gray-500">
            Dont't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold underline text-red-500/90 text-md"
            >
              Signup here
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login_Form;
