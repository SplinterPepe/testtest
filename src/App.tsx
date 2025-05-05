import styled from 'styled-components'
import { UsersTable } from './features/users/UsersTable'
import { store } from './app/store'
import { getUsers } from './features/users/usersSlice'
import { CreateUserModal } from './features/modals/CreateUserModal'

store.dispatch(getUsers())

export function App() {

    return (
        <AppStyled>
            <UsersTable />
            <CreateUserModal />
        </AppStyled>
    )
}

const AppStyled = styled.div`
    width: 100%;
    display: flex;
    background-color: #fff;
`