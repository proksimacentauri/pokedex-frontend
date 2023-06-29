import { LinksFunction, LoaderArgs, V2_MetaFunction, json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from "./tailwind.css";
import {  getUser } from "./session";
import pokeIcon from "./assets/4.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from '@fortawesome/free-solid-svg-icons';
export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: V2_MetaFunction = () => [
  { title: "PokeDex" },
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
];

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  const userData =  await user.json();
  return json({ user: userData.user });
};

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  let newNotifications = [];
  if (user) {
  console.log(user)
    newNotifications = user!.notifications?.filter((notification: INotification) => !notification.acknowledged) || [];
  }  
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-screen m-0">
        { user &&
          (<Form className="flex mx-2 justify-between bg-white rounded-b-lg p-2" action="/logout" method="post">
            <Link className="flex text-gray-700 no-underline mx-2" to={"/pokemons"}>
              <img style={{ width: 30, height: 30 }} src={pokeIcon} />
              <p className="my-0 mx-2 self-center">Pokedex</p>
            </Link>
            <div className="flex">
              <Link style={{position: "relative"}} className="mx-2  self-center"to="/notifications">
                <FontAwesomeIcon icon={faBell}  style={{ width: 20, height: 20,color: "#ffef85",}} />
                {newNotifications.length > 0 && (<span
                  className="text-white text-center bg-red-600 rounded-full"
                  style={{position: "absolute", width: 15, height: 15, bottom: 0, right: 0}}
                >
                  {newNotifications.length}
                </span>)}
              </Link>
              <button
                type="submit"
                className="transition ease-in duration-100 rounded border-transparent bg-red-500 px-1 py-2 text-white hover:bg-red-300 active:bg-red-300"
              >
                Logout
              </button>
            </div>
          </Form>)}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
