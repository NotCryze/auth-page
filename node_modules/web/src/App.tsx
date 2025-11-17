import { useForm } from "@mantine/form";
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { authClient } from "./lib/auth-client"
import { z } from "zod/v4";
import { Box, Button, PasswordInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string().min(6),
});

type SignUpInput = z.infer<typeof signUpSchema>;

function App() {
  const form = useForm<SignUpInput>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: zod4Resolver(signUpSchema)
  });

  const handleSignUp = async (data: SignUpInput) => {
    await authClient.signUp.email({ ...data }, {
      onError: error => {
        notifications.show({
          title: "Error",
          message: error.error.message,
          color: "red",
        });
      },
    });
  };

  return (
    <>
      <Box mx="auto" mt="2rem">
        <form onSubmit={form.onSubmit(handleSignUp)}>
          <TextInput
            label="Name"
            placeholder="Your name"
            {...form.getInputProps("name")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            {...form.getInputProps("email")}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            required
            mt="sm"
          />
          <Button type="submit" fullWidth mt="xl">
            Sign Up
          </Button>
        </form>
      </Box>
    </>
  )
}

export default App
