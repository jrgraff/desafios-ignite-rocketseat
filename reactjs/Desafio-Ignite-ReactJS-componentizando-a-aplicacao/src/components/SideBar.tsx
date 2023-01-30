import { Dispatch, SetStateAction } from "react";
import { GenreResponseProps } from '../shared/props/GenreResponse'

import { Button } from './Button'

interface SideBarProps {
  setSelectedGenreId: Dispatch<SetStateAction<number>>;
  genres: GenreResponseProps[];
  selectedGenreId: number;
}

export function SideBar({ setSelectedGenreId, genres, selectedGenreId }: SideBarProps) {

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <nav className="sidebar">
      <span>Watch<p>Me</p></span>

      <div className="buttons-container">
        {genres.map(genre => (
          <Button
            key={String(genre.id)}
            title={genre.title}
            iconName={genre.name}
            onClick={() => handleClickButton(genre.id)}
            selected={selectedGenreId === genre.id}
          />
        ))}
      </div>
    </nav>
  )
}