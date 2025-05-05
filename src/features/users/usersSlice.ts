import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export const getUsers = createAsyncThunk(
    "usersList/getUsers",
    async () => {
        try {
            const response = await axios.get(
                "http://jsonplaceholder.typicode.com/users"
            )
            return response.data
        } catch (error) {
            console.error(error)
        }
    })

export const usersSlice = createSlice({
    name: 'usersList',
    initialState: {
        users: [] as string[],
        isLoading: false as boolean,
        hasError: false as boolean
    },
    reducers: {
        deleteUser: (state, action) => {
            return {
                ...state,
                users: state.users.filter((user, i) => !action.payload.includes(i))
            }
        },
        addUser: (state, action) => {
            return {
                ...state,
                users: [...state.users, action.payload]
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getUsers.pending, (state, action) => {
                state.isLoading = true
                state.hasError = false
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload
                state.isLoading = false
                state.hasError = false
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.hasError = true
                state.isLoading = false
            })
    }
})

export const { deleteUser, addUser } = usersSlice.actions

export const selectUsers = state => state.usersList.users

export default usersSlice.reducer


