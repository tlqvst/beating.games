import { GameDto } from '@/generated/dto';

export interface IGame {
  game: GameDto;
  onUpdate?: () => void;
  onDelete?: () => void;
}
