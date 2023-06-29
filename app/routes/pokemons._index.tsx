import { ActionArgs, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useEffect, useMemo, useState } from "react";
import NotificationItem from "~/components/NotificationItem";
import PokemonItem from "~/components/PokeItem";
import { getUser } from "~/session";

export const loader = async ({ request, context: { payload }  }: LoaderArgs) => {
  const user = await getUser(request);
  const userData =  await user.json();
  if (!userData.user) {
    return redirect("/");
  }
  
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=1010&offset=0'
  );

  if (!response.ok) {
    throw new Error(`Could not load pokemons`);
  }

  const pokemonData = await response.json();
  return json({ pokemonData });
};

export const action = async ({ request, params }: ActionArgs) => {
  const user = await getUser(request);
  const formData = await request.formData();
  const pokemonId = formData.get("pokemonId");
  const userData = await user.json();
  JSON.stringify(userData.user)

  const response = await fetch(`${process.env.CMS_URL}/api/users/likedPokemon/${pokemonId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: userData.user.id }),
  });

  if (response.status !== 200) {
    return new Error("something went wrong");
  }
  
  return json({message: 'You liked a pokemon'})
};

export default function PokemonList() { 
  const [showNotification, setShowNotification] = useState(false);
  const { pokemonData } = useLoaderData<typeof loader>();
  const data = useActionData();
  const [searchValue, setSearchValue] = useState("");
  const [sortingStrategy, setSortingStrategy] = useState("numberAsc");

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

  const sortedData = useMemo(() => {
    switch (sortingStrategy) {
      case "letterAsc":
        return [...pokemonData!.results].sort((a : IPokemon, b : IPokemon) => a.name.localeCompare(b.name));
      case "letterDesc":
        return [...pokemonData!.results].sort((a : IPokemon, b : IPokemon) => b.name.localeCompare(a.name));
      case "numberDesc":
        return [...pokemonData!.results].reverse();
      default:
        return [...pokemonData!.results];
    }
  }, [sortingStrategy, pokemonData]);

  return (
    <div>
      { data?.message && showNotification && <NotificationItem message={data!.message} />}
      <div className="flex mx-2 p-2">
        <input 
          className="block w-full w-4/5 mx-0 block pl-2 pr-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="search"
        />
      </div>
      <div className="grid lace-items-center grid-cols-2 md:grid-cols-4 gap-2 mx-2 p-2">  
        <button className="transition ease-in duration-200 rounded-lg border-transparent bg-emerald-200 px-4 py-2 text-white hover:bg-gray-400" onClick={() => setSortingStrategy("numberAsc")} >ascending by number</button>
        <button className="transition ease-in duration-200 rounded-lg border-transparent bg-red-300 px-4 py-2 text-white hover:bg-gray-400" onClick={() => setSortingStrategy("numberDesc")}>descending by number</button>
        <button className="transition ease-in duration-200 rounded-lg border-transparent bg-teal-500 px-4 py-2 text-white hover:bg-gray-400" onClick={() => setSortingStrategy("letterAsc")}>ascending by name</button>
        <button className="transition ease-in duration-200 rounded-lg border-transparent bg-purple-300 px-4 py-2 text-white hover:bg-gray-400" onClick={() => setSortingStrategy("letterDesc")}>descending by name</button>
      </div>
      <div className="grid my-2 place-items-center grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {searchValue ? sortedData!.filter((pokemon: any) => 
          pokemon.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          pokemon.url.split("/")[6].includes(searchValue)
        ).map((pokemon : IPokemon) => (<PokemonItem pokemon={pokemon} key={pokemon.url.split("/")[6]} />)) :
        sortedData!.map((pokemon : IPokemon) => (<PokemonItem pokemon={pokemon} key={pokemon.url.split("/")[6]} />))}
      </div>
    </div>
  );
}
