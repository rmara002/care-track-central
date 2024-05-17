import Header from "@/components/Header";
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
import { Label } from "@/components/ui/label";
import {
  Login_Schema_type,
  Signup_Schema_type,
} from "@/lib/validation_feed_post";
import { updateProfile } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { UserCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Separator from "@/components/Separator";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";

/**
 * Renders the ProfileUpdate component.
 *
 * @return {JSX.Element} The rendered ProfileUpdate component.
 */
const ProfileUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.user);
  const { unreadMsgs } = useAppSelector((state) => state.staffmembers);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<Signup_Schema_type>({
    defaultValues: {
      fullname: "",
      username: "",
    },
  });

  /**
   * Handles the form submission for updating the user profile.
   */
  const onSubmit = (values: Login_Schema_type) => {
    const profileData: any = {
      fullname: values.fullname,
      file,
    };
    if (values.fullname || file) {
      dispatch(updateProfile(profileData));
    }
  };

  useEffect(() => {
    if (user == null) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      form.setValue("username", user?.name);
      form.setValue("fullname", user?.fullname);
    }
  }, [user]);

  return (
    <div className=" sm:py-10 ">
      <div className="w-full sm:max-w-3xl mx-auto sm:p-6 bg-white shadow-md rounded-md">
        <div className="w-full mb-4">
          <Header unread={unreadMsgs} />
        </div>
        <div className="m-4 sm:m-0">
          <Separator>
            <h2 className="text-lg font-normal tracking-wide">
              Edit User Profile
            </h2>
          </Separator>
          {file ? (
            <img
              alt=""
              src={URL.createObjectURL(file)}
              className="w-40 rounded-full h-40 m-auto mb-10"
            />
          ) : user?.icon ? (
            <img
              src={user?.icon}
              alt=""
              className="w-40 rounded-full h-40 m-auto mb-10"
            />
          ) : (
            <UserCircleIcon className="text-gray-500  w-40 h-40 m-auto mb-10" />
          )}

          <Label>Profile Icon</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="text"
                        {...field}
                        disabled
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
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
