import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { Signup_Schema, Signup_Schema_type } from "@/lib/validation_feed_post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/redux/features/AsyncThunk";
import { useEffect } from "react";
import Loading from "@/components/Loading";
const Sign_Up = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);

  const form = useForm<Signup_Schema_type>({
    resolver: zodResolver(Signup_Schema),
    defaultValues: {
      fullname: "",
      username: "",
      password: "",
      role: "carer",
    },
  });
  useEffect(() => {
    if (user !== null) {
      navigate("/");
    }
  }, [user]);
  /**
   * Handles the form submission for registering a new user.
   */
  const onSubmit = async (values: Signup_Schema_type) => {
    // Attempt to register the new user with the given credentials.
    dispatch(registerUser(values)).then((resultAction) => {
      // If the registration was successful, navigate to the login page.
      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/login");
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
          Register
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className=" py-2 flex  flex-col gap-2">
                  <FormLabel>Choose Your Role</FormLabel>
                  <FormControl className="flex-wrap">
                    <ToggleGroup
                      type="single"
                      onValueChange={field.onChange}
                      defaultValue={"carer"}
                    >
                      <ToggleGroupItem
                        value="manager"
                        aria-label="manager"
                        className="border h-7 px-2 rounded "
                      >
                        manager
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="nurse"
                        aria-label="nurse"
                        className="border h-7 px-2 rounded "
                      >
                        nurse
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="senior carer"
                        aria-label="senior carer"
                        className="border h-7 px-2 rounded "
                      >
                        senior carer
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="carer"
                        aria-label="carer"
                        className="border h-7 px-2 rounded "
                      >
                        carer
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="activitystaff"
                        aria-label="activity staff"
                        className="border h-7 px-2 rounded "
                      >
                        activity staff
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="physiotherapists"
                        aria-label="physiotherapists"
                        className="border h-7 px-2 rounded "
                      >
                        physiotherapist
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage className="px-2" />
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold underline text-red-500/90 text-md"
            >
              Log in here
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Sign_Up;
