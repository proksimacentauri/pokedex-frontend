import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/session";

export const action = async ({ request }: ActionArgs) => logout(request);

export const loader = async () => redirect("/");
