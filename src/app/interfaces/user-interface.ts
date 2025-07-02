import {RoleInterface} from './role-interface';

export interface UserInterface {
  public_id: string;
  name: string;
  email: string;
  roles: RoleInterface[];
}
