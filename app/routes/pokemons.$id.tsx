import { ActionArgs, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { STAT_COLORS, STAT_SHORT_NAMES, TYPE_COLORS } from "~/constants";
import { getUser } from "~/session";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import NotificationItem from "~/components/NotificationItem";
import { useEffect, useState } from "react";

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await getUser(request);
  const userData =  await user.json();
  if (!userData.user) {
    return redirect("/");
  }
  

  invariant(params.id, `params.id is required`);
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
  if (!response.ok) {
    throw new Error(`Could not load pokemon ${params.id}`);
  }
  const pokemonData = await response.json();
  return json({ id: params.id, pokemonData });
};

export const action = async ({ request, params }: ActionArgs) => {
  const user = await getUser(request);
  const userData = await user.json();
  JSON.stringify(userData.user)
  const response = await fetch(`${process.env.CMS_URL}/api/users/likedPokemon/${params.id}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: userData.user.id }),
  });

  console.log(response);
  if (response.status !== 200) {
    return new Error("something went wrong");
  }
  
  return json({message: 'You liked a pokemon'})
};

export default function PokemonDetail() {
  const { id, pokemonData } = useLoaderData<typeof loader>();
  const [showNotification, setShowNotification] = useState(false);
  const data = useActionData()
  const next = parseInt(id) + 1;
  const prev = parseInt(id) - 1;

  useEffect(() => {
    let timer: NodeJS.Timeout; 
    if (data) {
      setShowNotification(true); 
      timer = setTimeout(() => {
        setShowNotification(false); 
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [data]); 

  return (
    <div className="flex h-full text-white flex-col no-underline rounded-lg">
      {showNotification && data?.message && <NotificationItem message={data.message} />}
      <div className="w-full" style={{ backgroundColor: `${TYPE_COLORS[pokemonData!.types[0].type.name]}` }}>
        <div className="flex justify-between">
          {parseInt(id) > 1 ? <Link className="text-gray-700 no-underline mx-2 self-center" to={"/pokemons/" + prev}>
            <FontAwesomeIcon 
              style={{ width: 15, height: 15, color: "white",}}
              icon={faChevronLeft}
            />
          </Link> : <div className="mx-2"></div>}
          <img src={pokemonData!.sprites.front_default} />
          {parseInt(id) != 1010 ? <Link className="text-gray-700 no-underline mx-2 self-center" to={"/pokemons/" + next}>
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{ width: 15, height: 15, color: "white",}}
              />
          </Link> : <div className="mx-2"></div>}
        </div>
        <h3 className="flex justify-center">{pokemonData!.name} 00{pokemonData!.id}</h3>
      <Form className="flex justify-center" method="post">
      <button 
        className="transition ease-in duration-200 rounded-full m-2 border-transparent bg-red-500 px-4 py-2 text-white hover:bg-red-300"
      >
        ♥
      </button>
      </Form>
      </div>
      <div className="flex m-2 flex-col">
        <div className="flex items-center justify-evenly">
          <p className="text-black">Height: {pokemonData!.height / 10} m</p>
          <p className="text-black">Width: {pokemonData!.weight / 10} kg </p>
        </div>
        <div className="flex justify-center">
          <p className="text-black">Types:</p>
          {pokemonData!.types.map(({ type: { name } }: IType) => (<span key={name} style={{ backgroundColor: `${TYPE_COLORS[name]}` }} className={`m-2 p-2 rounded-lg`}>{name}</span>))}
        </div>
      </div>
      <div className="flex justify-center">
      <div className="flex flex-col m-2">
        {pokemonData!.stats.map((stat: IStat) => (<div key={stat.stat.name} className="flex items-center">
          <p className="text-black my-0 mx-1">{STAT_SHORT_NAMES[stat.stat.name]}:</p>
          <div className="bg-gray-300 w-64 h-2.5 rounded-full">
            <div className="h-full rounded-full" style={{ width: `${stat.base_stat}px`, backgroundColor: `${STAT_COLORS[stat.stat.name]}` }}></div>
          </div>
          <p className="text-black my-0 mx-1">{stat.base_stat}</p>
        </div>))}
      </div>
      </div>
    </div>
  );
}
