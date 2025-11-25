import { Button, Center, LoadingOverlay, Paper, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useState } from "react";
import { z } from "zod/v4";
import { authClient } from "../../lib/auth-client";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react";

const accountUpdateSchema = z.object({
  name: z.string().min(1),                                                // Name is required
  email: z.email(),                                                       // Email is required and must be valid
});

type AccountUpdateInput = z.infer<typeof accountUpdateSchema>;

export default function AccountUpdateTab({
  name,
  email
}: {
  name: string;
  email: string
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<AccountUpdateInput>({
    initialValues: {
      name: name,
      email: email,
    },
    validate: zod4Resolver(accountUpdateSchema)
  });

  const handleAccountUpdate = async (data: AccountUpdateInput) => {
    const promises = [
      authClient.updateUser({ name: data.name })
    ];
    if (data.email !== email) {
      promises.push(authClient.changeEmail({
        newEmail: data.email,
        callbackURL: `${import.meta.env.VITE_CALLBACK_URL}/account`
      }))
    }

    const res = await Promise.all(promises);

    const updateUserResult = res[0];
    const changeEmailResult = res[1] ?? { error: null };
    console.log({ updateUserResult, changeEmailResult });

    if (updateUserResult.error) {
      notifications.show({
        title: "Error",
        message: updateUserResult.error.message || "Failed to update account",
        color: "red",
        withCloseButton: true,
        withBorder: true,
        icon: <IconX />,
      });
    } else if (changeEmailResult.error) {
      notifications.show({
        title: "Error",
        message: changeEmailResult.error.message || "Failed to change email",
        color: "red",
        withCloseButton: true,
        withBorder: true,
        icon: <IconX />,
      });
    } else {
      if (data.email !== email) {
        notifications.show({
          title: "Email Change Requested",
          message: "Please check your new email to verify the change.",
          color: "blue",
          withCloseButton: true,
          withBorder: true,
          icon: <IconExclamationMark />,
        });
      } else {
        notifications.show({
          title: "Success",
          message: "Account updated successfully",
          color: "green",
          withCloseButton: true,
          withBorder: true,
          icon: <IconCheck />,
        });
      }
    }
  };

  return (
    <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} pos={"relative"}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ type: 'bars' }} />
      <form onSubmit={form.onSubmit(handleAccountUpdate)}>
        <TextInput
          label="Name"
          placeholder="Name"
          {...form.getInputProps("name")}
          mb={"md"}
        />
        <TextInput
          label="Email"
          placeholder="Email"
          {...form.getInputProps("email")}
          mb={"md"}
        />
        <Center>
          <Button type="submit">
            Update Account
          </Button>
        </Center>
      </form>
    </Paper>
  )
}