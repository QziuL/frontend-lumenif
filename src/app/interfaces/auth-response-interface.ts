import {UserInterface} from './user-interface';

export interface AuthResponseInterface {
  access_token: string;
  token_type: string;
  user: UserInterface;
}
