import { Form, Link, useSubmit } from "@remix-run/react";

interface IPokemonItemProps {
 pokemon: IPokemon,
}
 
const PokemonItem = ({pokemon: {url, name}} : IPokemonItemProps) => {
  const submit = useSubmit();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const $form = event.currentTarget;
    const formData = new FormData($form);
    formData.set("pokemonId", url.split("/")[6] );
    submit(formData, {
      method: "POST",
      action: $form.getAttribute("action") ?? $form.action,
    });
  }

  return (<div className="flex flex-col p-4 shadow-md rounded w-2/3 bg-indigo-300 rounded-lg">
  <Link className="text-white no-underline" to={`/pokemons/${url.split("/")[6]}`}>
  <div className="flex justify-center">
    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${url.split("/")[6]}.png`} />
  </div>
  <div className="flex justify-center">
    <p className="my-0 mx-1 self-center">00{url.split("/")[6]}</p>
    <h3 className="my-0 mx-1">{name}</h3>
  </div>
  </Link>
  <Form onSubmit={handleSubmit} className="flex justify-center" method="post">
    <button className="transition ease-in duration-200 rounded-full m-2 border-transparent bg-red-500 px-4 py-2 text-white hover:bg-red-300">♥</button>
  </Form>
</div>
);
};

export default PokemonItem;
