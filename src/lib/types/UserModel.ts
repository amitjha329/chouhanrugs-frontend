import { AdapterUser } from 'next-auth/adapters'
export interface UserModel extends AdapterUser {
    roles: Array<string>
}

export default UserModel