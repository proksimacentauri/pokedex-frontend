type IPokemon = {
    name: string
    url: string
};

type IType = {
    slot: number,
    type: {
        name: string,
    }
}

type IStat = {
    base_stat: number,
    stat: {
        name: string,
    }
}

type INotification = {
    id: string;
    createdAt: string;
    likedBy: string,
    pokemonId: string;
    acknowledged: boolean;
}
  