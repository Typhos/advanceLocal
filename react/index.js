import React, { Component } from "react";

import "./styles.scss";

export default class AdvanceLocalColumns extends Component {
  constructor() {
    super();

    this.state = {
      pokemon: null,
      comments: null,
      numberOfCommentsToShow: 25,
      numberOfPokemonToShow: 151,
    };

    this.getPokemonData = this.getPokemonData.bind(this);
    this.getCommentData = this.getCommentData.bind(this);
  }

  componentDidMount() {
    this.getPokemonData();
    this.getCommentData();
  }

  render() {
    const { pokemon, comments } = this.state;

    return (
      <article>
        <h1 className="pageHeading">Advance Local React Component</h1>

        <main className="columns">
          {/* Pokemon List */}

          {pokemon && (
            <div className="columns__column">
              <h2 className="columns__columnHeading">Kanto Pokemon</h2>
              <ul id="pokeList" className="columns__list">
                {pokemon &&
                  pokemon.map((monster) => {
                    const { name, id, sprites, types } = monster;

                    return (
                      <li key={name} className="pokemon" data-type="grass">
                        <img
                          className="pokemon__image"
                          alt={`${name} sprite`}
                          src={sprites.front_default}
                        />
                        <div className="pokemon__rightBlock">
                          <h2 className="pokemon__name">{name}</h2>
                          <sup className="pokemon__number"># {id}</sup>
                          <ul className="pokemon__typesList">
                            {types.map((type) => {
                              const {
                                type: { name },
                              } = type;

                              return (
                                <li key={`${name}_${type}`} className="pokemon__typesListItem">
                                  {name}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}

          {/* Comments Section */}

          {comments && (
            <div className="columns__column">
              <h2 className="columns__columnHeading">Top Comments</h2>
              <ul id="commentList" className="columns__list">
                {comments.map((comment) => {
                  const { body, email, id, name, postId } = comment;

                  return (
                    <li key={id + postId} className="comment">
                      <h3 className="comment__userName">{name}</h3>
                      <p className="comment__userEmail">{email}</p>
                      <p className="comment__body">{body}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </main>
      </article>
    );
  }

  getPokemonData() {
    const { numberOfPokemonToShow } = this.state;
    let pokeArray = [];

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${numberOfPokemonToShow}&offset=0`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(async (allPokemon) => {
        allPokemon.results.forEach((pokemon, index, array) => {
          pokeArray.push(fetch(pokemon.url).then((response) => response.json()));
        });

        await Promise.all(pokeArray).then((data) => {
          this.setState({ pokemon: data });
        });
      })
      .catch((err) => console.error("Fetch Error: " + err));
  }

  getCommentData() {
    const { numberOfCommentsToShow } = this.state;

    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((comments) => {
        this.setState({ comments: comments.slice(0, numberOfCommentsToShow - 1) });
      })
      .catch((err) => console.error("Fetch Error: " + err));
  }
}
