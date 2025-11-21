import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useForm } from "@mantine/form";
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { authClient } from "../../lib/auth-client"
import { z } from "zod/v4";
import { Button, Center, Flex, LoadingOverlay, Paper, PasswordInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router'
import { useState } from "react";
import ErrorComponent from '../../components/misc/error';

export const Route = createFileRoute('/auth/reset-password')({
  component: RouteComponent,
  validateSearch: z.object({
    token: z.string().min(1),
  }),
  errorComponent: () => <ErrorComponent message="Invalid or missing token." buttonRedirectPath="/auth" buttonText="Back to Login" />,
})

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
})
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

function RouteComponent() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useSearch({ from: "/auth/reset-password", strict: true });

  const form = useForm<ResetPasswordInput>({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: zod4Resolver(resetPasswordSchema)
  });

  const handleResetPassword = async (data: ResetPasswordInput) => {
    await authClient.resetPassword({
      ...data,
      token: token
    },
      {
        onRequest: async () => {
          setLoading(true);
        },
        onError: error => {
          notifications.show({
            title: "Error",
            message: error.error.message,
            color: "red",
            withCloseButton: true,
            withBorder: true,
            icon: <IconX />
          });
          setLoading(false);
        },
        onSuccess: () => {
          notifications.show({
            title: "Password Reset",
            message: "Your password has been successfully reset.",
            color: "green",
            withCloseButton: true,
            withBorder: true,
            icon: <IconCheck />
          });
          setLoading(false);
          navigate({ to: "/auth" });
        }
      }
    );
  }

  return <>
    <Center h={"100%"} p={"md"}>
      <Paper withBorder p={"md"} pos={"relative"} w={{ base: "100%", sm: 600, lg: 500 }}>
        <Title order={3} mb="md">Forgot Password</Title>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm" }}
          loaderProps={{ type: 'bars' }} />
        <form onSubmit={form.onSubmit(handleResetPassword)}>
          <PasswordInput
            label="New Password"
            placeholder="New Password"
            {...form.getInputProps("newPassword")}
            mb={"md"}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm Password"
            {...form.getInputProps("confirmPassword")}
            mb={"md"}
          />
          <Flex justify={"center"}>
            <Button type="submit">
              Reset Password
            </Button>
          </Flex>
        </form>
      </Paper>
    </Center>
  </>
}