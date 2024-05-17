import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Separator from "@/components/Separator";
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
import {
  Login_Schema,
  Login_Schema_type,
  Signup_Schema_type,
} from "@/lib/validation_feed_post";
import { UpdatePasswordAction } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const UpdatePassword = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);
  const { unreadMsgs } = useAppSelector((state) => state.staffmembers);

  const form = useForm<Signup_Schema_type>({
    resolver: zodResolver(Login_Schema),
    defaultValues: {
      fullname: "",
      username: "",
      password: "",
    },
  });
  /**
   * Handles the form submission for forgetting password.
   */
  const onSubmit = (values: Login_Schema_type) => {
    const confirmation = window.confirm(
      "Updating password will log you out. Are you sure you want to update the password?"
    );

    if (confirmation) {
      dispatch(UpdatePasswordAction(values)).then(() => {
        toast.success(
          "Password updated successfully. Login again with new password."
        );
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
          localStorage.removeItem("persistedRoot");
        }, 2000);
      });
    }
  };

  useEffect(() => {
    if (user) {
      form.setValue("username", user?.name);
    }
  }, [user]);

  return (
    <div className=" sm:py-10 ">
      <div className="w-full sm:max-w-3xl mx-auto sm:p-6 bg-white shadow-md rounded-md">
        <div className="w-full mb-4">
          <Header unread={unreadMsgs} />
        </div>
        <div className="m-4 sm:m-0 pb-4">
          <Separator>
            <h2 className="text-lg font-normal tracking-wide">Edit Password</h2>
          </Separator>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
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
              Changed Password?{" "}
              <Link
                to="/login"
                className="font-semibold underline text-red-500/90 text-md"
              >
                Log in Again
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
