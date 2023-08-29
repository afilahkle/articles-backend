import { UserType } from "src/modules/user/types/user.type";

export type ProfileType = UserType & {
  following: boolean
}