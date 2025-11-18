import { Button } from "@mantine/core";
import { useState } from "react";

export function BetterAuthActionButton({
    action,
    children,
    ...props
}: {
    action: () => Promise<{ error: null | { message?: string } }>;
    children: React.ReactNode
} & React.ComponentProps<typeof Button>) {
    const [loading, setLoading] = useState(false);
    return (
        <Button
            {...props}
            loading={loading}
            loaderProps={{ type: "dots", color: "white" }}
            onClick={async () => {
                setLoading(true);
                const res = await action();
                setLoading(false);
                return res;
            }}
        >
            {children}
        </Button>
    );
}