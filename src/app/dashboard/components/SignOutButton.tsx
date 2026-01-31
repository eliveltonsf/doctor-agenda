"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import { redirect } from "next/navigation";

const SignOutButton = () => {
  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              redirect("/authentication");
            },
          },
        })
      }
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
