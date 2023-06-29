import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getSession, getUser } from "~/session";

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await getUser(request);
  if (!user) {
    return redirect("/");
  }

  const data = await user.json();
  const newNotifications: INotification[] = data.user.notifications?.filter((notification: INotification) => !notification.acknowledged) || [];
  const oldNotifications: INotification[] = data.user.notifications?.filter((notification: INotification) => notification.acknowledged) || [];

  const body = {
    userId: data.user.id,
    notificationIds: newNotifications.map((newNotifications) => newNotifications.id),
  }
  var session = await getSession(request);
  await fetch(`${process.env.CMS_URL}/api/users/acknowledgeNotifications`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `JWT ${session.data['payload-token']}`,
      "Content-type": "Application/Json",
    },
    body: JSON.stringify(body)
  })

  return json({ id: params.id, newNotifications, oldNotifications });
};

export default function NotificationsINdex() {
  const { newNotifications, oldNotifications } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col">
      <div className="grid my-2 place-items-center grid-cols-1 gap-2">
        <h3 className="">New notifications:</h3>
        {newNotifications.length > 0 ? newNotifications.map((notification) => (
          <div className="flex flex-col p-4 shadow-md rounded w-2/3 bg-indigo-300 rounded-lg" key={notification.id}>
            Pokemon with ID {notification.pokemonId} was also liked by {notification.likedBy}!!  :{')'}
          </div>
        )
        ) : (<div className="flex flex-col">
          No new notifcations
        </div>)}
      </div>
      <div className="grid my-2 place-items-center grid-cols-1 gap-2">
        <h3>Old notifications:</h3>
        {oldNotifications.length > 0 ? oldNotifications.map((notification) => (
          <div className="flex flex-col text-white p-4 shadow-md rounded w-2/3 bg-slate-700 rounded-lg" key={notification.id}>
            Pokemon with ID {notification.pokemonId} was also liked by {notification.likedBy}!!  :{')'}
          </div>
        )) : (<div className="flex flex-col">
        No old notifcations
      </div>)}
      </div>
    </div>
  );
}
